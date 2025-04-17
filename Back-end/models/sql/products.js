const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const { Brand, SubCategory } = require("./categories_brands");

const Product = sequelize.define("Product", {
    productId: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    productName: { 
        type: DataTypes.STRING(100), 
        allowNull: false 
    },
    productslug: { 
        type: DataTypes.STRING(100), 
        unique: true, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT 
    },
    brandId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Brand, key: 'brandId' },
        onDelete: "CASCADE"
    },
    imageCover: { 
        type: DataTypes.TEXT 
    },
    price: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    discountPrice: { 
        type: DataTypes.DECIMAL(10, 2) 
    },
    stock: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    sold: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    }
}, { timestamps: true });



const ProductSubCategory = sequelize.define("ProductSubCategory", {
    ProductSubCategoryId: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    productId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Product, key: 'productId' },
        onDelete: "CASCADE"
    },
    subCategoryId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: SubCategory, key: 'subCategoryId' },
        onDelete: "CASCADE"
    }
}, { timestamps: true });




const ProductColors = sequelize.define("ProductColors", {
    ProductColorsId: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    productId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Product, key: 'productId' },
        onDelete: "CASCADE"
    },
    color: { 
        type: DataTypes.STRING(50), 
        allowNull: false 
    }
}, { timestamps: true });

const ProductImages = sequelize.define("ProductImages", {
    ProductImagesId: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    productId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Product, key: 'productId' },
        onDelete: "CASCADE"
    },
    imageURL: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    }
}, { timestamps: true });


const ProductCategory = sequelize.define("ProductCategory", {}, { timestamps: true });

module.exports = {Product, ProductCategory, ProductImages, ProductColors, ProductSubCategory};
