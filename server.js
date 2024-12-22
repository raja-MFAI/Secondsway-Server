const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const initializeCronJobs = require('./cornJobs');
const dotenv = require('dotenv');
const path = require('path');

const { authMiddleware } = require('./middleware/authMiddleware'); // Adjust the path as needed

const { MONGO_URI } = require('./config');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const biddablesRoutes = require('./routes/biddablesRoutes'); 
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
    'https://secondsway-off.onrender.com',
    'http://localhost:3000'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));



// app.use(cors({
//     origin: 'https://secondsway-off.onrender.com',  // Replace with the exact origin of your frontend
//     credentials: true,                // Allow credentials
// }));


// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/upload',authMiddleware, uploadRoutes); 
app.use('/biddables', biddablesRoutes);
app.use('/orders', orderRoutes);


mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(5000, () => {
         console.log('Server running on port 5000');
         initializeCronJobs(); // Start the cron jobs
        }))
    .catch((error) => console.log(error)); 
