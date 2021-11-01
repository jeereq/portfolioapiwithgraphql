const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const is_auth = require("./middleware/is-auth");
const cors = require("cors");

const schema = require("./graphql/resolvers");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(is_auth);

app.get("/", (req, res, next) => {
	res.send("<h1>hello world</h1>");
});

app.use("/graphql", graphqlHttp({ schema, graphiql: true }));

//mongodb://localhost:27017/portfolio-developpement
//mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.w82cr.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.w82cr.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		}
	)
	.then(() => {
		app.listen(`${process.env.PORT}`, () => {
			console.log("running server on port 8000");
		});
	})
	.catch((err) => {
		console.log(err);
	});
