const { Schema, model } = require("mongoose");

const competenceSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	icon: {
		type: String,
		required: true
	},
	id_user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	}
});

module.exports = model("Competence", competenceSchema);
