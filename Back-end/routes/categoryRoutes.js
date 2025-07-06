const express = require('express');
const categoryControllers = require('../controllers/categoryControllers');
const authenticate = require('../middleware/authenticate');
const upload = require('../config/multerConfig');
const router = express.Router();
const authorize = require('../middleware/authorizeRoles')
const paginate = require('../middleware/paginate.middleWare')
const { Category } = require("../models/sql");

router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.single('categoryImage'),
  categoryControllers.creatCategory
);

router.get('/admin/all', authenticate,
  authorize('admin'), paginate(Category, {

  }), categoryControllers.getAllByAdmin);

router.get('/admin/:categoryId', authenticate,authorize('admin'), categoryControllers.getCategoryBYIdByAdmin);

router.put('/:categoryId',  authenticate, authorize('admin'), upload.single('categoryImage'), categoryControllers.updateCategoryBYId);
router.delete('/:categoryId', authenticate,authorize('admin'),  categoryControllers.deleteCategoryById);

// for user
router.get('/:categoryId', categoryControllers.getCategoryBYId);
router.get('/',paginate(Category, {
    extraFilter: { isDeleted: false },
        excludeFields: ['isDeleted', 'deletedAt', 'deletedBy']
  }), categoryControllers.getAllCategories);

module.exports = router;