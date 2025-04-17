// const { Product } = require("../models/sql");
// const asyncHandler = require("express-async-handler");
// const {User, UserVerification, Role, UserRole, Category, SubCategory, Brand} = require("../models/sql");
// const slugify = require("slugify");
// const { Op } = require("sequelize");


// const isAdminUser = async (userId) => {
//     const userRoles = await UserRole.findAll({
//         where: { userId },
//         include: {
//             model: Role,
//             where: { role: 'admin' }
//         }
//     });

//     return userRoles.length > 0;
// };


// exports.addProuct = asyncHandler(async(req, res) => {
//     const userId = req.user.id;
//     const isAdmin = isAdminUser(userId);

//     if(!isAdmin){
//         return res.status(403).json({ message: "You are not authorized to create Product. Only admins are allowed." });
//     }
//     const { productName, description, brandId, imageCover, price, discountPrice, stock, colors, images } = req.body;
//     // const productslug = 


// })