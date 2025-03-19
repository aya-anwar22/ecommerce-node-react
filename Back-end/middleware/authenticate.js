const jwt = require('jsonwebtoken');
const { User } = require('../models/sql'); 
const asyncHandler = require('express-async-handler');

const authenticate = asyncHandler(async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            
            const user = await User.findOne({ 
                where: { id: decoded.userId }, 
                attributes: { exclude: ['password'] } 
            });
            
            if (!user) {
                return res.status(401).json({ message: "Unauthorized: User not found" });
            }
            
            req.user = user;
            next();
        } catch (error) {
            console.error("Error verifying token", error.message);
            return res.status(401).json({ message: "Unauthorized: Invalid Token" });
        }
    } else {
        return res.status(401).json({ message: "Unauthorized: Invalid Token" });
    }
});

module.exports = authenticate;