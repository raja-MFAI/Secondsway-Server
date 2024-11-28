const BiddableProduct = require('../models/biddablesModel');

// Create a new biddable product
exports.createProduct = async (req, res) => {
  try {
      const productData = {
          ...req.body,
          user: req.user.userId,
          biddingHistory: [],
          highestBid: 0 
      };

      const product = new BiddableProduct(productData);
      await product.save();

      res.status(201).json(product);
  } catch (error) {
      console.error('Error while creating product:', error);
      res.status(400).json({ message: error.message });
  }
};



// Get biddable products
exports.getProducts = async (req, res) => {
  try {
    const products = await BiddableProduct.find()
      .populate('user', 'name')
      .populate('biddingHistory.userId', 'name'); // Populate user details in the bidding history
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Fetch a single biddable product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Request Params:', req.params);

    const product = await BiddableProduct.findById(id)
      .populate('user', 'name')
      .populate('biddingHistory.userId', 'name');

    if (!product) {
      console.log('Product not found for ID:', id);
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error while fetching product by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const product = await BiddableProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await BiddableProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// biddablesController.js

exports.addBid = async (req, res) => {
  try {
    console.log("Processing bid update...");
    const { id } = req.params;
    const { userId, amount } = req.body;
    
    // Log the received data
    console.log('Product ID:', id);
    console.log('User ID:', userId);
    console.log('Bid Amount:', amount);

    const product = await BiddableProduct.findById(id);
    
    if (!product) {
      console.log('Product not found');
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validate bid amount against highest bid
    if (amount <= product.highestBid) {
      console.log('Invalid bid amount');
      return res.status(400).json({ 
        message: `Bid amount must be higher than the current highest bid of $${product.highestBid}` 
      });
    }

    // Update bidding history and highest bid
    const newBid = {
      userId,
      amount,
      timestamp: new Date()
    };

    product.biddingHistory.push(newBid);
    product.highestBid = amount;


    // Save the updated product
    const updatedProduct = await product.save();
    console.log('Bid successfully added');

    res.status(200).json({ 
      success: true, 
      message: 'Bid placed successfully',
      product: updatedProduct 
    });

  } catch (error) {
    console.error('Error while adding a bid:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error while processing bid',
      error: error.message 
    });
  }
};