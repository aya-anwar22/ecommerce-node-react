// const { check } = require('express-validator');
// const User = require('../../models/user');

// // Validator for Register
// const registerValidator = [
//     check('userName')
//         .notEmpty().withMessage('Name is required.')
//         .trim().isLength({ min: 3, max: 20 }).withMessage('Name must be between 3 and 20 characters.'),
//         // .matches(/^[A-Za-z0-9 ]+$/).withMessage('Name must contain only letters, numbers, and spaces.'),

//     check('email')
//         .notEmpty().withMessage('Email is required.')
//         .isEmail().withMessage('Please enter a valid email address.')
//         .custom(async (value) => {
//             const existingUser = await User.findOne({ email: value });
//             if (existingUser) {
//                 throw new Error('Email is already in use.');
//             }
//             return true;
//         }),

//     check('password')
//         .notEmpty().withMessage('Password is required.')
//         .isLength({ min: 8, max: 20 }).withMessage('Password must be between 8 and 20 characters.'),
//         // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
//         // .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'),

//     check('confirmPassword')
//         .notEmpty().withMessage('Please confirm your password.')
//         .custom((value, { req }) => {
//             if (value !== req.body.password) {
//                 throw new Error('Passwords must match.');
//             }
//             return true;
//         }),

//     check('phoneNumber')
//         .notEmpty().withMessage('Phone number is required.')
//         .matches(/^\+20\d{10}$/).withMessage('Please enter a valid Egyptian phone number starting with +20.'),
// ];



// // Validator for Register
// const updateUserValidator = [
//     check('userName')
//         .notEmpty().withMessage('Name is required.')
//         .trim().isLength({ min: 3, max: 20 }).withMessage('Name must be between 3 and 20 characters.')
//         .matches(/^[A-Za-z0-9 ]+$/).withMessage('Name must contain only letters, numbers, and spaces.'),


//     check('password')
//         .notEmpty().withMessage('Password is required.')
//         .isLength({ min: 8, max: 20 }).withMessage('Password must be between 8 and 20 characters.'),
//         // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
//         // .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'),

//     check('phoneNumber')
//         .notEmpty().withMessage('Phone number is required.')
//         .matches(/^\+20\d{10}$/).withMessage('Please enter a valid Egyptian phone number starting with +20.'),
// ];

// // Validator for verifyEmail
// const verifyEmailValidator = [
//     check('email')
//         .notEmpty().withMessage('Email is required.')
//         .isEmail().withMessage('Please enter a valid email address.'),

//     check('emailVerificationCode')
//     .isLength({ min: 6, max: 6 }).withMessage('Email verification code must be exactly 6 characters.'),

// ];

// // Validator for Login
// const loginValidator = [
//     check('email')
//         .notEmpty().withMessage('Email is required.')
//         .isEmail().withMessage('Please enter a valid email address.'),

//     check('password')
//         .notEmpty().withMessage('Password is required.'),
// ];


// // Validator for Forget Password
// const forgetPasswordValidator = [
//     check('email')
//         .notEmpty().withMessage('Email is required.')
//         .isEmail().withMessage('Please enter a valid email address.'),

// ];

// // Validator for Reset Password
// const resetPasswordValidator = [
//     check('email')
//         .notEmpty().withMessage('Email is required.')
//         .isEmail().withMessage('Please enter a valid email address.'),

//     check('resetCode')
//         .notEmpty().withMessage('Reset code is required.')
//         .isLength({ min: 6, max: 6 }).withMessage('Reset code must be exactly 6 characters.'),

//     check('newPassword')
//         .notEmpty().withMessage('New password is required.')
//         .isLength({ min: 8, max: 20 }).withMessage('New password must be between 8 and 20 characters.')
//         // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
//         // .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'),
// ];

// module.exports = {
//     registerValidator,
//     loginValidator,
//     resetPasswordValidator,
//     forgetPasswordValidator,
//     verifyEmailValidator,
//     updateUserValidator
// };
