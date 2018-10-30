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
        return new Error("user not authenticated");
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
    propsByComponentId: async (parent, { componentId }, { Prop }) => {
      const props = await Prop.find({ componentId });
      return props.map(prop => prepare(prop));
    },
    stateByComponentId: async (parent, { componentId }, { State }) => {
      const state = await State.find({ componentId });
      return state.map(statefield => prepare(statefield));
    },
    callbacksByComponentId: async (parent, { componentId }, { Callback }) => {
      const callbacks = await Callback.find({ componentId });
      return callbacks.map(callback => prepare(callback));
    }
  },
  Project: {
    components: async ({ _id }, args, { Component }) =>
      await Component.find({ projectId: _id })
  },
  Component: {
    props: async ({ cloneId }, args, { Prop }) =>
      await Prop.find({ componentId: cloneId }),
    state: async ({ cloneId }, args, { State }) =>
      await State.find({ componentId: cloneId }),
    callbacks: async ({ cloneId }, args, { Callback }) =>
      await Callback.find({ componentId: cloneId })
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
      return context.token;
    },
    signup: async (parent, args, context) => {
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
    createProject: async (parent, args, { Project }) => {
      const date = new Date();
      let body = Object.assign({}, args, {
        dateCreated: date,
        dateVisited: date
      });
      const project = await Project(body).save();
      return prepare(project);
    },
    deleteProject: async (parent, { _id }, { Project }) => {
      const result = await Project.deleteOne({ _id });
      return result.n === 1;
    },
    deleteComponent: async (parent, { _id, parentId }, { Component }) => {
      const component = await Component.find({ _id });
      console.log(component[0]);
      const updatedChildren = component[0].children.filter(id => id !== _id);
      const updatedParent = await Component.update(
        { _id: parentId },
        { children: updatedChildren }
      );
      console.log(updatedParent);
      const result = await Component.deleteOne({ _id });
      return result.n === 1;
    },
    createComponent: async (parent, args, { Component }) => {
      const component = await Component(args).save();
      const { _id } = component;
      // why am I doing it this way?
      const updatedComponent = await Component.update(
        { _id },
        { cloneId: _id, iteration: 0 }
      );
      console.log(updatedComponent);
      const returnComponent = await Component.find({ _id });
      return prepare(returnComponent[0]);
    },
    copyComponent: async (parent, args, { Component }) => {
      let component = await Component(args).save();
      return prepare(component);
    },
    copyChildren: async (parent, { childrenData }, { Component }) => {
      const children = childrenData.map(async child => {
        const data = await Component.find({ _id: child._id });
        // for now -- children: [], although this doesn't get passed to the client 
        let component = {
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
        let copy = await Component(component).save();
        return prepare(copy)
      })
      return children
    },
    toggleComponentStyle: async (parent, { _id }, { Component }) => {
      let component = await Component.find({ _id });
      const style =
        component[0].style === "container" ? "presentational" : "container";
      component[0].style = style;
      await Component.update({ _id: _id }, { style: style });
      const newComponent = await Component.find({ _id });
      return prepare(newComponent[0]);
    },
    addChild: async (parent, { _id, childId }, { Component }) => {
      const component = await Component.find({ _id });
      const children = [...component[0].children, childId];
      return await Component.update({ _id }, { children });
    },
    editComponentName: async (parent, { _id, name }, { Component }) => {
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
    editProp: async (parent, { _id, name, proptype }, { Prop }) => {
      await Prop.findOneAndUpdate({ _id }, { name, proptype });
      const prop = await Prop.find({ _id });
      return prepare(prop[0]);
    },
    addState: async (parent, { state }, { State, Component }) => {
      await State(state).save();
      const _id = state.componentId;
      let component = await Component.find({ _id });
      return prepare(component[0]);
    },
    deleteState: async (parent, { _id }, { State }) => {
      let result = await State.deleteOne({ _id });
      return result.n === 1;
    },
    editState: async (parent, { _id, name, statetype }, { State }) => {
      await State.findOneAndUpdate({ _id }, { name, statetype });
      const state = await State.find({ _id });
      return prepare(state[0]);
    },
    addCallback: async (parent, { callback }, { Callback }) => {
      let result = await Callback(callback).save();
      const cb = await Callback.find({ _id: result._id });
      return prepare(cb[0]);
    },
    deleteCallback: async (parent, { _id }, { Callback }) => {
      let result = await Callback.deleteOne({ _id });
      return result.n === 1;
    },
    editCallback: async (
      parent,
      { _id, name, description, setState, functionArgs },
      { Callback }
    ) => {
      let result = await Callback.findOneAndUpdate(
        { _id },
        {
          name,
          description,
          setState,
          functionArgs
        }
      );
      console.log(result);
      const cb = await Callback.find({ _id: result._id });
      console.log("cb:", cb);
      return prepare(cb[0]);
    },
    unassignComponent: async (parent, { _id, parentId }, { Component }) => {
      const parentComp = await Component.find({
        _id: parentId
      });
      await Component.update({ _id }, { placement: "unassigned" });
      // console.log("[unassignComponent].parentComp:", parentComp);
      const newChildren = parentComp[0].children.filter(id => id !== _id);
      // console.log("[unassignComponent].newChildren", newChildren);
      let result = await Component.update(
        { _id: parentId },
        { children: newChildren }
      );
      // console.log("[unassignComponent].result:", result);
      const newParent = await Component.find({
        _id: parentId
      });
      // console.log("[unassignComponent].newParent:", prepare(newParent[0]));
      const newChild = await Component.find({
        _id
      });
      // console.log("[unassignComponent].newChild:", newChild);
      return [prepare(newChild[0]), prepare(newParent[0])];
    },
    assignComponent: async (parent, { _id, parentId }, { Component }) => {
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
