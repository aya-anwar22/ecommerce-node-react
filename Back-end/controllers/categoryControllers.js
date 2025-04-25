const asyncHandler = require("express-async-handler");
const { User, UserVerification, Role, UserRole, Category, SubCategory, Brand } = require("../models/sql");
const slugify = require("slugify");
const { Op } = require("sequelize");
const cloudinary = require('../config/cloudinary');

exports.creatCategory = asyncHandler(async (req, res) => {
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

    const { categoryName } = req.body;
    if (!categoryName || !req.file) {
        return res.status(400).json({ message: "Please provide category name and image" });
    }

    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'categories'
        });

        const category = await Category.create({
            categoryName,
            categorySlug: slugify(categoryName, { lower: true }),
            categoryImage: result.secure_url
        });

        return res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({ message: "Error creating category" });
    }
});


// get get Category BY Id  (not required  token)
exports.getCategoryBYId = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const category = await Category.findByPk(categoryId);
    if (!categoryId) {
        return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json(category);
});

// get all  categories  (not required  token)
exports.getAllCategories = asyncHandler(async (req, res) => {
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

    const { categoryName } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findByPk(categoryId);
    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }

    try {
        let updateData = {
            categoryName: categoryName || category.categoryName,
            categorySlug: categoryName ? slugify(categoryName, { lower: true }) : category.categorySlug,
        };

        // If there's a new image, upload it to Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'categories'
            });
            updateData.categoryImage = result.secure_url;
        }

        await category.update(updateData);

        res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({ message: "Error updating category" });
    }
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

    await SubCategory.destroy({
        where: { categoryId: categoryId }
    });

    await category.destroy();

    res.status(200).json({ message: "Category and its related subcategories deleted successfully" });
});
