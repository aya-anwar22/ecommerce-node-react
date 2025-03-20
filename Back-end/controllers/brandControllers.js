const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const { Role, UserRole, Brand} = require("../models/sql");
const { Op } = require("sequelize");



exports.createBrand = asyncHandler(async (req, res) => {
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

    const { brandName, brandImage } = req.body;

    const brandSlug = slugify(brandName, { lower: true });

    const newBrand = await Brand.create({
        brandName,
        brandSlug,
        brandImage
    });

    res.status(201).json({
        message: "Brand created successfully",
        brand: newBrand
    });
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



    const { brandId } = req.params;
    const { brandName, brandImage } = req.body;

    const brand = await Brand.findByPk(brandId);

    if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
    }

    // إنشاء slug جديد بناءً على الاسم المحدث
    const brandSlug = brandName ? slugify(brandName, { lower: true }) : brand.brandSlug;

    await brand.update({
        brandName: brandName || brand.brandName,
        brandSlug,
        brandImage: brandImage || brand.brandImage
    });

    res.status(200).json({
        message: "Brand updated successfully",
        brand
    });
});



exports.deleteBrandById = asyncHandler(async (req, res) => {

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
