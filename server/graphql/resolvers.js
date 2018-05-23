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
        user: async (parent, {email}, { User }) => {
            const user = await User.find({ email });
            return prepare(user[0]);
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