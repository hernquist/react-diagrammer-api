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
    },
    stateByComponentId: async (parent, { componentId }, { State }) => {
      const state = await State.find({ componentId });
      return state.map(statefield => prepare(statefield));
    },
    callbacksByComponentId: async (parent, { componentId }, { Callback }) => {
      const callbacks = await Callback.find({ componentId });
      return callbacks.map(callback => prepare(callback));
    },
  },
  Project: { components: async({ _id }, args, { Component }) => await Component.find({ projectId: _id })},
  Component: { 
    props: async({ _id }, args, { Prop }) => await Prop.find({ componentId: _id }),
    state: async({ _id }, args, { State }) => await State.find({ componentId: _id }),
    callbacks: async ({ _id }, args, { Callback }) => await Callback.find({ componentId: _id })
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
    createProject: async (parent, args, { Project }) => {
      const date = new Date();
      let body = Object.assign({}, args, {
        dateCreated: date,
        dateVisited: date
      });
      const project = await Project(body).save();
      return prepare(project);
    },
    deleteProject: async (parent, { _id }, { Project } ) => {
      let result = await Project.deleteOne({ _id });
      return result.n === 1;
    },
    createComponent: async (parent, args, { Component }) => {
      const component = await Component(args).save();
      const { _id } = component;
      console.log("first", component)
      const updatedComponent = await Component.update({ _id }, { cloneId: _id, iteration: 0} )
      console.log("second", updatedComponent)
      const returnComponent = await Component.find({ _id })
      console.log("third", returnComponent)
      return prepare(returnComponent[0]);
    },
    copyComponent: async (parent, args, { Component, State, Prop, Callback }) => {
      //not the right approach
      args.iteration = args.iteration + 1;
      console.log('args', args);

      let component = await Component(args).save();
      
      // let state = args.state ? args.state.map(stateField => {
      //   stateField.componentId = id
      //   delete statefield._id;
      //   delete statefield.__typename;
      //   return stateField
      // }) : [];
      // let props = args.props ? args.props.map(prop => {
      //   prop.componentId = id
      //   return prop
      // }): []; 
      // let callbacks =args.callbacks ? args.callbacks.map(cb => {
      //   cb.componentId = id
      //   return cb
      // }) : [];
      // console.log('state', state);
      // const updatedState = await State.insertMany(state);
      // const updatedProps = await Prop.insertMany(props);
      // const updatedCallbacks = await Callback.insertMany(callbacks);

      // component.state = updatedState.map(state => {
      //   delete state._id;
      //   delete state.__typename;
      //   return state;
      // });
      // component.props = updatedProps;
      // component.callbacks = updatedCallbacks;
      console.log('component', component)
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
    deleteState: async (parent, { _id }, { State}) => {
      let result = await State.deleteOne({ _id });
      return result.n === 1;
    },
    editState: async (parent, { _id, name, statetype }, { State}) => {
      await State.findOneAndUpdate({ _id }, { name, statetype });
      const state = await State.find({ _id });
      return prepare(state[0]);
    },
    addCallback: async (parent, { callback }, { Callback }) => {
      let result = await Callback(callback).save();
      const cb = await Callback.find({ _id: result._id })
      return prepare(cb[0]);
    },
    deleteCallback: async (parent, { _id }, { Callback }) => {
      let result = await Callback.deleteOne({ _id });
      return result.n === 1;
    },
    editCallback: async (parent, { _id, name, description, setState, functionArgs }, { Callback }) => {
      let result = await Callback.findOneAndUpdate(
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
    }
  }
};