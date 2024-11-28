const express = require('express');
const router = express.Router();
const biddablesController = require('../controllers/biddablesController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Route to create a new product
router.post('/biddableProducts',authMiddleware, biddablesController.createProduct);

// Route to get all products
router.get('/biddableProducts', biddablesController.getProducts);

// Route to get a single product by ID
router.get('/bidProductDetails/:id', biddablesController.getProductById);

// Route to update a bid of a product
router.put('/biddableProducts/bid/:id',authMiddleware, biddablesController.addBid);

// Route to update a product by ID
router.put('/biddableProducts/:id',authMiddleware, biddablesController.updateProduct);

// Route to delete a product by ID
router.delete('/biddableProducts/:id',authMiddleware, biddablesController.deleteProduct);

module.exports = router;
