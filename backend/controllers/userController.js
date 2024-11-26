const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fonction d'enregistrement
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

         // Log pour afficher les données reçues
            console.log("Registration request received:", req.body);

        // Vérifier si tous les champs sont envoyés
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Vérifier si l'email est déjà utilisé
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hacher le mot de passe avant de sauvegarder
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer et sauvegarder l'utilisateur
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Fonction de connexion
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'email et le mot de passe sont présents
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Trouver l'utilisateur par email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Comparer le mot de passe avec le haché stocké
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Créer un token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Envoyer le token et l'utilisateur en réponse
        res.status(200).json({ token, user });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
