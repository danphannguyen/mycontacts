const contactService = require("../services/contactServices");

const contactController = {
	addContact: async (req, res, next) => {
		try {
			contactService.validateContactData(req.body); // Validation (lance ValidationError si échec)

			const contact = await contactService.createContact(req.body, req.user);

			res.status(201).json({
				success: true,
				message: "Contact créé avec succès",
				data: { contact },
			});
		} catch (error) {
			next(error);
		}
	},

	retrieveContact: async (req, res, next) => {
		try {
			const contactList = await contactService.readContact(req.user);

			res.status(200).json({
				success: true,
				message: "Liste des contacts récupérée avec succès",
				data: contactList,
			});
		} catch (error) {
			next(error);
		}
	},
};

module.exports = contactController;
