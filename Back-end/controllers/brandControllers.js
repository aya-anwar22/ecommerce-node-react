const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const { Role, UserRole, Brand } = require("../models/sql");
const { Op } = require("sequelize");
const cloudinary = require('../config/cloudinary');

exports.createBrand = asyncHandler(async (req, res) => {
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
        return res.status(403).json({ message: "You are not authorized to create Brand. Only admins are allowed." });
    }

    const { brandName } = req.body;

    if (!brandName || !req.file) {
        return res.status(400).json({ message: "Please provide brand name and image" });
    }

    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'brands'
        });

        const brandSlug = slugify(brandName, { lower: true });

        const newBrand = await Brand.create({
            brandName,
            brandSlug,
            brandImage: result.secure_url
        });

        res.status(201).json({
            message: "Brand created successfully",
            brand: newBrand
        });
    } catch (error) {
        console.error('Error creating brand:', error);
        return res.status(500).json({ message: "Error creating brand" });
    }
});

exports.getBrandById = asyncHandler(async (req, res) => {
    const { brandId } = req.params;

    const brand = await Brand.findByPk(brandId);

    if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
    }

    res.status(200).json(brand);
});

exports.getAllBrands = asyncHandler(async (req, res) => {
    let { page, limit, search } = req.query;

    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 10;
    const offset = (page - 1) * limit;

    const whereCondition = search
        ? { brandName: { [Op.like]: `%${search}%` } }
        : {};
    const { count, rows } = await Brand.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        order: [["createdAt", "DESC"]]
    });

    res.status(200).json({
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        data: rows
    });
});

exports.updateBrandById = asyncHandler(async (req, res) => {
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
        return res.status(403).json({ message: "You are not authorized to update Brand. Only admins are allowed." });
    }

    const { brandId } = req.params;
    const { brandName } = req.body;

    const brand = await Brand.findByPk(brandId);

    if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
    }

    try {
        let updateData = {
            brandName: brandName || brand.brandName,
            brandSlug: brandName ? slugify(brandName, { lower: true }) : brand.brandSlug
        };

        // If there's a new image, upload it to Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'brands'
            });
            updateData.brandImage = result.secure_url;
        }

        await brand.update(updateData);

        res.status(200).json({
            message: "Brand updated successfully",
            brand
        });
    } catch (error) {
        console.error('Error updating brand:', error);
        return res.status(500).json({ message: "Error updating brand" });
    }
});

exports.deleteBrandById = asyncHandler(async (req, res) => {
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
        return res.status(403).json({ message: "You are not authorized to delete Brand. Only admins are allowed." });
    }

    const { brandId } = req.params;

    const brand = await Brand.findByPk(brandId);

    if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
    }

    await brand.destroy();

    res.status(200).json({
        message: "Brand deleted successfully"
    });
});
