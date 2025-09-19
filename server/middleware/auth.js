// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { TokenExpiredError, InvalidTokenError, AuthError } = require("../utils/errors")

const authenticate = async (req, res, next) => {
	try {
		// Récupérer le token depuis l'en-tête Authorization
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				error: "Token manquant ou format invalide",
			});
		}

		const token = authHeader.split(" ")[1];

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(decoded.userId);
		if (!user) {
			return res.status(401).json({
				error: "Utilisateur non trouvé",
			});
		}

		req.body.user = {
			id: decoded.userId,
			email: decoded.email,
		};

		next();
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
      return next(new TokenExpiredError('Token expiré (2h dépassées)'));
    } 
    
    if (error.name === 'JsonWebTokenError') {
      return next(new InvalidTokenError('Token invalide'));
    }

    if (error instanceof AuthError) {
      return next(error);
    }

    // Pour toute autre erreur inattendue
    console.error('Erreur authentification:', error);
    next(new AuthError('Erreur d\'authentification'));
	}
};

module.exports = { authenticate };
