const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const TypeDefs = require("./schema");
const Resolvers = require("./resolver");

const { ApolloServer } = require("apollo-server-express");

const dotenv = require("dotenv");
dotenv.config();

const mongodb_atlas_url = process.env.MONGODB_ATLAS_URL;

mongoose.connect(mongodb_atlas_url, {});

mongoose.connection.once("open", () => {
  console.log("connected to MongoDB Atlas!");
});

const server = new ApolloServer({
  typeDefs: TypeDefs.typeDefs,
  resolvers: Resolvers.resolvers,
});

const app = express();
app.use(bodyParser.json());
app.use("*", cors());

(async () => {
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(
      `Server is running at http://localhost:4000${server.graphqlPath}`
    );
  });
})();
