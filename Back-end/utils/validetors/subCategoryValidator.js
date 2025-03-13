// const { check } = require('express-validator');
// const Category = require('../../models/category');

// // validetor for category
// const subCategoryValidator = [
//     check('name')
//         .notEmpty().withMessage('Name is required')
//         .isLength({min: 3, max: 50}).withMessage('Category name must be betwwen 3 to 50 charactersCategory name must be between 3 and 50 characters.')
//         // .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Category name must contain only letters, numbers, and spaces.')
//         .trim()
//         .escape(), //// Convert any special characters to secure code to prevent XSS

//     check('image')
//         .optional()
//         .isURL().withMessage('Invalid image URL.')
//         .trim(),

// ];

// module.exports = {
//     subCategoryValidator,
// }
