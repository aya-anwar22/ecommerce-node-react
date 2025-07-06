// admin (delete)


const asyncHandler = require("express-async-handler");
const { User, UserVerification, Role, UserRole, Category, SubCategory, Brand } = require("../models/sql");
const slugify = require("slugify");
const { Op } = require("sequelize");
const cloudinary = require('../config/cloudinary');

exports.creatCategory = asyncHandler(async (req, res) => {
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

// update  Category BY Id only by admin
exports.updateCategoryBYId = asyncHandler(async (req, res) => {
    const userId = req.user.id;
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

///////////////////////////////////////////////////////

// get all category
exports.getAllByAdmin = asyncHandler(async(req, res) =>{
    const userId = req.user.id;
    res.status(200).json(res.paginatedResults);
})


exports.getCategoryBYIdByAdmin = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { categoryId } = req.params;
    const category = await Category.findOne({categoryId});

    if (!categoryId) {
        return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json(category);
});



exports.deleteCategoryById = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized. Please log in first." });
  }

  const userId = req.user.id;

  // Check if user is admin
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

  if (!category.isDeleted) {
    // Soft delete category
    await category.update({
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId
    });

    // // Optionally: soft delete related subcategories 
    // await SubCategory.update(
    //   { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
    //   { where: { categoryId } }
    // );

    return res.status(200).json({ message: "Category soft-deleted successfully" });
  } else {
    // Restore the category
    await category.update({
      isDeleted: false,
      deletedAt: null,
      deletedBy: null
    });

    // // Restore related subcategories 
    // await SubCategory.update(
    //   { isDeleted: false, deletedAt: null, deletedBy: null },
    //   { where: { categoryId } }
    // );

    return res.status(200).json({ message: "Category restored successfully" });
  }
});


// for user
// get get Category BY Id  (not required  token)
exports.getCategoryBYId = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const category = await Category.findOne({
    where: {
      categoryId,
      isDeleted: false 
    },
    attributes: {
      exclude: ['isDeleted', 'deletedAt', 'deletedBy']
    }
  });

    if (!categoryId) {
        return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json(category);
});

// get all  categories  (not required  token)
exports.getAllCategories = asyncHandler(async (req, res) => {
  res.status(200).json(res.paginatedResults);
});






