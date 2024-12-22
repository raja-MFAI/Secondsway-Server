const Order = require('../models/ordersModel'); // Assuming your order model is in 'models/ordersModel.js'
const User = require('../models/userModel'); // Assuming this references the Users collection
const Product = require('../models/productModel');

const placeOrder = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      address,
      city,
      state,
      zipCode,
      paymentMethod,
      cardNumber,
      expiryDate,
      cvv,
      products
    } = req.body;

    console.log('Request Body:', req.body);


    if (!products  || !products.length) {
      return res.status(400).json({ message: 'Products are required.' });
    }

    // Validate payment details based on the payment method
    if (paymentMethod === 'razorpay') {
      if (!cardNumber || !expiryDate || !cvv) {
        return res.status(400).json({ message: 'Card details are required for Razorpay payment method.' });
      }
    } else if (paymentMethod === 'COD') {
      if (cardNumber || expiryDate || cvv) {
        return res.status(400).json({ message: 'Card details should not be provided for COD payment method.' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid payment method. Choose either "razorpay" or "cod".' });
    }


    // Calculate total amount
    const totalAmount = products.reduce((sum, product) => sum + product.price * (product.quantity || 1), 0);

    // Verify that all products exist in the database
    const productIds = products.map((p) => p.productId);
    const validProducts = await Product.find({ _id: { $in: productIds } });

    if (validProducts.length !== products.length) {
      return res.status(404).json({ message: 'Some products are not found.' });
    }

    
    // Create the order object
    const newOrder = new Order({
      products: products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity || 1,
        price: product.price,
      })),
      contactDetails: {
        fullName,
        email,
        mobileNumber,
        address,
        city,
        state,
        zipCode,
      },
      paymentDetails: {
        paymentMethod,
        cardDetails: paymentMethod === 'razorpay' ? { cardNumber, expiryDate, cvv } : undefined,
      },
      totalAmount,
      paymentStatus: 'Pending',
      deliveryStatus: 'Processing',
    });

    console.log('New Order:', newOrder);


    // Save the order
    const savedOrder = await newOrder.save();


    // Update the user's purchase history with the complete product data
    const user = await User.findOne({ email });
    if (user) {
      console.log('User found for email:', email);

      user.purchaseHistory.push({
        orderId: savedOrder._id,
        productIds: products.map((product) => product.productId), // Array of product IDs
        quantities: products.map((product) => product.quantity || 1), // Array of quantities
        totalPrice: totalAmount,
        purchasedAt: new Date(),
      });

      await user.save(); // Save the updated user document
    } else {
      console.warn('User not found for email:', email);
    }


    res.status(201).json({
      message: 'Order placed successfully',
      order: savedOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error placing order',
      error: err.message,
    });
  }
};



const getOrderDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Request Params:', req.params);

    // Fetch the user details
    const user = await User.findById(userId).populate({
      path: 'purchaseHistory.productIds',
      model: 'Product',
      select: 'name price', // Fetch only necessary fields
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orderDetails = user.purchaseHistory.map((item) => ({
      orderId: item.orderId,
      products: item.productIds.map((product, index) => ({
        productId: product._id,
        productName: product.name,
        productPrice: product.price,
        quantity: item.quantities[index], // Match the quantity to the product
      })),
      totalPrice: item.totalPrice,
      purchasedAt: item.purchasedAt,
    }));

    console.log("Order Details to send:", JSON.stringify(orderDetails, null, 2));

    console.log("ordered details",orderDetails.products);

    res.status(200).json({
      message: 'User order details fetched successfully',
      orderDetails,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error fetching order details',
      error: err.message,
    });
  }
};




module.exports = {
  placeOrder,
  getOrderDetails,
};
