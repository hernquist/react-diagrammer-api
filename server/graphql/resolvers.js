import { MongoClient, ObjectId } from "mongodb";
// import _ from "lodash";

const prepare = obj => {
  obj._id = obj._id.toString();
  return obj;
};

export default {
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
        getUserById: async (parent, { _id }, { User}) => {
            console.log("getUserByUser:", _id);
            const user = await User.findById(_id)
            console.log("getUserByUser:", user);
            return prepare(user);
        }
    },
    Mutation: {
        createUser: async (parent, args, { User }) => {
            const user = await User(args).save();
            user._id = user._id.toString();
            return user;
        }
    }
}