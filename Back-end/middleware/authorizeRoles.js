const { UserRole, Role } = require("../models/sql");

const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      const userRoles = await UserRole.findAll({
        where: { userId },
        include: {
          model: Role,
          where: {
            role: allowedRoles
          }
        }
      });

      const hasAccess = userRoles.length > 0;

      if (!hasAccess) {
        return res.status(403).json({
          message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({ message: "Server error during authorization." });
    }
  };
};

module.exports = authorize;
