/**
 * Validateurs de champs réutilisables
 */
const validators = {
	validateEmail: (email) => {
		const errors = [];

		if (!email || typeof email !== "string" || email.trim().length === 0) {
			errors.push("L'email est requis");
		} else {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email.trim())) {
				errors.push("Le format de l'email est invalide");
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	},

	validatePassword: (password, options = {}) => {
		const { minLength = 6, maxLength = 20, requireStrong = false } = options;
		const errors = [];

		if (!password || typeof password !== "string") {
			errors.push("Le mot de passe est requis");
		} else {
			// Vérification de la longueur minimale
			if (password.length < minLength) {
				errors.push(
					`Le mot de passe doit contenir au moins ${minLength} caractères`
				);
			}

			// Vérification de la longueur maximale
			if (password.length > maxLength) {
				errors.push(
					`Le mot de passe ne doit pas contenir plus de ${maxLength} caractères`
				);
			}

			// Vérification des exigences de force si demandé
			if (requireStrong) {
				if (!/[a-z]/.test(password)) {
					errors.push("Le mot de passe doit contenir au moins une minuscule");
				}
				if (!/[A-Z]/.test(password)) {
					errors.push("Le mot de passe doit contenir au moins une majuscule");
				}
				if (!/\d/.test(password)) {
					errors.push("Le mot de passe doit contenir au moins un chiffre");
				}
				if (!/[@$!%*?&]/.test(password)) {
					errors.push(
						"Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)"
					);
				}
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	},

	validateName: (name, options = {}) => {
		const {
			minLength = 2,
			maxLength = 30,
			type = "prénom",
			required = "true",
		} = options;
		const errors = [];

		if (
			(!name || typeof name !== "string" || name.trim().length === 0) &&
			required
		) {
			errors.push(`Le ${type} est requis`);
		} else {
			const trimmedName = name.trim();

			if (trimmedName.length < minLength) {
				errors.push(
					`Le ${type} doit contenir au moins ${minLength} caractères`
				);
			}

			if (trimmedName.length > maxLength) {
				errors.push(`Le ${type} ne peut pas dépasser ${maxLength} caractères`);
			}

			// Vérifier que le nom ne contient que des lettres, espaces, tirets et apostrophes
			const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
			if (!nameRegex.test(trimmedName)) {
				errors.push(
					`Le ${type} ne peut contenir que des lettres, espaces, tirets et apostrophes`
				);
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	},

	validatePhone: (phone, options = {}) => {
		const { minLength = 10, maxLength = 20 } = options;
		const errors = [];

		if (!phone || typeof phone !== "string") {
			errors.push("Le numéro de téléphone est requis");
		} else {
			// Vérification de la longueur minimale
			if (phone.length < minLength) {
				errors.push(
					`Le numéro de téléphone doit contenir au moins ${minLength} caractères`
				);
			}

			// Vérification de la longueur maximale
			if (phone.length > maxLength) {
				errors.push(
					`Le numéro de téléphone ne doit pas contenir plus de ${maxLength} caractères`
				);
			}

      // Vérification du format (seulement chiffres, espaces, +, -, (, ))
      const phoneRegex = /^[0-9+\-\s()]+$/;
			if (!phoneRegex.test(phone.trim())) {
				errors.push(
					"Le numéro de téléphone ne peut contenir que des chiffres, espaces, +, -, ( et )"
				);
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	},
};

module.exports = validators;
