// Users
// UserVerification
// Roles
// UserRoles
const { DataTypes } = require("sequelize")
const sequelize = require("../../config/database");

const User = sequelize.define("User", {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    userName: {type: DataTypes.STRING(20), allowNull: false},
    email: {type: DataTypes.STRING(255), allowNull: false, unique: true},
    password: {type: DataTypes.STRING(255), allowNull: false},
    phoneNumber: {type: DataTypes.STRING(11), allowNull: false},
    profilePicture: {type: DataTypes.STRING(255)},
    refreshToken: {type: DataTypes.TEXT},
    refreshTokenExpiry: {type: DataTypes.DATE}
}, { timestamps: true });



// userId
const UserVerification = sequelize.define("UserVerification", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    emailVerificationCode: { type: DataTypes.STRING(6) },
    verificationCodeExpiry: { type: DataTypes.DATE },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    resetCode: { type: DataTypes.STRING(6) },
    resetCodeExpiry: { type: DataTypes.DATE },
}, { timestamps: true });



const Role = sequelize.define("Role", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    role: { 
        type: DataTypes.ENUM('admin', 'sub-admin', 'user'), 
        allowNull: false, 
        unique: true 
    }
}, { timestamps: true });


const UserRole  = sequelize.define("UserRole", {}, {timestamps: true});

module.exports = { User, UserVerification, Role, UserRole };
