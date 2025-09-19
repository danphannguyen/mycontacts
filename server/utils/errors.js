/**
 * Classe de base pour les erreurs personnalisées
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

/**
 * Erreur de validation (400)
 */
class ValidationError extends AppError {
    constructor(message, errors = []) {
        super(message, 400);
        this.errors = errors;
        this.name = 'ValidationError';
    }
}

/**
 * Erreur de conflit/duplication (409)
 */
class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

/**
 * Erreur d'authentification (401)
 */
class AuthError extends AppError {
    constructor(message = 'Non autorisé') {
        super(message, 401);
        this.name = 'AuthError';
    }
}

/**
 * Ressource non trouvée (404)
 */
class NotFoundError extends AppError {
    constructor(message = 'Ressource non trouvée') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

module.exports = {
    AppError,
    ValidationError,
    ConflictError,
    AuthError,
    NotFoundError
};