const User = require("../../models/user");
module.exports = {
	users: async () => await User.find({})
};
