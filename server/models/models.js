export const user = {
  email: String,
  name: String,
  password: String
};

export const project = {
  name: String,
  userId: String,
  description: String,
  dateCreated: Date,
  dateVisited: Date
};

export const state =  {
  componentId: String,
  name: String,
  statetype: String
};

export const prop = {
  componentId: String,
  name: String,
  proptype: String
};

export const cb = {
  componentId: String,
  name: String,
  functionArgs: [{
    name: String,
    typeName: String
  }],
  setState: [{
    stateField: String,
    stateChange: String
  }],
  description: String
};

export const component = {
  name: String,
  projectId: String,
  style: String,
  iteration: Number,
  placement: String,
  children: [String],
  state: [state],
  props: [prop],
  callbacks: [cb]
};

