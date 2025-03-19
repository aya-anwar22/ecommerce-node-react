
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const { User, UserVerification, Role, UserRole } =  require('./users');



// User => UserVerification    -One TO One-
User.hasOne(UserVerification, { foreignKey: "userId", onDelete: "CASCADE" });
UserVerification.belongsTo(User, { foreignKey: "userId" });

// UserRole =>  User + Role   - Many TO Many -
User.belongsToMany(Role, { through: UserRole, foreignKey: "userId" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "roleId" });

UserRole.belongsTo(Role, { foreignKey: "roleId" });
UserRole.belongsTo(User, { foreignKey: "userId" });


module.exports = {
    sequelize,
    User, UserVerification, Role, UserRole,
   
};