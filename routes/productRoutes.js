// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { addProduct, getProducts,getMyProducts,deleteProduct  } = require('../controllers/productController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Route for sellers to add products
router.post('/add', authMiddleware, addProduct);

// Route for buyers to view products
router.get('/view', getProducts);

// Route for sellers to view their own products
router.get('/my-products', authMiddleware, getMyProducts);

// Route for sellers to delete their own product by ID
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
