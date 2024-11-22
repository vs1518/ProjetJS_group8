//Ces routes appellent les fonctions du contrôleur (registerUser et loginUser)

const express = require('express');

// Ensure that this import is correct
const { registerUser, loginUser } = require('../controllers/userController'); 

const router = express.Router();

// POST route for registration
router.post('/register', registerUser);

// POST route for login
router.post('/login', loginUser);

module.exports = router;


