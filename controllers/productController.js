// controllers/productController.js
const Product = require('../models/productModel');
const User = require('../models/userModel'); // Assuming this references the Users collection

// Add product (for sellers)
exports.addProduct = async (req, res) => {
    const { name, description, price, category, condition, images } = req.body;

    if (!req.user || !req.user.userId) {
        return res.status(400).json({ message: 'User information missing in request' });
    }

    const newProduct = new Product({
        name,
        description,
        price,
        category,
        condition,
        images,
        user: req.user.userId // Use user ID from the JWT
    });

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: savedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
};

// Get all products (for buyers)
exports.getProducts = async (req, res) => {
    console.log('Fetching products...');
    try {
        const products = await Product.find().populate('user', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};


exports.getMyProducts = async (req, res) => {
    try {
        const userId = req.user.userId; // Get the user's ID from the decoded token
        const products = await Product.find({ user: userId }); // Find products by user ID
        console.log('userId:', userId);
        console.log('Products:', products);

        res.status(200).json(products); // Return the products
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};


exports.deleteProduct = async (req, res) => {
  console.log('Received delete request for ID:', req.params.id);
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.status(200).send({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in delete operation:', error);
    res.status(500).send({ message: 'Server error occurred' });
  }
};
