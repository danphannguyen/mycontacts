const userService = require("../services/userServices");
const { ValidationError, ConflictError, AppError } = require("../utils/errors");

const userController = {
	register: async (req, res, next) => {
		try {
			// Validation (lance ValidationError si échec)
			userService.validateUserData(req.body);

			// Création (lance ConflictError si email existe)
			const user = await userService.createUser(req.body);

			res.status(201).json({
				success: true,
				message: "Utilisateur créé avec succès",
				data: { user },
			});
		} catch (error) {
			next(error);
		}
	},
};

module.exports = userController;
