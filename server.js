const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const TypeDefs = require("./schema");
const Resolvers = require("./resolver");

const { ApolloServer } = require("apollo-server-express");

const mongodb_atlas_url = "mongodb+srv://vedqntgohel:r9KC6muUvCXjNIeJ@vedant.zonvp7s.mongodb.net/Comp3133?retryWrites=true&w=majority";
const port = 4000;

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

  app.listen({ port }, () => {
    console.log(
      `Server is running at http://localhost:${port}${server.graphqlPath}`
    );
  });
})();
