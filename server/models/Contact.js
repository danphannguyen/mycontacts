const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		firstname: {
			type: String,
			maxlength: 30,
			minlength: 2,
		},
		lastname: {
			type: String,
			maxlength: 30,
			minlength: 2,
		},
		phone: {
			type: String,
			maxlength: 20,
			minlength: 10,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Contact", contactSchema);
