const User = require("../../models/user");
const Competence = require("../../models/competence");
const Message = require("../../models/message");
const Work = require("../../models/work");

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull
} = require("graphql");

const {
	userType,
	linkedType,
	competenceType,
	messageType,
	workType
} = require("../schema");

module.exports = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: "RootQuerytype",
		fields: {
			competence: {
				type: competenceType,
				args: { id: { type: GraphQLID } },
				resolve(parent, args) {
					return Competence.find({ id_user: args.id });
				}
			},
			user: {
				type: userType,
				args: {
					id: { type: GraphQLID }
				},
				resolve(parent, args) {
					return User.findById(args.id);
				}
			},
			users: {
				type: new GraphQLList(userType),
				resolve(parent, args) {
					return User.find({});
				}
			},
			competences: {
				type: new GraphQLList(competenceType),
				resolve() {
					return Competence.find({});
				}
			},
			works: {
				type: new GraphQLList(workType),
				resolve() {
					return Work.find({});
				}
			},
			messages: {
				type: new GraphQLList(messageType),
				resolve() {
					return Message.find({});
				}
			},
			login: {
				type: userType,
				args: {
					email: {
						type: new GraphQLNonNull(GraphQLString)
					},
					password: {
						type: new GraphQLNonNull(GraphQLString)
					}
				},
				resolve(parent, args) {
					return User.login(args)
						.then((data) => {
							return data;
						})
						.catch((err) => {
							return {
								...args
							};
						});
				}
			}
		}
	}),
	mutation: new GraphQLObjectType({
		name: "RootMutationType",
		fields: {
			signup: {
				type: new GraphQLNonNull(userType),
				args: {
					name: { type: new GraphQLNonNull(GraphQLString) },
					email: { type: new GraphQLNonNull(GraphQLString) },
					password: { type: new GraphQLNonNull(GraphQLString) },
					firstname: { type: new GraphQLNonNull(GraphQLString) }
				},
				resolve(parent, args) {
					return User.signup(args).catch((err) => {
						throw err;
					});
				}
			},
			deleteWork: {
				type: new GraphQLNonNull(workType),
				args: { id: { type: GraphQLID } },
				resolve(parent, args) {
					return Work.findByIdAndDelete(args.id);
				}
			},
			createWork: {
				type: new GraphQLNonNull(workType),
				args: {
					link: { type: new GraphQLNonNull(GraphQLString) },
					name: { type: new GraphQLNonNull(GraphQLString) },
					description: { type: new GraphQLNonNull(GraphQLString) },
					imageLink: { type: new GraphQLNonNull(GraphQLString) },
					id_user: { type: GraphQLID }
				},
				resolve(parent, args) {
					return User.findById(args.id_user)
						.then((user) => {
							if (!user) throw new Error("Erreur utilisateur inéxistant");
							return new Work(args);
						})
						.then((work) => work.save())
						.catch((err) => {
							throw err;
						});
				}
			},
			createCompetence: {
				type: new GraphQLNonNull(competenceType),
				args: {
					name: { type: new GraphQLNonNull(GraphQLString) },
					icon: { type: new GraphQLNonNull(GraphQLString) },
					id_user: { type: GraphQLID }
				},
				resolve(parent, args) {
					const competence = new Competence(args);
					return competence.save();
				}
			},
			createMessage: {
				type: new GraphQLNonNull(messageType),
				args: {
					objet: { type: new GraphQLNonNull(GraphQLString) },
					name: { type: new GraphQLNonNull(GraphQLString) },
					message: { type: new GraphQLNonNull(GraphQLString) },
					id_user: { type: GraphQLID }
				},
				resolve(parent, args) {
					return User.findById(args.id_user)
						.then((user) => {
							if (!user) throw new Error("Erreur utilisateur inéxistant");
							return new Message(args);
						})
						.then((message) => message.save())
						.catch((err) => {
							throw err;
						});
				}
			}
		}
	})
});
