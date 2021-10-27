const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
	name: { type: String },
	message: {
		type: String,
		required: true
	},
	objet: {
		type: String,
		required: true
	},
	id_user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	}
});

module.exports = model("Message", messageSchema);
