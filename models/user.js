const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const MaxAge = 1000 * 60 * 60 * 24 * 3650;

const createToken = (id) => {
	return jwt.sign({ id }, process.env.SECRETEPASS, {
		expiresIn: MaxAge
	});
};

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: { type: String, required: true },
	password: { type: String, required: true },
	firstname: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	authorisation: {
		type: Boolean,
		default: false
	},
	links: [
		{
			name: { type: String, required: true },
			link: { type: String, required: true },
			icon: { type: String, required: true }
		}
	]
});
userSchema.statics.login = async function ({ email, password }) {
	const user = await this.findOne({ email });
	if (!user) throw new Error("user not found");
	const verify = bcrypt.compare(password, user.password);
	if (verify)
		return new Promise((resolve, reject) => {
			const token = createToken(user._id);
			resolve({ ...user._doc, token, password: null });
		});
	throw new Error("password incorrecte !!!");
};
userSchema.statics.verify = async function (args) {
	const user = await this.find({ email: args.email });
	if (user.length === 0) return true;
	return false;
};

userSchema.statics.adminAuth = function (data) {
	if (data.email === process.env.USERNAME) return true;
	else return false;
};
userSchema.statics.signup = async function (args) {
	const verify = await this.verify(args);
	if (verify) {
		if (this.adminAuth(args)) {
			const salt = await bcrypt.genSalt();
			const hashpassword = await bcrypt.hash(args.password, salt);
			const data = { ...args, password: hashpassword };
			const user = new this(data);
			return await user.save();
		} else {
			throw new Error("vous n'etes pas authoriser d'avoir un compte");
		}
	}
	throw new Error("user already exist");
};
module.exports = model("User", userSchema);
