const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { ValidationError, ConflictError } = require('../utils/errors');
const validators = require('../utils/validators');

const userService = {
    validateUserData: (userData) => {
        const { email, password } = userData;
        let allErrors = [];

        const emailValidation = validators.validateEmail(email);
        if (!emailValidation.isValid) {
            allErrors = allErrors.concat(emailValidation.errors);
        }

        const passwordValidation = validators.validatePassword(password, { minLength: 6, requireStrong: true });
        if (!passwordValidation.isValid) {
            allErrors = allErrors.concat(passwordValidation.errors);
        }

        if (allErrors.length > 0) {
            throw new ValidationError('Données invalides', allErrors);
        }
    },


    createUser: async (userData) => {
        const { email, password } = userData;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ 
            email: email.toLowerCase().trim() 
        });

        if (existingUser) {
            throw new ConflictError('Un utilisateur avec cet email existe déjà');
        }

        // Hasher le mot de passe
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Créer l'utilisateur
        const newUser = new User({
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            createdAt: new Date()
        });

        // Sauvegarder en base
        const savedUser = await newUser.save();

        // Retourner l'utilisateur sans le mot de passe
        const userResponse = savedUser.toObject();
        delete userResponse.password;

        return userResponse;
    }
};

module.exports = userService;