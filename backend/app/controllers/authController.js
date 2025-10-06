import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../../config.js';

// Register a new user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error("Error during user registration:", error.message);
        return res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error("Error during user login:", error.message);
        return res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};
