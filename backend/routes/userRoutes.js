const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController'); // Importer les fonctions du contrôleur

const router = express.Router(); // Crée un routeur Express

// Route POST pour l'enregistrement
router.post('/register', registerUser);

// Route POST pour la connexion
router.post('/login', loginUser);

module.exports = router; // Exporte le routeur
