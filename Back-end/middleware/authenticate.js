const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

const authenticate = asyncHandler(async(req, res, next) =>{
    const token = req.header('Authorization')?.replace('Bearer ', '');
    // check the token is in the header
    if(token){
        try{
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            const user = await User.findById(decoded.userId).select('-password');
            console.log(token)

            if(!user){
                return res.status(401).json({message: "Unauthorized: User not found"});
            }
            req.user = user;
            next();
        } catch(error){
            console.error("error virification token", error.message);
            return res.status(401).json({message: "Unauthorized: Invalid Token"});
        }
    } else{
        // console.log(token)
        return res.status(401).json({message: "Unauthorized: Invalid Token"});
    }
});
module.exports = authenticate

