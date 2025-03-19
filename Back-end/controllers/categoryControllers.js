const asyncHandler = require("express-async-handler");
const {User, UserVerification, Role, UserRole, Category, SubCategory, Brand} = require("../models/sql");
const slugify = require("slugify");
const { Op } = require("sequelize");

exports.creatCategory = asyncHandler(async(req, res) => {
    const userId = req.user.id;
    console.log(userId)
    const userRoles = await UserRole.findAll({
        where: { userId },
        include: {
            model: Role,
            where: { role: 'admin' }
        }
    });

    const isAdmin = userRoles.length > 0;
    console.log(isAdmin)

    if (!isAdmin) {
        return res.status(403).json({ message: "You are not authorized to create Category. Only admins are allowed." });
    }

    const {categoryName, categoryImage} = req.body;
    if(!categoryName || !categoryImage){
        return res.status(400).json({message: "Please Provied all faileds." });
    }

    const category = await Category.create({
        categoryName, 
        categorySlug: slugify(categoryName, { lower: true }),
        categoryImage
    });
    return res.status(201).json({message: "Category creates Successfully"});
});


// get get Category BY Id  (not required  token)
exports.getCategoryBYId = asyncHandler(async(req, res) => {
    const { categoryId } =  req.params;
    const category = await Category.findByPk(categoryId);
    if(!categoryId){
        return res.status(404).json({message: "Category not found"});
    }
    return res.status(200).json(category);
});

// get all  categories  (not required  token)
exports.getAllCategories = asyncHandler(async(req, res) => {
        let { page = 1, limit = 10, search = "" } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        let whereCondition = {};
        if (search) {
            whereCondition.categoryName = { 
                [Op.like]: `%${search}%` 
            };
        }

        const { count, rows: categories } = await Category.findAndCountAll({
            where: whereCondition,
            limit,
            offset: (page - 1) * limit,
        });

        res.status(200).json({
            totalCategories: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            categories,
        });
});


// update  Category BY Id only by admin
exports.updateCategoryBYId = asyncHandler(async (req, res) => {
    const userId = req.user.id; 
    console.log(userId);

    const userRoles = await UserRole.findAll({
        where: { userId },
        include: {
            model: Role,
            where: { role: 'admin' },
        },
    });

    const isAdmin = userRoles.length > 0;
    console.log(isAdmin);

    if (!isAdmin) {
        return res.status(403).json({ message: "You are not authorized to update Category. Only admins are allowed." });
    }

    const { categoryName, categoryImage } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findByPk(categoryId);
    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }

    await category.update({
        categoryName: categoryName || category.categoryName,
        categoryImage: categoryImage || category.categoryImage,
        categorySlug: categoryName ? slugify(categoryName, { lower: true }) : category.categorySlug,
    });

    res.status(200).json({ message: "Category updated successfully", category });
});




exports.deleteCategoryById = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized. Please log in first." });
    }
    const userId = req.user.id;
    const userRoles = await UserRole.findAll({
        where: { userId },
        include: {
            model: Role,
            where: { role: 'admin' }
        }
    });

    const isAdmin = userRoles.length > 0;
    if (!isAdmin) {
        return res.status(403).json({ message: "You are not authorized to delete categories. Only admins are allowed." });
    }

    const { categoryId } = req.params;

    const category = await Category.findByPk(categoryId);
    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();

    res.status(200).json({ message: "Category deleted successfully" });
});
