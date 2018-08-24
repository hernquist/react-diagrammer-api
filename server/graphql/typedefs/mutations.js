export default `
  type Mutation {
    login(email: String, password: String): String
    signup(name: String, email: String, password: String): String
    createProject(userId: String!, name: String!, description: String!): Project!
    createComponent(
      name: String!,
      projectId: String!,
      iteration: Int!,
      style: ComponentType!,
      placement: Placement!,
      children: [String],
      state: [InputState],
      props: [InputProp],
      callbacks: [InputCallback]
    ): Component!
    toggleComponentStyle(_id: String!): Component
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
  }
`;