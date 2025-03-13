// const { check } = require('express-validator');
// const Brand = require('../../models/brand');

// // Validtor for brand
// const brandValidator = [
//     check('name')
//         .notEmpty().withMessage('Name is required')
//         .isLength({min:3, max: 50}).withMessage('Brand name must be betwwen 3 to 50 characters Brand name must be between 3 and 50 characters.')
//         // .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Brand name must contain only letters, numbers, and spaces.')
//         .trim()
//         .escape(), //// Convert any special characters to secure code to prevent XSS

//     check('image')
//         .optional()
//         .isURL().withMessage('Invalid image URL.')
//         .trim(),

// ];

// module.exports = {
//     brandValidator,
// }
