const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller'], required: true },
    purchaseHistory: [
        {
            orderId: { type: String, unique: true, required: true},
            productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }], // Array of product IDs
            quantities: [{ type: Number, required: true }], // Array of quantities
            totalPrice: { type: Number },
            purchasedAt: { type: Date },
        },
    ],
    listingHistory: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

module.exports = mongoose.model('User', userSchema);
