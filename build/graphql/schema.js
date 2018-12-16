'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphqlTools = require('graphql-tools');

var _enums = require('./typedefs/enums');

var _enums2 = _interopRequireDefault(_enums);

var _scalars = require('./typedefs/scalars');

var _scalars2 = _interopRequireDefault(_scalars);

var _types = require('./typedefs/types');

var _types2 = _interopRequireDefault(_types);

var _inputs = require('./typedefs/inputs');

var _inputs2 = _interopRequireDefault(_inputs);

var _queries = require('./typedefs/queries');

var _queries2 = _interopRequireDefault(_queries);

var _mutations = require('./typedefs/mutations');

var _mutations2 = _interopRequireDefault(_mutations);

var _resolvers = require('./resolvers');

var _resolvers2 = _interopRequireDefault(_resolvers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typeDefs = '\n  ' + _enums2.default + '\n  ' + _scalars2.default + '\n  ' + _inputs2.default + '\n  ' + _types2.default + '\n  ' + _queries2.default + '\n  ' + _mutations2.default + '\n';

var schema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: typeDefs,
  resolvers: _resolvers2.default
});

exports.default = schema;
//# sourceMappingURL=schema.js.map