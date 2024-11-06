// models/productModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true, enum: ['new', 'used'] },
    images: { type: [String], default: [] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
