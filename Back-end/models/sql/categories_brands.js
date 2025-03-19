// Category SubCategory   Brand
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Category = sequelize.define("Category", {
    categoryId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    categoryName: {type: DataTypes.STRING(100), allowNull: false},
    categorySlug: {type: DataTypes.STRING(100)},
    categoryImage: {type: DataTypes.TEXT}
}  ,{ timestamps: true });



const SubCategory = sequelize.define("subCategory", {
    subCategoryId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    categoryId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: "Category", key: "categoryId" }, 
        onDelete: "CASCADE"
    },
    subCategoryName: {type: DataTypes.STRING(100), allowNull: false},
    subCategorySlug: {type: DataTypes.STRING(100)},
    subCategoryImage: {type: DataTypes.TEXT}
}  ,{ timestamps: true });



const Brand = sequelize.define("Brand", {
    brandId: {type: DataTypes.STRING, autoIncrement: true, primaryKey: true},
    brandName: {type: DataTypes.STRING(100), allowNull: false},
    brandSlug: {type: DataTypes.STRING(100)},
    brandImage: {type: DataTypes.TEXT}
}  ,{ timestamps: true });


module.exports = { Category, SubCategory, Brand};