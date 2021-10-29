const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull
} = require("graphql");

const Competence = require("../../models/competence");
const Work = require("../../models/work");
const Message = require("../../models/message");
const User = require("../../models/user");

const linkedType = new GraphQLObjectType({
	name: "linked",
	fields: () => ({
		name: { type: GraphQLString },
		icon: { type: GraphQLString },
		link: { type: GraphQLString }
	})
});

const workType = new GraphQLObjectType({
	name: "work",
	fields: () => ({
		_id: { type: GraphQLID },
		link: { type: new GraphQLNonNull(GraphQLString) },
		name: { type: new GraphQLNonNull(GraphQLString) },
		description: { type: GraphQLString },
		imageLink: { type: new GraphQLNonNull(GraphQLString) },
		id_user: { type: GraphQLID },
		user: {
			type: userType,
			resolve(parent) {
				return User.findById(parent.id_user);
			}
		}
	})
});

const userType = new GraphQLObjectType({
	name: "user",
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: new GraphQLNonNull(GraphQLString) },
		firstname: { type: new GraphQLNonNull(GraphQLString) },
		email: { type: new GraphQLNonNull(GraphQLString) },
		password: { type: new GraphQLNonNull(GraphQLString) },
		description: { type: GraphQLString },
		links: { type: new GraphQLList(linkedType) },
		competences: {
			type: new GraphQLList(competenceType),
			resolve(parent) {
				return Competence.find({ id_user: parent._id });
			}
		},
		works: {
			type: new GraphQLList(workType),
			resolve(parent) {
				return Work.find({ id_user: parent._id });
			}
		},
		messages: {
			type: new GraphQLList(messageType),
			resolve(parent) {
				return Message.find({ id_user: parent._id });
			}
		},
		token: { type: new GraphQLNonNull(GraphQLString) }
	})
});

const competenceType = new GraphQLObjectType({
	name: "competence",
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: new GraphQLNonNull(GraphQLString) },
		icon: { type: new GraphQLNonNull(GraphQLString) },
		id_user: { type: GraphQLID }
	})
});

const messageType = new GraphQLObjectType({
	name: "message",
	fields: () => ({
		_id: { type: GraphQLID },
		objet: { type: new GraphQLNonNull(GraphQLString) },
		name: { type: new GraphQLNonNull(GraphQLString) },
		message: { type: new GraphQLNonNull(GraphQLString) },
		id_user: { type: GraphQLID }
	})
});

module.exports = {
	userType,
	linkedType,
	competenceType,
	messageType,
	workType
};
