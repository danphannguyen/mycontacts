require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {
	ValidationError,
	ConflictError,
	NotFoundError,
	AuthError,
} = require("../utils/errors");
const validators = require("../utils/validators");
const jwt = require("jsonwebtoken");

const userService = {
	validateUserData: (userData) => {
		const { email, password } = userData;
		let allErrors = [];

		const emailValidation = validators.validateEmail(email);
		if (!emailValidation.isValid) {
			allErrors = allErrors.concat(emailValidation.errors);
		}

		const passwordValidation = validators.validatePassword(password, {
			minLength: 6,
			maxLength: 20,
			requireStrong: true,
		});
		if (!passwordValidation.isValid) {
			allErrors = allErrors.concat(passwordValidation.errors);
		}

		if (allErrors.length > 0) {
			throw new ValidationError("Données invalides", allErrors);
		}
	},

	createUser: async (userData) => {
		const { email, password } = userData;

		const existingUser = await User.findOne({
			email: email.toLowerCase().trim(),
		});

		if (existingUser) {
			throw new ConflictError("Un utilisateur avec cet email existe déjà");
		}

		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const newUser = new User({
			email: email.toLowerCase().trim(),
			password: hashedPassword,
			createdAt: new Date(),
		});

		const savedUser = await newUser.save();

		const {
			password: existingPassword,
			__v,
			updatedAt,
			...userResponse
		} = savedUser.toObject();

		return userResponse;
	},

	authenticateUser: async (userData) => {
		const { email, password } = userData;

		const existingUser = await User.findOne({
			email: email.toLowerCase().trim(),
		});

		if (!existingUser) {
			throw new NotFoundError(`Aucun utilisateur n'est rattaché à cet email`);
		}

		const isMatch = await bcrypt.compare(password, existingUser.password);

		if (!isMatch) {
			throw new AuthError("Identifiants incorrects. Veuillez réessayer");
		}

		const {
			password: existingPassword,
			__v,
			updatedAt,
			...userResponse
		} = existingUser.toObject();

		return userResponse;
	},

	generateJwtToken: async (userData) => {

		const payload = {
			userId: userData._id.toString(),
			email: userData.email,
		};

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "2h",
		});

		return token;
	},
};

module.exports = userService;
