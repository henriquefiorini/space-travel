require('dotenv').config();

const { ApolloServer } = require('apollo-server');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const dataSources = require('./dataSources');

const { tokenHandler } = require('./utils');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context: ({ req }) => {
    const authorization = req.get('Authorization');
    if (authorization) {
      const token = authorization.replace('Bearer ','');
      const { user } = tokenHandler.verify(token);
      if (user) {
        return { user };
      }
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server running at ${url} 🚀`);
});
