const validators = require("../utils/validators");
const { ValidationError } = require("../utils/errors");
const Contact = require("../models/Contact");

const contactService = {
	validateContactData: (contactData) => {
		const { firstname, lastname, phone } = contactData;
		let allErrors = [];

		const firstnameValidation = validators.validateName(firstname, {
			type: "prénom",
		});
		if (!firstnameValidation.isValid) {
			allErrors = allErrors.concat(firstnameValidation.errors);
		}

		const lastnameValidation = validators.validateName(lastname, {
			type: "nom",
		});
		if (!lastnameValidation.isValid) {
			allErrors = allErrors.concat(lastnameValidation.errors);
		}

		const phoneValidation = validators.validatePhone(phone);
		if (!phoneValidation.isValid) {
			allErrors = allErrors.concat(phoneValidation.errors);
		}

		if (allErrors.length > 0) {
			throw new ValidationError("Données invalides", allErrors);
		}
	},

	createContact: async (contactData, userData) => {
		const { firstname, lastname, phone } = contactData;
    const { id, email } = userData

		const newContact = new Contact({
			userId: id,
			firstname: firstname.trim(),
			lastname: lastname.trim(),
			phone: phone.trim(),
			createdAt: new Date(),
		});

		const savedContact = await newContact.save();

		const { __v, updatedAt, ...contactResponse } = savedContact.toObject();

		return contactResponse;
	},

	readContact: async (userData) => {
		const { id, email } = userData;

		// Vérifier si l'utilisateur existe déjà
		const contactListByUserId = await Contact.find({
			userId: id,
		});

		if (!contactListByUserId) {
			throw new NotFoundError("Aucun contact trouvé pour cet utilisateur");
		}

    return contactListByUserId;
	},
};

module.exports = contactService;
