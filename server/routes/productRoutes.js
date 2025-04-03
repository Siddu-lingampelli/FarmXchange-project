const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

// Make getFarmerProducts public (no auth required)
router.get('/farmer/:farmerId', productController.getFarmerProducts);
router.get('/all', productController.getAllProducts);

// Protect these routes with auth
router.post('/', auth, productController.createProduct);
router.put('/:id', auth, productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;
