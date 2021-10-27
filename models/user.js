const { Schema, model } = require("mongoose");

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	firstname: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	authorisation: {
		type: Boolean
	},
	links: [
		{
			name: { type: String, required: true },
			link: { type: String, required: true },
			icon: { type: String, required: true }
		}
	]
});

module.exports = model("User", userSchema);
