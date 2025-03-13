// const { check } = require('express-validator');
// const Service = require('../../models/service');

// // Validator for Service
// const serviceValidator = [
//     // Check serviceName
//     check('serviceName')
//         .notEmpty().withMessage('Service Name is required')
//         .isLength({ min: 3, max: 50 }).withMessage('Service Name must be between 3 and 50 characters')
//         .trim()
//         .escape(), // Convert any special characters to secure code to prevent XSS

//     // Check description
//     check('description')
//         .notEmpty().withMessage('Description is required')
//         .isLength({ min: 3, max: 500 }).withMessage('Description must be between 3 and 500 characters')
//         .trim()
//         .escape(),

//     // Check Category ID
//     check('categoryId')
//         .optional()
//         .isMongoId().withMessage('Invalid category ID'),

//     // Check Subcategories (must be an array of valid Mongo IDs)
//     check('subcategoriesId')
//         .optional()
//         .isArray().withMessage('Subcategories must be an array')
//         .custom((value) => {
//             if (!value.every(id => typeof id === 'string' && /^[a-f\d]{24}$/i.test(id))) {
//                 throw new Error('Invalid subcategory ID(s)');
//             }
//             return true;
//         }),

//     // Check Price
//     check('price')
//         .notEmpty().withMessage('Price is required')
//         .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

//     // Check Estimated Time (optional but must be a valid string)
//     check('estimatedTime')
//         .optional()
//         .isString().withMessage('Estimated time must be a valid string'),

//     // Check Service Center (optional but must be a valid string)
//     check('serviceCenter')
//         .optional()
//         .isString().withMessage('Service Center must be a valid string'),

//     // Check Image Cover (optional but must be a valid URL if provided)
//     check('imageCover')
//      .trim()
//     //  .escape()
//      .custom(url => {
//         if (typeof url !== 'string') {
//             throw new Error('ImageCover must be a string URL');
//         }

//          if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(url)) {
//              throw new Error('ImageCover must be a valid URL ending with .jpg, .jpeg, .png, .webp, or .gif');
//          }
//          return true;
//      }),
  
// ];

// module.exports = { serviceValidator };
