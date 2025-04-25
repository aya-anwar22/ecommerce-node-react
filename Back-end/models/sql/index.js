
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const { User, UserVerification, Role, UserRole } =  require('./users');
const  { Category, SubCategory, Brand} = require('./categories_brands');
const {Product, ProductCategory, ProductImages, ProductColors, ProductSubCategory} = require('./products')
const { Service, ServiceSubCategory } = require('./services');

// User => UserVerification    -One TO One-
User.hasOne(UserVerification, { foreignKey: "userId", onDelete: "CASCADE" });
UserVerification.belongsTo(User, { foreignKey: "userId" });

// UserRole =>  User + Role   - Many TO Many -
User.belongsToMany(Role, { through: UserRole, foreignKey: "userId" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "roleId" });

UserRole.belongsTo(Role, { foreignKey: "roleId" });
UserRole.belongsTo(User, { foreignKey: "userId" });

// Category => SubCategory - One To Many -
Category.hasMany(SubCategory, { foreignKey: "categoryId", onDelete: "CASCADE" });
SubCategory.belongsTo(Category, { foreignKey: "categoryId" });

// Product => Brand (Many to One)
Product.belongsTo(Brand, { foreignKey: 'brandId' });
Brand.hasMany(Product, { foreignKey: 'brandId' });

// Product => Category (Many to Many via ProductCategory)
Product.belongsToMany(Category, { through: ProductCategory, foreignKey: 'productId', onDelete: "CASCADE" });
Category.belongsToMany(Product, { through: ProductCategory, foreignKey: 'categoryId', onDelete: "CASCADE" });

// Product => SubCategory (Many to Many via ProductSubCategory)
Product.belongsToMany(SubCategory, { through: ProductSubCategory, foreignKey: 'productId', onDelete: "CASCADE" });
SubCategory.belongsToMany(Product, { through: ProductSubCategory, foreignKey: 'subCategoryId', onDelete: "CASCADE" });

// Product => ProductColors (One to Many)
Product.hasMany(ProductColors, { foreignKey: 'productId' });
ProductColors.belongsTo(Product, { foreignKey: 'productId' });

// Product => ProductImages (One to Many)
Product.hasMany(ProductImages, { foreignKey: 'productId' });
ProductImages.belongsTo(Product, { foreignKey: 'productId' });


// Service => Category (Many to One)
Category.hasMany(Service, { foreignKey: 'categoryId' });
Service.belongsTo(Category, { foreignKey: 'categoryId' });

// Service => SubCategory (Many to Many)
Service.belongsToMany(SubCategory, {
    through: ServiceSubCategory,
    foreignKey: 'serviceId',
    otherKey: 'subCategoryId',
    onDelete: "CASCADE"
});
SubCategory.belongsToMany(Service, {
    through: ServiceSubCategory,
    foreignKey: 'subCategoryId',
    otherKey: 'serviceId',
    onDelete: "CASCADE"
});


module.exports = {
    sequelize,
    User, UserVerification, Role, UserRole,
    Category, SubCategory, Brand,
    Product, ProductCategory, ProductImages, ProductColors, ProductSubCategory,
    Service, ServiceSubCategory
   
};