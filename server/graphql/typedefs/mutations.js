export default `
  type Mutation {
    login(email: String, password: String): String
    signup(name: String, email: String, password: String): String
    createProject(userId: String!, name: String!, description: String!): Project!
    createComponent(
      name: String!,
      projectId: String!,
      style: ComponentType!,
      placement: Placement!
    ): Component!
    copyComponent(
      name: String!,
      projectId: String!,
      cloneId: String!
      iteration: Int!,
      style: ComponentType!,
      placement: Placement!,
      children: [String],
    ): Component!
    copyChildren(
      childrenData: [InputChildrenData]
    ): [Component]!
    deleteProject(_id: String!): Boolean
    deleteComponent(_id: String!, parentId: String!): Boolean
    deleteUnassignedComponent(_id: String!): Boolean
    toggleComponentStyle(_id: String!): Component
    addChild(_id: String!, childId: String): Boolean
    editComponentName(_id: String!, name: String!): Component
    addProp(prop: InputProp): Component
    deleteProp(_id: String): Boolean
    editProp(_id: String, name: String, proptype: PropType): Prop
    addState(state: InputState): Component
    deleteState(_id: String): Boolean
    editState(_id: String, name: String, statetype: StateType): State
    addCallback(callback: InputCallback): Callback
    deleteCallback(_id: String): Boolean
    editCallback(
      _id: String!,
      name: String,
      functionArgs: [InputArgument],
      setState: [InputSetStateParams],
      description: String
    ): Callback
    unassignComponent(_id: String!, parentId: String!): [Component]
    assignComponent(_id: String!, parentId: String!): [Component]
  }
`;
