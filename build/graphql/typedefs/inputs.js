"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n  input InputProp {\n    componentId: String!\n    name: String!\n    proptype: PropType!\n  }\n\n  input InputState {\n    componentId: String!\n    name: String!\n    statetype: StateType!\n  }\n\n  input InputStateList {\n    states: [InputState]\n  }\n\n  input InputArgument {\n    name: String\n    typeName: String\n  }\n\n  input InputSetStateParams {\n    stateField: String\n    stateChange: String\n  }\n\n  input InputCallback {\n    componentId: String!\n    name: String!\n    functionArgs: [InputArgument]\n    setState: [InputSetStateParams]\n    description: String\n  }\n\n  input InputChildrenData {\n    _id: String!\n    iteration: Int!\n  }\n";
//# sourceMappingURL=inputs.js.map