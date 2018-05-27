import { MongoClient, ObjectId } from "mongodb";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

// import _ from "lodash";

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
    projectsByUserId: async (parent, {userId}, { Project }) => {
      console.log("projectsByUserId:", userId);
      const projects = await Project.find({ userId });
      console.log("projectsByUserId:", projects);
      return projects.map(project => prepare(project));
    }
  },
  Mutation: {
    createUser: async (parent, args, { User }) => {
      const match = await User.find({ email: args.email });
      if (match.length > 0) {
        throw new Error("duplicate user - email already in use");
      }
      const user = await User(args).save();

      return prepare(user);
    },
    createProject: async (parent, args, { Project }) => {
      console.log("createProject:", args);
      const date = new Date;
      console.log("createProject:", date);
      let body = Object.assign({}, args, {dateCreated: date, dateVisited: date})
      const project = await Project(body).save();

      return prepare(project);
    },
    createComponent: async (parent, args, { Component }) => {

      let comp = await Component(args).save();
      return prepare(comp);
    }
  }
};