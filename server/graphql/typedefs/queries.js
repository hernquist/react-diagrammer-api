export default `
  type Query {
    getAuthUser: User
    users: [User!]!
    user(email: String!): User!
    components: [Component]
    component(_id: String): Component
    getUserById(_id: String!): User!
    projectsByUserId(userId: String!): [Project!]!
    componentsByProjectId(projectId: String!): [Component]
    propsByComponentId(componentId: String!): [Prop]
    stateByComponentId(componentId: String!): [State]
    callbacksByComponentId(componentId: String!): [Callback]
    getProjects: [Project]
  }
`;
