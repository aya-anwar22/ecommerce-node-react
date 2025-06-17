
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const { User, UserVerification, Role, UserRole } =  require('./users');
const  { Category, SubCategory, Brand} = require('./categories_brands');


// User => UserVerification    -One TO One-
User.hasOne(UserVerification, { foreignKey: "userId", onDelete: "CASCADE" });
UserVerification.belongsTo(User, { foreignKey: "userId" });

// UserRole =>  User + Role   - Many TO Many -
// User.belongsToMany(Role, { through: UserRole, foreignKey: "userId" });
// Role.belongsToMany(User, { through: UserRole, foreignKey: "roleId" });
User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId', otherKey: 'roleId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId', otherKey: 'userId' });

UserRole.belongsTo(Role, { foreignKey: "roleId" });
UserRole.belongsTo(User, { foreignKey: "userId" });

// Category => SubCategory - One To Many -
Category.hasMany(SubCategory, { foreignKey: "categoryId", onDelete: "CASCADE" });
SubCategory.belongsTo(Category, { foreignKey: "categoryId" });

module.exports = {
    sequelize,
    User, UserVerification, Role, UserRole,
    Category, SubCategory, Brand
   
};