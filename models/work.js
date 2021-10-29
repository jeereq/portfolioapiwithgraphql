const { Schema, model } = require("mongoose");

const workSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true,
		default: ""
	},
	link: {
		type: String,
		required: true
	},
	imageLink: {
		type: String,
		required: true
	},
	id_user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	}
});

module.exports = model("Work", workSchema);
