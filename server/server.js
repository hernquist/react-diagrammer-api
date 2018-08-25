import express from "express";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import schema from './graphql/schema';
import { user, project, component, prop, state, cb } from './models/models';

mongoose.connect("mongodb://localhost/react-diagrammer");

const User = mongoose.model("User", user);
const Project = mongoose.model("Project", project); 
const Component = mongoose.model("Component", component);
const Prop = mongoose.model("Prop", prop);
const State = mongoose.model("State", state);
const Callback = mongoose.model("Callback", cb);

const app = express();
const dev = process.env.NODE_ENV === "development";
const homePath = "/graphiql";

// auth middleware
const SECRET = "qwertyuiopsdflkjsdlfkj";
const addUserMiddleware = async req => {
  const token = req.headers["x-token"];   // || req.headers.authorization;
  console.log("[addUserMiddleware] token:", token); 
  const message = req.headers.referer;
  const signUp = (typeof message === "string" && message.includes("signUp"))

  try {
    const { user } = await jwt.verify(token, SECRET);
    console.log("[addUserMiddleware] user:", user);
    req.user = user;
  } catch (err) {
    if (signUp) {
      console.log("SignUp");
    } else {
      console.log("Error-1:", err);
    }
  }
  req.next();
};

app.use(addUserMiddleware);
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
  graphqlExpress((req) => {
    return {
      schema,
      context: {
        User,
        Project,
        Component,
        Prop,
        State,
        Callback,
        SECRET,
        user: req.user
      }
    };
  })
);

app.use("/", (_, res) => {
  res.json("Go to /graphiql to test your queries and mutations!");
});

const server = app.listen(3001, () => {
  const { port } = server.address();
  console.info(`Express listen at http://localhost:${port}`);
});
