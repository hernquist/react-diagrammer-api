import { makeExecutableSchema } from "graphql-tools";
import enums from './typedefs/enums';
import scalars from './typedefs/scalars';
import types from './typedefs/types';
import inputs from './typedefs/inputs';
import queries from './typedefs/queries';
import mutations from './typedefs/mutations';
import resolvers from './resolvers';

const typeDefs = `
  ${enums}
  ${scalars}
  ${inputs}
  ${types}
  ${queries}
  ${mutations}
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;