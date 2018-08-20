import { MongoClient, ObjectId } from "mongodb";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { resultKeyNameFromField } from "../../node_modules/apollo-utilities";

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
      const user = await User.find({ email });
      return prepare(user[0]);
    },
    getUserById: async (parent, { _id }, { User }) => {
      const user = await User.findById(_id);
      return prepare(user);
    },
    projectsByUserId: async (parent, { userId }, { Project }) => {
      const projects = await Project.find({ userId });
      return projects.map(project => prepare(project));
    },
    componentsByProjectId: async (parent, { projectId }, { Component }) => {
      const components = await Component.find({ projectId });
      return components.map(component => prepare(component));
    },
    propsByComponentId: async (parent, {componentId}, { Prop }) => {
      const props = await Prop.find({ componentId });
      return props.map(prop => prepare(prop)); 
    }
  },
  Project: { components: async({ _id }, args, { Component }) => await Component.find({ projectId: _id })},
  Component: { props: async({ _id }, args, { Prop }) => await Prop.find({ componentId: _id })},
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
      const User = context.User;
      const user = args;
      user.password = await bcrypt.hash(args.password, 12);
      const savedUser = await User(user).save();
      const token = jwt.sign(
        { user: _.pick(savedUser, ["_id", "name"]) },
        context.SECRET,
        { expiresIn: "1y" }
      );
      context.token = token;
      return token;
    },
    createProject: async (parent, args, { Project, Component }) => {
      const date = new Date();
      let body = Object.assign({}, args, {
        dateCreated: date,
        dateVisited: date
      });
      const project = await Project(body).save();
      const index = {
        name: 'index',
        iteration: 0,
        projectId: project._id,
        style: 'container',
        placement: 'root',
        state: [''],
        callbacks: ['']
      }
      const component = await Component(index).save();
      return prepare(project);
    },
    createComponent: async (parent, args, { Component }) => {
      let component = await Component(args).save();
      return prepare(component);
    },
    toggleComponentStyle: async (parent, { _id }, { Component }) => {
      let component = await Component.find({ _id });
      const style = component[0].style === 'container' ?
        'presentational' : 'container';
      component[0].style = style;
      await Component.update({_id: _id}, {style: style})
      const newComponent = await Component.find({ _id });
      return prepare(newComponent[0]); 
    },
    editComponentName: async (parent, {_id, name}, { Component }) => {
      await Component.update({ _id }, { name });
      const newComponent = await Component.find({ _id });
      return prepare(newComponent[0]);
    },
    addProp: async (parent, { prop }, { Prop, Component }) => {
      await Prop(prop).save();
      const _id = prop.componentId;
      let component = await Component.find({ _id });
      return prepare(component[0]);
    },
    deleteProp: async (parent, { _id }, { Prop }) => {
      let result = await Prop.deleteOne({ _id });
      return result.n === 1;
    },
    editProp: async (parent, { _id, name, proptype }, { Prop, Component }) => {
      let prop = await Prop.findOneAndUpdate({ _id }, { name, proptype });
      return prepare(prop);
    }
  }
};