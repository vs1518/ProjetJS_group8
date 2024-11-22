//Gére l'inscription et la connexion des utilisateurs avec validation et génération de token JWT.

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration handler

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Login handler
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt with email:', email);

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        console.log('User found:', user);

        // Compare the password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(400).json({ message: "Invalid credentials." });
        }

        console.log('Password matched, generating token...');

        // Create a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Send token and user info in response
        res.status(200).json({ token, user });
    } catch (error) {
        console.error('Error in login:', error);  
        res.status(500).json({ message: "Server error", error });
    }
};