"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var user = exports.user = {
  email: String,
  name: String,
  password: String
};

var project = exports.project = {
  name: String,
  userId: String,
  description: String,
  dateCreated: Date,
  dateVisited: Date
};

var state = exports.state = {
  componentId: String,
  name: String,
  statetype: String
};

var prop = exports.prop = {
  componentId: String,
  name: String,
  proptype: String
};

var cb = exports.cb = {
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

var component = exports.component = {
  name: String,
  projectId: String,
  cloneId: String,
  style: String,
  iteration: Number,
  placement: String,
  children: [String],
  state: [state],
  props: [prop],
  callbacks: [cb]
};
//# sourceMappingURL=models.js.map