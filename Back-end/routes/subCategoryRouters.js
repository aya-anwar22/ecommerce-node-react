const express = require('express');
const subCategoryControllers = require('../controllers/subCategoryControllers');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.post("/", authenticate, subCategoryControllers.createSubCategory);
router.get("/", subCategoryControllers.getAllSubCategories);
router.get("/:subCategoryId", subCategoryControllers.getSubCategoryById);
router.put("/:subCategoryId", authenticate, subCategoryControllers.updateSubCategoryById);
router.delete("/:subCategoryId", authenticate, subCategoryControllers.deleteSubCategoryById);

module.exports = router;
