import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const protect = (req, res, next) => {
    // Extract the token from the 'Authorization' header
    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Remove "Bearer " prefix if it exists
    if (token.startsWith('Bearer ')) {
        token = token.slice(7).trim();
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, config.JWT_SECRET);

        // Add the user ID from the token to the request object
        req.user = decoded.id;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};
