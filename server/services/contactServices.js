const validators = require("../utils/validators");
const {
	ValidationError,
	NotFoundError,
	ForbiddenError,
} = require("../utils/errors");
const Contact = require("../models/Contact");

const contactService = {
	validateContactData: (contactData) => {
		const { firstname, lastname, phone } = contactData;
		let allErrors = [];

		if (!firstname && !lastname && !phone) {
			throw new ValidationError(
				"Veuillez renseigner au moins un champ parmi : prénom, nom ou téléphone."
			);
		}

		if (firstname) {
			const firstnameValidation = validators.validateName(firstname, {
				type: "prénom",
			});
			if (!firstnameValidation.isValid) {
				allErrors = allErrors.concat(firstnameValidation.errors);
			}
		}

		if (lastname) {
			const lastnameValidation = validators.validateName(lastname, {
				type: "nom",
			});
			if (!lastnameValidation.isValid) {
				allErrors = allErrors.concat(lastnameValidation.errors);
			}
		}

		if (phone) {
			const phoneValidation = validators.validatePhone(phone);
			if (!phoneValidation.isValid) {
				allErrors = allErrors.concat(phoneValidation.errors);
			}
		}

		if (allErrors.length > 0) {
			throw new ValidationError("Données invalides", allErrors);
		}
	},

	createContact: async (contactData, userData) => {
		const { firstname, lastname, phone } = contactData;
		const { id, email } = userData;

		const newContactData = {
			userId: id,
			createdAt: new Date(),
		};

		if (firstname) newContactData.firstname = firstname.trim();
		if (lastname) newContactData.lastname = lastname.trim();
		if (phone) newContactData.phone = phone.trim();

		const newContact = new Contact(newContactData);

		const savedContact = await newContact.save();

		const { __v, updatedAt, ...contactResponse } = savedContact.toObject();

		return contactResponse;
	},

	readContact: async (userData) => {
		const { id, email } = userData;

		const contactListByUserId = await Contact.find({
			userId: id,
		});

		if (!contactListByUserId) {
			throw new NotFoundError("Aucun contact trouvé pour cet utilisateur");
		}

		return contactListByUserId;
	},

	updateContact: async (contactData, userData, paramsData) => {
		const { id: paramsId } = paramsData; // id du contact à modifier (dans l’URL)
		const { id: tokenId } = userData; // id de l’utilisateur connecté (JWT)
		const { firstname, lastname, phone } = contactData;

		const contact = await Contact.findById(paramsId);

		if (!contact) {
			throw new NotFoundError("Contact non trouvé");
		}

		// Vérifier que le contact appartient bien à l'utilisateur connecté
		if (contact.userId.toString() !== tokenId.toString()) {
			throw new ForbiddenError(
				"Vous n'avez pas les droits nécessaires pour effectuer cette action."
			);
		}

		if (firstname) contact.firstname = firstname.trim();
		if (lastname) contact.lastname = lastname.trim();
		if (phone) contact.phone = phone.trim();

		await contact.save();

		return contact;
	},

	deleteContact: async (userData, paramsData) => {
		const { id: paramsId } = paramsData; // id du contact à modifier (dans l’URL)
		const { id: tokenId } = userData; // id de l’utilisateur connecté (JWT)

		const contact = await Contact.findById(paramsId);

		if (!contact) {
			throw new NotFoundError("Contact non trouvé");
		}

		// Vérifier que le contact appartient bien à l'utilisateur connecté
		if (contact.userId.toString() !== tokenId.toString()) {
			throw new ForbiddenError(
				"Vous n'avez pas les droits nécessaires pour effectuer cette action."
			);
		}

		const deletedContact = await Contact.findByIdAndDelete(paramsId);

		return deletedContact;
	},
};

module.exports = contactService;
