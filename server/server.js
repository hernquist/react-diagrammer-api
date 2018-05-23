import express from "express";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

import { makeExecutableSchema } from "graphql-tools";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

mongoose.connect("mongodb://localhost/test");

const User = mongoose.model("User", { email: String });

const app = express();
const dev = process.env.NODE_ENV === "development";

const homePath = "/graphiql";

app.use(morgan("dev"));
app.use(cors("*"));

app.use(
    homePath,
    graphiqlExpress({
        endpointURL: "/graphql"
    })
);

app.use(
    "/graphql",
    bodyParser.json(),
    graphqlExpress((req, res) => {
        return {
            schema,
            context: {
                User
            }
        };
    })
);


app.use("/", (req, res) => {
  res.json("Go to /graphiql to test your queries and mutations!");
});

const server = app.listen(3000, () => {
  const { port } = server.address();
  console.info(`Express listen at http://localhost:${port}`);
});
