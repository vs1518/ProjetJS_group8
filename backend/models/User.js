//Ce modèle sera utilisé pour enregistrer les utilisateurs et gérer leurs données dans la base MongoDB.

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
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);


