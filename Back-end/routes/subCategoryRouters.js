const express = require('express');
const subCategoryControllers = require('../controllers/subCategoryControllers');
const authenticate = require('../middleware/authenticate');
const upload = require('../config/multerConfig');
const router = express.Router();

router.post("/", authenticate, upload.single('subCategoryImage'), subCategoryControllers.createSubCategory);
router.get("/", subCategoryControllers.getAllSubCategories);
router.get("/:subCategoryId", subCategoryControllers.getSubCategoryById);
router.put("/:subCategoryId", authenticate, upload.single('subCategoryImage'), subCategoryControllers.updateSubCategoryById);
router.delete("/:subCategoryId", authenticate, subCategoryControllers.deleteSubCategoryById);

module.exports = router;
