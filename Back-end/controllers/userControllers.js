const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { User, UserVerification, Role, UserRole} = require("../models/sql");
const cloudinary = require('../config/cloudinary');
const { Op } = require("sequelize");


const isAdminUser = async (userId) => {
    const userRoles = await UserRole.findAll({
        where: { userId },
        include: {
            model: Role,
            where: { role: 'admin' }
        }
    });

    return userRoles.length > 0;
};


// add user only by admin
exports.addUser = asyncHandler(async(req, res) => {

    const userId = req.user.id;
    const isAdmin = await isAdminUser(userId);

    if(!isAdmin){
        return res.status(403).json({ message: "You are not authorized to create User. Only admins are allowed." });
    }
    const {userName , email, password,confirmPassword, role, phoneNumber} = req.body;

    if(password !== confirmPassword){
        return res.status(400).json({message: "PassWord not match"});
    }

    const existingUser = await User.findOne({ where: { email }, include: UserVerification });

    if(existingUser){
        if (existingUser.UserVerification && existingUser.UserVerification.isVerified) {
            return res.status(409).json({message: "User already exists"})
        } else {
            return res.status(409).json({message: "User already exists but not verified"})
        }
    }else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            userName , email, password: hashedPassword,  phoneNumber
        });

        const roleRecored = await Role.findOne({ where: { role }});
        await newUser.addRole(roleRecored);

        await UserVerification.create({
            userId: newUser.id,
            isVerified: true
        });
        
    }
    return res.status(201).json({message: "User added successfully by admin"});

});


// get user by himself by token
exports.getUserByToken = asyncHandler(async(req, res) => {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
        attributes: {exclude: ["password", "refreshToken", "refreshTokenExpiry"]}
    });

    if(!user){
        return res.status(404).json({message: "User not found"})
    }

    return res.status(201).json({message: user})

});


// get user by admin
exports.getUserByAdmin = asyncHandler(async(req, res) => {
    const userToken = req.user.id;
    const isAdmin = await isAdminUser(userToken);

    if(!isAdmin){
        return res.status(403).json({ message: "You are not authorized to create User. Only admins are allowed." });
    }

    const { userId } = req.params;
    const user = await User.findByPk(userId, {
        attributes: {exclude:  ["password", "refreshToken", "refreshTokenExpiry"]},
        include: [
            {
                model: Role,
                through: { attributes: [] }, 
                attributes: ['role']
            }
        ]
    });

    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    return res.status(201).json({message: user})
});

// get all user by admin
exports.getAllUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const isAdmin = await isAdminUser(userId);

    if (!isAdmin) {
        return res.status(403).json({ message: "You are not authorized. Only admins are allowed." });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { search } = req.query;

    const whereCondition = {};
    if (search) {
        whereCondition[Op.or] = [
            { email: { [Op.like]: `%${search}%` } }
        ];
    }

    const { count, rows: users } = await User.findAndCountAll({
        where: whereCondition,
        attributes: { exclude: ["password", "refreshToken", "refreshTokenExpiry"] },
        include: [
            {
                model: Role,
                through: { attributes: [] },
                attributes: ['role']
            }
        ],
        offset,
        limit
    });

    if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({
        totalUsers: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        users
    });
});




// update user by himself OR  by admin
exports.updateUser = asyncHandler(async(req, res) => {
    const loggedInUserId = req.user.id;
    const isAdmin = await isAdminUser(loggedInUserId);
    const targetUserId = isAdmin ? req.params.userId : loggedInUserId;

    const user = await User.findByPk(targetUserId);
    if(!user){
        return res.status(404).json({message: "User not found"})
    }

    if(isAdmin){
        const { role } = req.body;
        console.log(req.body)
        if(!role){
            return res.status(403).json({meaage:  "Admin can only update the role"})
        }
    
    const roleRecord = await Role.findOne({ where: { role }});
    console.log(`roleRecord ${roleRecord}`);
    if(!roleRecord){
        return res.status(400).json({message: "Invalid role"});
    }
    await user.setRoles([roleRecord]);
    return res.status(200).json({message: "User role updated by admin."})
    }

    else {
        const { userName, phoneNumber } = req.body;
        let profilePicture = user.profilePicture;
    
        // لو فيه صورة جديدة
        if (req.file) {
            const result = await cloudinary.uploader.upload_stream(
                { folder: 'users' },
                async (error, result) => {
                    if (error) {
                        console.error('Cloudinary Error:', error);
                        return res.status(500).json({ message: 'Image upload failed.' });
                    }
    
                    profilePicture = result.secure_url;
                    await user.update({ userName, phoneNumber, profilePicture });
                    return res.status(200).json({ message: 'User profile updated successfully', profilePicture });
                }
            );
    
            // رفع الصورة من البافر
            result.end(req.file.buffer);
        } else {
            // بدون صورة
            await user.update({ userName, phoneNumber, profilePicture });
            return res.status(200).json({ message: 'User profile updated successfully' });
        }
    }
    
});



// delet user by himself OR  by  admin
exports.deleteUser = asyncHandler(async(req, res) => {
    const loggedInUserId = req.user.id;
    const isAdmin = await isAdminUser(loggedInUserId);
    const targetUserId = isAdmin ? req.params.userId: loggedInUserId;

    const user = await User.findByPk(targetUserId);
    if(!user){
        return res.status(404).json({message: "User not found."});
    }

    await user.destroy();
    return res.status(200).json({ message: "User deleted successfully." });
})