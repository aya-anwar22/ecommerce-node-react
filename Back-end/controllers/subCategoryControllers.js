const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const { Role, UserRole, Category, SubCategory} = require("../models/sql");

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
    const subCategories = await SubCategory.findAll({
        include: { model: Category, attributes: ["categoryName"] }
    });

    res.status(200).json(subCategories);
});


exports.updateSubCategoryById = asyncHandler(async (req, res) => {
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
    const { subCategoryName, subCategoryImage } = req.body;

    const subCategory = await SubCategory.findByPk(subCategoryId);
    if (!subCategory) {
        return res.status(404).json({ message: "SubCategory not found" });
    }

    await subCategory.update({
        subCategoryName: subCategoryName || subCategory.subCategoryName,
        subCategorySlug: subCategoryName ? slugify(subCategoryName, { lower: true }) : subCategory.subCategorySlug,
        subCategoryImage: subCategoryImage || subCategory.subCategoryImage
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
