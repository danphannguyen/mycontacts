const { AppError, ValidationError } = require('../utils/errors');

/**
 * Middleware global de gestion des erreurs
 * À placer en dernier dans server.js après toutes les routes
 */
const errorHandler = (error, req, res, next) => {
    console.error('Erreur capturée par le middleware:', error);

    // Erreurs personnalisées avec array d'erreurs
    if (error instanceof ValidationError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            errors: error.errors
        });
    }

    // Autres erreurs personnalisées (ConflictError, AuthError, etc.)
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    // Erreur générique (500)
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
};

module.exports = errorHandler;