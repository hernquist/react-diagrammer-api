export default `
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

  type State {
    _id: String!
    componentId: String!
    name: String!
    statetype: StateType!
  }

  type Argument {
    name: String
    typeName: String
  }

  type SetStateParams {
    stateField: String
    stateChange: String
  }

  type Callback {
    _id: String!
    componentId: String!
    name: String!
    functionArgs: [Argument]
    setState: [SetStateParams]
    description: String
  }
`;
