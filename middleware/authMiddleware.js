const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config'); // Ensure the path is correct

// Middleware for JWT authentication
exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    console.log('authheader', authHeader);

    console.log('Headers:', req.headers);


    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token part
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded Token:', decoded);
        req.user = decoded; // Attach decoded token with user ID and role
        console.log('Checking userId in DB:', decoded.userId);
        next();
    } catch (error) {
        console.error('JWT Error:', error); // Log error
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

