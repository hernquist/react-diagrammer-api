export default `
  scalar Date

  enum ComponentType {
    container
    presentational
  }

  enum Placement {
    root
    unassigned
    child
    end
  }

  enum PropType {
    boolean
    number
    string
    object
    array
  }

  enum StateType {
    boolean
    number
    string
    object
    array
  }
  
  type User {
    _id: String!
    email: String!
    name: String!
    password: String!
  }
  
  type Project {
    _id: String!
    userId: String!
    name: String!
    description: String!
    dateCreated: Date!
    dateVisited: Date!
    components: [Component]
  }
  
  type Component {
    _id: String!
    name: String!
    iteration: Int!
    projectId: String!
    style: ComponentType!
    placement: Placement!
    children: [String]
    state: [State]
    props: [Prop]
    callbacks: [Callback]
  }
  
  type Prop {
    _id: String!
    componentId: String!
    name: String!
    proptype: PropType!
  }

  input InputProp {
    componentId: String!
    name: String!
    proptype: PropType!
  }

  type State {
    _id: String!
    componentId: String!
    name: String!
    statetype: StateType!
  }

  input InputState {
    componentId: String!
    name: String!
    statetype: StateType!
  }

  type Argument {
    name: String
    type: String
  }

  input InputArgument {
    name: String
    type: String
  }

  type SetStateParams {
    stateField: String
    stateChange: String
  }

  input InputSetStateParams {
    stateField: String
    stateChange: String
  }

  type Callback {
    _id: String!
    componentId: String!
    name: String!
    arguments: [Argument]
    setState: [SetStateParams]
    description: String
  }

  input InputCallback {
    componentId: String!
    name: String!
    arguments: [InputArgument]
    setState: [InputSetStateParams]
    description: String
  }

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
  }

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
    ) : Component!
    toggleComponentStyle(_id: String!): Component
    editComponentName(_id: String!, name: String!): Component
    addProp(prop: InputProp): Component
    deleteProp(_id: String): Boolean
    editProp(_id: String, name: String, proptype: PropType): Prop
    addState(state: InputState): Component
    deleteState(_id: String): Boolean
    editState(_id: String, name: String, statetype: StateType): State
    addCallback(callback: InputCallback): Callback
    deleteState(_id: String): Boolean
    editState(_id: String,
      componentId: String!,
      name: String!,
      arguments: [InputArgument],
      setState: [InputSetStateParams],
      description: String
    ): Callback
  }
`;