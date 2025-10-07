const userService = require("../services/userServices");

const userController = {
	register: async (req, res, next) => {
		try {
			userService.validateUserData(req.body);

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

  login: async (req, res, next) => {
    try {
			userService.validateUserData(req.body);

      const user = await userService.authenticateUser(req.body);

      const token = await userService.generateJwtToken(user)
      
      res.status(200).json({
				success: true,
				message: "Utilisateur authentifié avec succès",
        jwtToken: token,
				data: { user },
			});
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
