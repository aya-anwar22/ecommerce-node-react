const express = require('express');
const brandControllers = require('../controllers/brandControllers');
const authenticate = require('../middleware/authenticate');
const upload = require('../config/multerConfig');
const router = express.Router();

router.post('/', authenticate, upload.single('brandImage'), brandControllers.createBrand);
router.get('/:brandId', brandControllers.getBrandById);
router.get('/', brandControllers.getAllBrands);
router.put('/:brandId', authenticate, upload.single('brandImage'), brandControllers.updateBrandById);
router.delete('/:brandId', authenticate, brandControllers.deleteBrandById);

module.exports = router;