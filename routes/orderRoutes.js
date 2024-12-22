const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController'); // Import the controller

// Route to place an order
router.post('/place-order' ,orderController.placeOrder);

// Route to fetch order details for a specific user
router.get('/MyorderDetails/:userId', orderController.getOrderDetails);

module.exports = router;
