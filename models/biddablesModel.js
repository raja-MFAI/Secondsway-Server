const mongoose = require('mongoose');

const biddableProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  basePrice: { type: Number, required: true },
  currentBid: { type: Number, required: true },
  bidStartsAt: { type: Date, required: true },
  bidDuration: {
    days: { type: Number, required: true },
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true }
  },
  startBid: { type: Boolean, required: true, default: false },
  endedBid: { type: Boolean, required: true, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  biddingHistory: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      amount: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  highestBid: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('BiddableProduct', biddableProductSchema);
