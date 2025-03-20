const express = require('express');
const brandControllers = require('../controllers/brandControllers');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.post('/', authenticate, brandControllers.createBrand);
router.get('/:brandId', brandControllers.getBrandById);
router.get('/', brandControllers.getAllBrands);
router.put('/:brandId', authenticate, brandControllers.updateBrandById);
router.delete('/:brandId', authenticate, brandControllers.deleteBrandById);


module.exports = router;