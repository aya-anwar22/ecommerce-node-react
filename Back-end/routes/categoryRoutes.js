const express = require('express');
const categoryControllers = require('../controllers/categoryControllers');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.post('/',authenticate,  categoryControllers.creatCategory);
router.get('/:categoryId',  categoryControllers.getCategoryBYId);
router.get('/',  categoryControllers.getAllCategories);
router.put('/:categoryId',authenticate,  categoryControllers.updateCategoryBYId);
router.delete('/:categoryId',authenticate,  categoryControllers.deleteCategoryById);


module.exports = router;