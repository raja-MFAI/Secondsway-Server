const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const { authMiddleware } = require('./middleware/authMiddleware'); // Adjust the path as needed

const { MONGO_URI } = require('./config');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',  // Replace with the exact origin of your frontend
    credentials: true,                // Allow credentials
}));


// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/upload',authMiddleware, uploadRoutes); 


mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(5000, () => console.log('Server running on port 5000')))
    .catch((error) => console.log(error)); 
