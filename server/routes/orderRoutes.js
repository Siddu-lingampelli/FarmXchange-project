const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.get('/customer', auth, orderController.getCustomerOrders);
router.get('/farmer', auth, orderController.getFarmerOrders);
router.patch('/:id', auth, orderController.updateOrderStatus);

module.exports = router;
