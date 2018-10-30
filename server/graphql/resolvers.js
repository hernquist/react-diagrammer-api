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
    getAuthUser: async (__, ___, context) => {
      const { User } = context;
      if (context.user) {
        const { _id } = context.user;
        const user = await User.find({ _id });
        return prepare(user[0]);
      } else {
        return new Error("user not authenticated");
      }
    },
    users: async (__, ___, { User }) => {
      const users = await User.find();
      return users.map(user => prepare(user));
    },
    user: async (__, { email }, { User }) => {
      const user = await User.find({ email });
      return prepare(user[0]);
    },
    getUserById: async (__, { _id }, { User }) => {
      const user = await User.findById(_id);
      return prepare(user);
    },
    projectsByUserId: async (__, { userId }, { Project }) => {
      const projects = await Project.find({ userId });
      return projects.map(project => prepare(project));
    },
    componentsByProjectId: async (__, { projectId }, { Component }) => {
      const components = await Component.find({ projectId });
      return components.map(component => prepare(component));
    },
    propsByComponentId: async (__, { componentId }, { Prop }) => {
      const props = await Prop.find({ componentId });
      return props.map(prop => prepare(prop));
    },
    stateByComponentId: async (__, { componentId }, { State }) => {
      const state = await State.find({ componentId });
      return state.map(statefield => prepare(statefield));
    },
    callbacksByComponentId: async (__, { componentId }, { Callback }) => {
      const callbacks = await Callback.find({ componentId });
      return callbacks.map(callback => prepare(callback));
    }
  },
  Project: {
    components: async ({ _id }, ___, { Component }) =>
      await Component.find({ projectId: _id })
  },
  Component: {
    props: async ({ cloneId }, ___, { Prop }) =>
      await Prop.find({ componentId: cloneId }),
    state: async ({ cloneId }, ___, { State }) =>
      await State.find({ componentId: cloneId }),
    callbacks: async ({ cloneId }, ___, { Callback }) =>
      await Callback.find({ componentId: cloneId })
  },
  Mutation: {
    login: async (__, { email, password }, { User, SECRET }) => {
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
        SECRET,
        { expiresIn: "1y" }
      );
      return token
    },
    signup: async (__, args, context) => {
      const User = context.User;
      const user = args;
      const users = await User.find({});

      const username = users.some(u => u.name === user.name);
      const email = users.some(u => u.email === user.email);

      if (username || email) {
        return Number(username) + Number(email) * 2
      }
      
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
    createProject: async (__, args, { Project }) => {
      const date = new Date();
      const body = Object.assign({}, args, {
        dateCreated: date,
        dateVisited: date
      });
      const project = await Project(body).save();
      return prepare(project);
    },
    deleteProject: async (__, { _id }, { Project }) => {
      const result = await Project.deleteOne({ _id });
      return result.n === 1;
    },
    deleteComponent: async (__, { _id, parentId }, { Component }) => {
      const component = await Component.find({ _id });
      const updatedChildren = component[0].children.filter(id => id !== _id);
      await Component.update(
        { _id: parentId },
        { children: updatedChildren }
      );
      const result = await Component.deleteOne({ _id });
      return result.n === 1;
    },
    deleteUnassignedComponent: async (__, { _id }, { Component }) => {
      const result = await Component.deleteOne({ _id })
      return result.n === 1;
    },
    createComponent: async (__, args, { Component }) => {
      const component = await Component(args).save();
      const { _id } = component;
      await Component.update(
        { _id },
        { cloneId: _id, iteration: 0 }
      );
      const returnComponent = await Component.find({ _id });
      return prepare(returnComponent[0]);
    },
    copyComponent: async (__, args, { Component }) => {
      const component = await Component(args).save();
      return prepare(component);
    },
    copyChildren: async (__, { childrenData }, { Component }) => {
      const children = childrenData.map(async child => {
        const data = await Component.find({ _id: child._id });
        const component = {
          iteration: child.iteration,
          children: [],
          name: data[0].name,
          state: data[0].state, 
          props: data[0].props, 
          callbacks: data[0].callbacks, 
          projectId: data[0].projectId, 
          style: data[0].style, 
          placement: data[0].placement, 
          cloneId: data[0].cloneId, 
        }
        const copy = await Component(component).save();
        return prepare(copy)
      })
      return children
    },
    toggleComponentStyle: async (__, { _id }, { Component }) => {
      let component = await Component.find({ _id });
      const style = component[0].style === "container" ? "presentational" : "container";
      component[0].style = style;
      await Component.update({ _id: _id }, { style: style });
      const newComponent = await Component.find({ _id });
      return prepare(newComponent[0]);
    },
    addChild: async (__, { _id, childId }, { Component }) => {
      const component = await Component.find({ _id });
      const children = [...component[0].children, childId];
      return await Component.update({ _id }, { children });
    },
    editComponentName: async (__, { _id, name }, { Component }) => {
      await Component.update({ _id }, { name });
      const newComponent = await Component.find({ _id });
      return prepare(newComponent[0]);
    },
    addProp: async (__, { prop }, { Prop, Component }) => {
      await Prop(prop).save();
      const _id = prop.componentId;
      const component = await Component.find({ _id });
      return prepare(component[0]);
    },
    deleteProp: async (__, { _id }, { Prop }) => {
      const result = await Prop.deleteOne({ _id });
      return result.n === 1;
    },
    editProp: async (__, { _id, name, proptype }, { Prop }) => {
      await Prop.findOneAndUpdate({ _id }, { name, proptype });
      const prop = await Prop.find({ _id });
      return prepare(prop[0]);
    },
    addState: async (__, { state }, { State, Component }) => {
      await State(state).save();
      const _id = state.componentId;
      const component = await Component.find({ _id });
      return prepare(component[0]);
    },
    deleteState: async (__, { _id }, { State }) => {
      const result = await State.deleteOne({ _id });
      return result.n === 1;
    },
    editState: async (__, { _id, name, statetype }, { State }) => {
      await State.findOneAndUpdate({ _id }, { name, statetype });
      const state = await State.find({ _id });
      return prepare(state[0]);
    },
    addCallback: async (__, { callback }, { Callback }) => {
      let result = await Callback(callback).save();
      const cb = await Callback.find({ _id: result._id });
      return prepare(cb[0]);
    },
    deleteCallback: async (__, { _id }, { Callback }) => {
      let result = await Callback.deleteOne({ _id });
      return result.n === 1;
    },
    editCallback: async (
      __,
      { _id, name, description, setState, functionArgs },
      { Callback }
    ) => {
      const result = await Callback.findOneAndUpdate(
        { _id },
        {
          name,
          description,
          setState,
          functionArgs
        }
      );
      const cb = await Callback.find({ _id: result._id });
      return prepare(cb[0]);
    },
    unassignComponent: async (__, { _id, parentId }, { Component }) => {
      const parentComp = await Component.find({ _id: parentId });
      await Component.update({ _id }, { placement: "unassigned" });
      const newChildren = parentComp[0].children.filter(id => id !== _id);
      await Component.update(
        { _id: parentId },
        { children: newChildren }
      );
      const newParent = await Component.find({ _id: parentId});
      const newChild = await Component.find({ _id });
      return [prepare(newChild[0]), prepare(newParent[0])];
    },
    assignComponent: async (__, { _id, parentId }, { Component }) => {
      const parentComp = await Component.find({
        _id: parentId
      });
      await Component.update({ _id }, { placement: "child" });
      const newChildren = [...parentComp[0].children, _id];
      await Component.update({ _id: parentId }, { children: newChildren });
      const newParent = await Component.find({
        _id: parentId
      });
      const newChild = await Component.find({
        _id
      });
      return [prepare(newChild[0]), prepare(newParent[0])];
    }
  }
};
