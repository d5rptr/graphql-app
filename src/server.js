const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { gql } = require('apollo-server-core');
const { json } = require('body-parser');
const path = require('path');

// Sample data
const users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com' },
];

// Define GraphQL schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    hello: String
    users: [User]
    user(id: ID!): User
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    users: () => users,
    user: (parent, args) => users.find(user => user.id === args.id),
  },
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  const app = express();
  app.use('/graphql', json(), expressMiddleware(server));

  // Serve static files
  app.use(express.static(path.join(__dirname, '../public')));

  app.listen(4000, () => {
    console.log('Server running at http://localhost:4000');
  });
}

startServer();
