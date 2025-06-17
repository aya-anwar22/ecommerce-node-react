const express = require('express');
const brandControllers = require('../controllers/brandControllers');
const authenticate = require('../middleware/authenticate');
const upload = require('../config/multerConfig');
const router = express.Router();
// Admin-only brand management routes
router.post('/', authenticate, upload.single('brandImage'), brandControllers.createBrand);
router.get('/admin/all', authenticate, brandControllers.getAllBrandsForAdmin);
router.get('/admin/:brandId', authenticate, brandControllers.getBrandDetailsForAdmin);
router.put('/:brandId', authenticate, upload.single('brandImage'), brandControllers.updateBrandById);
router.delete('/:brandId', authenticate, brandControllers.deleteBrandById);

// User- brand management routes
router.get('/', brandControllers.getAllBrands);
router.get('/:brandId', brandControllers.getBrandById);


module.exports = router;