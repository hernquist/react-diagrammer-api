import { MongoClient, ObjectId } from "mongodb";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";

const prepare = obj => {
  obj._id = obj._id.toString();
  return obj;
};

export default {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    }
  }),
  Query: {
    getAuthUser: async (parent, args, context) => {
      const User = context.User;
      if (context.user) {
        const { _id } = context.user;
        const user = await User.find({ _id });
        return prepare(user[0]);
      } else {
      return new Error ("user not authenticated");
      }
    },
    users: async (parent, args, { User }) => {
      const users = await User.find();
      return users.map(user => prepare(user));
    },
    user: async (parent, { email }, { User }) => {
      console.log("[resolvers.js]", email);
      const user = await User.find({ email });
      console.log("[resolvers.js]", user);
      return prepare(user[0]);
    },
    getUserById: async (parent, { _id }, { User }) => {
      console.log("getUserByUser:", _id);
      const user = await User.findById(_id);
      console.log("getUserByUser:", user);
      return prepare(user);
    },
    projectsByUserId: async (parent, { userId }, { Project }) => {
      console.log("projectsByUserId:", userId);
      const projects = await Project.find({ userId });
      console.log("projectsByUserId:", projects);
      return projects.map(project => prepare(project));
    },
    componentsByProjectId: async (parent, { projectId }, { Component }) => {
      const components = await Component.find({ projectId });
      return components.map(component => prepare(component));
    }
  },
  Mutation: {
    login: async (parent, { email, password }, context) => {
      const { User } = context;
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("No user with that email");
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error("Incorrect password");
      }
      const token = jwt.sign(
        { user: _.pick(user, ["_id", "name"]) },
        context.SECRET,
        { expiresIn: "1y" }
      );
      context.token = token;
      return token;
    },
    signup: async (parent, args, context) => {
      const Users = context.User;
      const user = args;
      user.password = await bcrypt.hash(user.password, 12);
      await Users(user).save();
      const token = jwt.sign(
        { user: _.pick(user, ["_id", "name"]) },
        context.SECRET,
        { expiresIn: "1y" }
      );
      context.token = token;
      return token;
    },
    createProject: async (parent, args, { Project, Component }) => {
      console.log("createProject:", args);
      const date = new Date();
      console.log("createProject:", date);
      let body = Object.assign({}, args, {
        dateCreated: date,
        dateVisited: date
      });
      const project = await Project(body).save();
      const index = {
        name: 'index',
        iteration: 0,
        projectId: project._id,
        style: 'presentational',
        placement: 'root',
        state: [''],
        callbacks: ['']
      }
      const component = await Component(index).save();
      console.log(component);
      return prepare(project);
    },
    createComponent: async (parent, args, { Component }) => {
      let comp = await Component(args).save();
      return prepare(comp);
    }
  }
};