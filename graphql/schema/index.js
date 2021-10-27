const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type user {
        _id:ID!
        name:String!   
    }

    type RootQuery {
        users:[user!]!
    }

    
    schema {
        query: RootQuery
    }
`);
