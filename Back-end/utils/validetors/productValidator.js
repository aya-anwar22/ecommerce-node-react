// const { check } = require('express-validator');
// const Product = require('../../models/product');

// // Validetor for Product

// const productValidator = [
//     //check productName
//     check('productName')
//         .notEmpty().withMessage('Product name is required')
//         .isLength({min: 3, max: 50}).withMessage('Product name must be between 3 and 50 characters.')
//         // .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Produt Name  must contain Only letters, numbers and space')
//         .trim()
//         .escape(), // Convert any special characters to secure code to prevent XSS

//     //Check description
//     check('description')
//     .notEmpty().withMessage('Description is required')
//     .isLength({min: 3, max: 500}).withMessage('Product name must be between 3 and 500 characters.')
//     // .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Produt Name  must contain Only letters, numbers and space')
//     .trim()
//     .escape(),

//     //Check Category
//     check('categoryId')
//     .optional()
//     .isMongoId().withMessage('Invalid category ID'),

//     //Check SubCategory
//     check('subcategoriesId')
//         .optional()
//         .isMongoId().withMessage('Invalid category ID'),

//     //Check Brand
//     check('brandId')
//     .optional()
//     .isMongoId().withMessage('Invalid brand ID'),

//     //Check Color
//     check('colors')
//         .isArray({ min: 1 }).withMessage('At least one color is required')
//         .custom(colors => {
//             if (!colors.every(color => typeof color === 'string')) {
//                 throw new Error('Each color must be a string');
//             }
//             return true;
//         }),
    
//      //Check imageCover
    
     
    
//     //Check price
//     check('price')
//     .notEmpty().withMessage('Price is required')
//     .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

//     //Check discountPercentage
//     check('discountPercentage')
//         .optional()
//         .isFloat({ min: 0, max: 100 }).withMessage('Discount percentage must be between 0 and 100'),
    

//     // Check images array
//     check('images')
//     .optional()
//     .isArray().withMessage('Images must be an array')
//     .custom(images => {
//         if (!images.every(url => /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(url))) {
//             throw new Error('Each image must be a valid URL ending with .jpg, .jpeg, .png, .webp, or .gif');
//         }
//         return true;
//     }),

//     // Check stock
//     check('stock')
//         .notEmpty().withMessage('Stock is required')
//         .isInt({ min: 0 }).withMessage('Stock must be a positive integer'),

//     //      // Check sold
//     // check('sold')
//     //     .optional()
//     //     .isInt({ min: 0 }).withMessage('Sold must be a positive integer'),

// ];


// module.exports = {
//     productValidator,
// }
