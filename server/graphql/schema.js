import typeDefs from './typeDefs';
import resolvers from './resolvers';
import { makeExecutableSchema } from "graphql-tools";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;