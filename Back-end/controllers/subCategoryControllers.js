const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const { Role, UserRole, Category, SubCategory} = require("../models/sql");
const { Op } = require("sequelize");

exports.createSubCategory = asyncHandler(async (req, res) => {

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

    if (!isAdmin) {
        return res.status(403).json({ message: "You are not authorized to create Category. Only admins are allowed." });
    }

    const { categoryId, subCategoryName, subCategoryImage } = req.body;

    const category = await Category.findByPk(categoryId);
    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = await SubCategory.create({
        categoryId,
        subCategoryName,
        subCategorySlug: slugify(subCategoryName, { lower: true }),
        subCategoryImage
    });

    res.status(201).json({ message: "SubCategory created successfully", subCategory });
});


exports.getAllSubCategories = asyncHandler(async (req, res) => {
    let { page, limit, search, categoryId } = req.query;

    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 10;
    const offset = (page - 1) * limit;

    const whereCondition = {
        ...(search && { subCategoryName: { [Op.like]: `%${search}%` } }),
        ...(categoryId && { categoryId: categoryId })
    };

    const { count, rows } = await SubCategory.findAndCountAll({
        where: whereCondition,
        include: {
            model: Category,
            attributes: ["categoryName", "categorySlug"]
        },
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        raw: true, 
        nest: false
    });

    const formattedData = rows.map(row => ({
        subCategoryId: row.subCategoryId,
        subCategoryName: row.subCategoryName,
        subCategorySlug: row.subCategorySlug,
        subCategoryImage: row.subCategoryImage,
        categoryId: row.categoryId,
        categoryName: row["Category.categoryName"],  
        categorySlug: row["Category.categorySlug"], 
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
    }));

    res.status(200).json({
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        data: formattedData
    });
});



exports.getSubCategoryById = asyncHandler(async (req, res) => {
    const { subCategoryId } = req.params;  
    const subCategory = await SubCategory.findOne({
        where: { subCategoryId: subCategoryId },
        include: {
            model: Category,
            attributes: ["categoryName", "categorySlug"] 
        }
    });

    if (!subCategory) {
        return res.status(404).json({ message: "SubCategory not found" });
    }

    const formattedData = {
        subCategoryId: subCategory.subCategoryId,
        subCategoryName: subCategory.subCategoryName,
        subCategorySlug: subCategory.subCategorySlug,
        subCategoryImage: subCategory.subCategoryImage,
        categoryId: subCategory.categoryId,
        categoryName: subCategory.Category.categoryName, 
        categorySlug: subCategory.Category.categorySlug, 
        createdAt: subCategory.createdAt,
        updatedAt: subCategory.updatedAt
    };

    res.status(200).json(formattedData);
});





exports.updateSubCategoryById = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    console.log(userId);

    const userRoles = await UserRole.findAll({
        where: { userId },
        include: {
            model: Role,
            where: { role: 'admin' }
        }
    });

    const isAdmin = userRoles.length > 0;
    console.log(isAdmin);

    if (!isAdmin) {
        return res.status(403).json({ message: "You are not authorized to update Category. Only admins are allowed." });
    }

    const { subCategoryId } = req.params;
    const { subCategoryName, subCategoryImage, categoryId } = req.body;

    const subCategory = await SubCategory.findByPk(subCategoryId);
    if (!subCategory) {
        return res.status(404).json({ message: "SubCategory not found" });
    }

    await subCategory.update({
        subCategoryName: subCategoryName || subCategory.subCategoryName,
        subCategorySlug: subCategoryName ? slugify(subCategoryName, { lower: true }) : subCategory.subCategorySlug,
        subCategoryImage: subCategoryImage || subCategory.subCategoryImage,
        categoryId: categoryId || subCategory.categoryId
    });

    res.status(200).json({ message: "SubCategory updated successfully", subCategory });
});




exports.deleteSubCategoryById = asyncHandler(async (req, res) => {
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

    const { subCategoryId } = req.params;

    const subCategory = await SubCategory.findByPk(subCategoryId);
    if (!subCategory) {
        return res.status(404).json({ message: "SubCategory not found" });
    }

    await subCategory.destroy();
    res.status(200).json({ message: "SubCategory deleted successfully" });
});
