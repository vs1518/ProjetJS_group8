const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définir le schéma utilisateur
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

// Hasher le mot de passe avant de sauvegarder
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Si le mot de passe n'est pas modifié, on continue
    this.password = await bcrypt.hash(this.password, 10); // Hachage du mot de passe
    next(); // On continue la sauvegarde
});

// Exporter le modèle utilisateur
module.exports = mongoose.model('User', UserSchema);
