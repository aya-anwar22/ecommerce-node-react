const { validationResult } = require('express-validator');

const validatorMiddleWare = (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty){
        return res.status(400).json({ erroes: errors.array()});
    }
    next()
};
module.exports = validatorMiddleWare;