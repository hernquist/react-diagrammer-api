import express from "express";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

import jwt from "jsonwebtoken";

import { makeExecutableSchema } from "graphql-tools";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

mongoose.connect("mongodb://localhost/test");

const User = mongoose.model("User", { 
    email: String,
    name: String,
    password: String
});
const Project = mongoose.model("Project", { 
    name: String, 
    userId: String,
    description: String, 
    dateCreated: Date, 
    dateVisited: Date
});
const Component = mongoose.model("Component", {
    name: String,
    projectId: String,
    style: String,
    iteration: Number,
    placement: String,
    children: [String],
    state: [String],
    props: [String],
    callbacks: [String]
})

const app = express();
const dev = process.env.NODE_ENV === "development";

const homePath = "/graphiql";

// auth middleware
const SECRET = "qwertyuiopsdflkjsdlfkj";
const addUserMW = async req => {
    // const token = req.headers["x-token"] || req.headers.authorization;
    const token = req.headers["x-token"];
    console.log("[addUserMW] token:", token); 
    const message = req.headers.referer;
    const signUp = (typeof message === "string" && message.includes("signUp"))

    try {
        const { user } = await jwt.verify(token, SECRET);
        console.log("[addUserMW] user:", user);
        req.user = user;
    } catch (err) {
        if (signUp) {
            console.log("SignUp");
        } else {
            console.log("Error:", err);
        }
    }
    req.next();
};

app.use(addUserMW);

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
                User,
                Project,
                Component,
                SECRET,
                user: req.user
            }
        };
    })
);

app.use("/", (req, res) => {
  res.json("Go to /graphiql to test your queries and mutations!");
});

const server = app.listen(3001, () => {
  const { port } = server.address();
  console.info(`Express listen at http://localhost:${port}`);
});
