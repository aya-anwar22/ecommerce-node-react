const express = require('express');
const categoryControllers = require('../controllers/categoryControllers');
const authenticate = require('../middleware/authenticate');
const upload = require('../config/multerConfig');
const router = express.Router();

router.post('/', authenticate, upload.single('categoryImage'), categoryControllers.creatCategory);
router.get('/:categoryId', categoryControllers.getCategoryBYId);
router.get('/', categoryControllers.getAllCategories);
router.put('/:categoryId', authenticate, upload.single('categoryImage'), categoryControllers.updateCategoryBYId);
router.delete('/:categoryId', authenticate, categoryControllers.deleteCategoryById);

module.exports = router;