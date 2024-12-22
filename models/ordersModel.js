const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, // Price at the time of purchase
    },
  ],
  contactDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  paymentDetails: {
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'COD'], // Razorpay or Cash on Delivery
      required: true,
    },
    cardDetails: {
      cardNumber: { type: String }, // Card details only for online payments
      expiryDate: { type: String },
      cvv: { type: String },
    },
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
  deliveryStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
});

// Add validation to enforce payment method logic
orderSchema.pre('validate', function (next) {
  const { paymentMethod, cardDetails } = this.paymentDetails;

  if (paymentMethod === 'razorpay') {
    // Razorpay requires card details
    if (!cardDetails || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
      return next(new Error('Card details are required for Razorpay payment method'));
    }
  } else if (paymentMethod === 'cod') {
    // COD should not have any card details
    if (cardDetails && (cardDetails.cardNumber || cardDetails.expiryDate || cardDetails.cvv)) {
      return next(new Error('Card details should not be provided for COD payment method'));
    }
  }

  next();
});

module.exports = mongoose.model('Order', orderSchema);
