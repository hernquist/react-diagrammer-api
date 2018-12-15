"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n  type Query {\n    getAuthUser: User\n    users: [User!]!\n    user(email: String!): User!\n    components: [Component]\n    component(_id: String): Component\n    getUserById(_id: String!): User!\n    projectsByUserId(userId: String!): [Project!]!\n    componentsByProjectId(projectId: String!): [Component]\n    propsByComponentId(componentId: String!): [Prop]\n    stateByComponentId(componentId: String!): [State]\n    callbacksByComponentId(componentId: String!): [Callback]\n  }\n";
//# sourceMappingURL=queries.js.map