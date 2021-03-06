export default `
  input InputProp {
    componentId: String!
    name: String!
    proptype: PropType!
  }

  input InputState {
    componentId: String!
    name: String!
    statetype: StateType!
  }

  input InputStateList {
    states: [InputState]
  }

  input InputArgument {
    name: String
    typeName: String
  }

  input InputSetStateParams {
    stateField: String
    stateChange: String
  }

  input InputCallback {
    componentId: String!
    name: String!
    functionArgs: [InputArgument]
    setState: [InputSetStateParams]
    description: String
  }

  input InputChildrenData {
    _id: String!
    iteration: Int!
  }
`;