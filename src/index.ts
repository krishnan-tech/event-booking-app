import { ApolloServer } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";

import resolvers from "./graphql/resolvers";
import { typeDefs } from "./graphql/typeDefs";
require("dotenv").config();

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
  });
  await server.start();

  // console.log("server apply middleware");
  server.applyMiddleware({ app });

  try {
    await mongoose.connect("mongodb://localhost/eventBooking", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (e) {
    console.log(e.message);
    console.log("DB ERROR");
  }

  // console.log(process.env.SECRET_KEY);

  app.listen({ port: 3001 }, () =>
    console.log(`🚀 Server ready at http://localhost:3001${server.graphqlPath}`)
  );
};

startServer().catch((e) => {
  console.log(e);
});
