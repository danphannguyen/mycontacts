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
			required: [true, "firstname is required"],
			maxlength: 30,
			minlength: 2,
		},
		lastname: {
			type: String,
			required: [true, "lastname is required"],
			maxlength: 30,
			minlength: 2,
		},
		phone: {
			type: String,
			required: [true, "phone number is required"],
			maxlength: 20,
			minlength: 10,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Contact", contactSchema);
