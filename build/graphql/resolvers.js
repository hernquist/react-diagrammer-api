"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require("graphql");

var _language = require("graphql/language");

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var prepare = function prepare(obj) {
  obj._id = obj._id.toString();
  return obj;
};

exports.default = {
  Date: new _graphql.GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue: function parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize: function serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral: function parseLiteral(ast) {
      if (ast.kind === _language.Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    }
  }),
  Query: {
    getAuthUser: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(__, ___, context) {
        var User, _id, user;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                User = context.User;

                if (!context.user) {
                  _context.next = 9;
                  break;
                }

                _id = context.user._id;
                _context.next = 5;
                return User.find({ _id: _id });

              case 5:
                user = _context.sent;
                return _context.abrupt("return", prepare(user[0]));

              case 9:
                return _context.abrupt("return", new Error("user not authenticated"));

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      function getAuthUser(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return getAuthUser;
    }(),
    users: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(__, ___, _ref2) {
        var User = _ref2.User;
        var users;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return User.find();

              case 2:
                users = _context2.sent;
                return _context2.abrupt("return", users.map(function (user) {
                  return prepare(user);
                }));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      function users(_x4, _x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return users;
    }(),
    user: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(__, _ref4, _ref5) {
        var email = _ref4.email;
        var User = _ref5.User;
        var user;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return User.find({ email: email });

              case 2:
                user = _context3.sent;
                return _context3.abrupt("return", prepare(user[0]));

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, undefined);
      }));

      function user(_x7, _x8, _x9) {
        return _ref6.apply(this, arguments);
      }

      return user;
    }(),
    getUserById: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(__, _ref7, _ref8) {
        var _id = _ref7._id;
        var User = _ref8.User;
        var user;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return User.findById(_id);

              case 2:
                user = _context4.sent;
                return _context4.abrupt("return", prepare(user));

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, undefined);
      }));

      function getUserById(_x10, _x11, _x12) {
        return _ref9.apply(this, arguments);
      }

      return getUserById;
    }(),
    projectsByUserId: function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(__, _ref10, _ref11) {
        var userId = _ref10.userId;
        var Project = _ref11.Project;
        var projects;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return Project.find({ userId: userId });

              case 2:
                projects = _context5.sent;
                return _context5.abrupt("return", projects.map(function (project) {
                  return prepare(project);
                }));

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, undefined);
      }));

      function projectsByUserId(_x13, _x14, _x15) {
        return _ref12.apply(this, arguments);
      }

      return projectsByUserId;
    }(),
    componentsByProjectId: function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(__, _ref13, _ref14) {
        var projectId = _ref13.projectId;
        var Component = _ref14.Component;
        var components;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return Component.find({ projectId: projectId });

              case 2:
                components = _context6.sent;
                return _context6.abrupt("return", components.map(function (component) {
                  return prepare(component);
                }));

              case 4:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, undefined);
      }));

      function componentsByProjectId(_x16, _x17, _x18) {
        return _ref15.apply(this, arguments);
      }

      return componentsByProjectId;
    }(),
    propsByComponentId: function () {
      var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(__, _ref16, _ref17) {
        var componentId = _ref16.componentId;
        var Prop = _ref17.Prop;
        var props;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return Prop.find({ componentId: componentId });

              case 2:
                props = _context7.sent;
                return _context7.abrupt("return", props.map(function (prop) {
                  return prepare(prop);
                }));

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, undefined);
      }));

      function propsByComponentId(_x19, _x20, _x21) {
        return _ref18.apply(this, arguments);
      }

      return propsByComponentId;
    }(),
    stateByComponentId: function () {
      var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(__, _ref19, _ref20) {
        var componentId = _ref19.componentId;
        var State = _ref20.State;
        var state;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return State.find({ componentId: componentId });

              case 2:
                state = _context8.sent;
                return _context8.abrupt("return", state.map(function (statefield) {
                  return prepare(statefield);
                }));

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, undefined);
      }));

      function stateByComponentId(_x22, _x23, _x24) {
        return _ref21.apply(this, arguments);
      }

      return stateByComponentId;
    }(),
    callbacksByComponentId: function () {
      var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(__, _ref22, _ref23) {
        var componentId = _ref22.componentId;
        var Callback = _ref23.Callback;
        var callbacks;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return Callback.find({ componentId: componentId });

              case 2:
                callbacks = _context9.sent;
                return _context9.abrupt("return", callbacks.map(function (callback) {
                  return prepare(callback);
                }));

              case 4:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, undefined);
      }));

      function callbacksByComponentId(_x25, _x26, _x27) {
        return _ref24.apply(this, arguments);
      }

      return callbacksByComponentId;
    }()
  },
  Project: {
    components: function () {
      var _ref27 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(_ref25, ___, _ref26) {
        var _id = _ref25._id;
        var Component = _ref26.Component;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return Component.find({ projectId: _id });

              case 2:
                return _context10.abrupt("return", _context10.sent);

              case 3:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, undefined);
      }));

      function components(_x28, _x29, _x30) {
        return _ref27.apply(this, arguments);
      }

      return components;
    }()
  },
  Component: {
    props: function () {
      var _ref30 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(_ref28, ___, _ref29) {
        var cloneId = _ref28.cloneId;
        var Prop = _ref29.Prop;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return Prop.find({ componentId: cloneId });

              case 2:
                return _context11.abrupt("return", _context11.sent);

              case 3:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, undefined);
      }));

      function props(_x31, _x32, _x33) {
        return _ref30.apply(this, arguments);
      }

      return props;
    }(),
    state: function () {
      var _ref33 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(_ref31, ___, _ref32) {
        var cloneId = _ref31.cloneId;
        var State = _ref32.State;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return State.find({ componentId: cloneId });

              case 2:
                return _context12.abrupt("return", _context12.sent);

              case 3:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, undefined);
      }));

      function state(_x34, _x35, _x36) {
        return _ref33.apply(this, arguments);
      }

      return state;
    }(),
    callbacks: function () {
      var _ref36 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(_ref34, ___, _ref35) {
        var cloneId = _ref34.cloneId;
        var Callback = _ref35.Callback;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return Callback.find({ componentId: cloneId });

              case 2:
                return _context13.abrupt("return", _context13.sent);

              case 3:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, undefined);
      }));

      function callbacks(_x37, _x38, _x39) {
        return _ref36.apply(this, arguments);
      }

      return callbacks;
    }()
  },
  Mutation: {
    login: function () {
      var _ref39 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(__, _ref37, _ref38) {
        var email = _ref37.email,
            password = _ref37.password;
        var User = _ref38.User,
            SECRET = _ref38.SECRET;
        var user, isValid, token;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return User.findOne({ email: email });

              case 2:
                user = _context14.sent;

                if (user) {
                  _context14.next = 5;
                  break;
                }

                throw new Error("No user with that email");

              case 5:
                _context14.next = 7;
                return _bcrypt2.default.compare(password, user.password);

              case 7:
                isValid = _context14.sent;

                if (isValid) {
                  _context14.next = 10;
                  break;
                }

                throw new Error("Incorrect password");

              case 10:
                token = _jsonwebtoken2.default.sign({ user: _lodash2.default.pick(user, ["_id", "name"]) }, SECRET, { expiresIn: "1y" });
                return _context14.abrupt("return", token);

              case 12:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, undefined);
      }));

      function login(_x40, _x41, _x42) {
        return _ref39.apply(this, arguments);
      }

      return login;
    }(),
    signup: function () {
      var _ref40 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(__, args, context) {
        var User, user, users, username, email, savedUser, token;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                User = context.User;
                user = args;
                _context15.next = 4;
                return User.find({});

              case 4:
                users = _context15.sent;
                username = users.some(function (u) {
                  return u.name === user.name;
                });
                email = users.some(function (u) {
                  return u.email === user.email;
                });

                if (!(username || email)) {
                  _context15.next = 9;
                  break;
                }

                return _context15.abrupt("return", Number(username) + Number(email) * 2);

              case 9:
                _context15.next = 11;
                return _bcrypt2.default.hash(args.password, 12);

              case 11:
                user.password = _context15.sent;
                _context15.next = 14;
                return User(user).save();

              case 14:
                savedUser = _context15.sent;
                token = _jsonwebtoken2.default.sign({ user: _lodash2.default.pick(savedUser, ["_id", "name"]) }, context.SECRET, { expiresIn: "1y" });


                context.token = token;
                return _context15.abrupt("return", token);

              case 18:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, undefined);
      }));

      function signup(_x43, _x44, _x45) {
        return _ref40.apply(this, arguments);
      }

      return signup;
    }(),
    createProject: function () {
      var _ref42 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(__, args, _ref41) {
        var Project = _ref41.Project;
        var date, body, project;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                date = new Date();
                body = Object.assign({}, args, {
                  dateCreated: date,
                  dateVisited: date
                });
                _context16.next = 4;
                return Project(body).save();

              case 4:
                project = _context16.sent;
                return _context16.abrupt("return", prepare(project));

              case 6:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, undefined);
      }));

      function createProject(_x46, _x47, _x48) {
        return _ref42.apply(this, arguments);
      }

      return createProject;
    }(),
    deleteProject: function () {
      var _ref45 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(__, _ref43, _ref44) {
        var _id = _ref43._id;
        var Project = _ref44.Project;
        var result;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return Project.deleteOne({ _id: _id });

              case 2:
                result = _context17.sent;
                return _context17.abrupt("return", result.n === 1);

              case 4:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, undefined);
      }));

      function deleteProject(_x49, _x50, _x51) {
        return _ref45.apply(this, arguments);
      }

      return deleteProject;
    }(),
    deleteComponent: function () {
      var _ref48 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(__, _ref46, _ref47) {
        var _id = _ref46._id,
            parentId = _ref46.parentId;
        var Component = _ref47.Component;
        var component, children, result;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.next = 2;
                return Component.find({ _id: parentId });

              case 2:
                component = _context18.sent;
                children = component[0].children.filter(function (id) {
                  return id !== _id;
                });
                _context18.next = 6;
                return Component.update({ _id: parentId }, { children: children });

              case 6:
                _context18.next = 8;
                return Component.deleteOne({ _id: _id });

              case 8:
                result = _context18.sent;
                return _context18.abrupt("return", result.n === 1);

              case 10:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, undefined);
      }));

      function deleteComponent(_x52, _x53, _x54) {
        return _ref48.apply(this, arguments);
      }

      return deleteComponent;
    }(),
    deleteUnassignedComponent: function () {
      var _ref51 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(__, _ref49, _ref50) {
        var _id = _ref49._id;
        var Component = _ref50.Component;
        var result;
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.next = 2;
                return Component.deleteOne({ _id: _id });

              case 2:
                result = _context19.sent;
                return _context19.abrupt("return", result.n === 1);

              case 4:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, undefined);
      }));

      function deleteUnassignedComponent(_x55, _x56, _x57) {
        return _ref51.apply(this, arguments);
      }

      return deleteUnassignedComponent;
    }(),
    createComponent: function () {
      var _ref53 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(__, args, _ref52) {
        var Component = _ref52.Component;

        var component, _id, returnComponent;

        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.next = 2;
                return Component(args).save();

              case 2:
                component = _context20.sent;
                _id = component._id;
                _context20.next = 6;
                return Component.update({ _id: _id }, { cloneId: _id, iteration: 0 });

              case 6:
                _context20.next = 8;
                return Component.find({ _id: _id });

              case 8:
                returnComponent = _context20.sent;
                return _context20.abrupt("return", prepare(returnComponent[0]));

              case 10:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, undefined);
      }));

      function createComponent(_x58, _x59, _x60) {
        return _ref53.apply(this, arguments);
      }

      return createComponent;
    }(),
    copyComponent: function () {
      var _ref55 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(__, args, _ref54) {
        var Component = _ref54.Component;
        var component;
        return regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                _context21.next = 2;
                return Component(args).save();

              case 2:
                component = _context21.sent;
                return _context21.abrupt("return", prepare(component));

              case 4:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, undefined);
      }));

      function copyComponent(_x61, _x62, _x63) {
        return _ref55.apply(this, arguments);
      }

      return copyComponent;
    }(),
    copyChildren: function () {
      var _ref58 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(__, _ref56, _ref57) {
        var childrenData = _ref56.childrenData;
        var Component = _ref57.Component;
        var children;
        return regeneratorRuntime.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                children = childrenData.map(function () {
                  var _ref59 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(child) {
                    var data, component, copy;
                    return regeneratorRuntime.wrap(function _callee22$(_context22) {
                      while (1) {
                        switch (_context22.prev = _context22.next) {
                          case 0:
                            _context22.next = 2;
                            return Component.find({ _id: child._id });

                          case 2:
                            data = _context22.sent;
                            component = {
                              iteration: child.iteration,
                              children: [],
                              name: data[0].name,
                              state: data[0].state,
                              props: data[0].props,
                              callbacks: data[0].callbacks,
                              projectId: data[0].projectId,
                              style: data[0].style,
                              placement: data[0].placement,
                              cloneId: data[0].cloneId
                            };
                            _context22.next = 6;
                            return Component(component).save();

                          case 6:
                            copy = _context22.sent;
                            return _context22.abrupt("return", prepare(copy));

                          case 8:
                          case "end":
                            return _context22.stop();
                        }
                      }
                    }, _callee22, undefined);
                  }));

                  return function (_x67) {
                    return _ref59.apply(this, arguments);
                  };
                }());
                return _context23.abrupt("return", children);

              case 2:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, undefined);
      }));

      function copyChildren(_x64, _x65, _x66) {
        return _ref58.apply(this, arguments);
      }

      return copyChildren;
    }(),
    toggleComponentStyle: function () {
      var _ref62 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(__, _ref60, _ref61) {
        var _id = _ref60._id;
        var Component = _ref61.Component;
        var component, style, newComponent;
        return regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                _context24.next = 2;
                return Component.find({ _id: _id });

              case 2:
                component = _context24.sent;
                style = component[0].style === "container" ? "presentational" : "container";

                component[0].style = style;
                _context24.next = 7;
                return Component.update({ _id: _id }, { style: style });

              case 7:
                _context24.next = 9;
                return Component.find({ _id: _id });

              case 9:
                newComponent = _context24.sent;
                return _context24.abrupt("return", prepare(newComponent[0]));

              case 11:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, undefined);
      }));

      function toggleComponentStyle(_x68, _x69, _x70) {
        return _ref62.apply(this, arguments);
      }

      return toggleComponentStyle;
    }(),
    addChild: function () {
      var _ref65 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(__, _ref63, _ref64) {
        var _id = _ref63._id,
            childId = _ref63.childId;
        var Component = _ref64.Component;
        var component, children;
        return regeneratorRuntime.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                _context25.next = 2;
                return Component.find({ _id: _id });

              case 2:
                component = _context25.sent;
                children = [].concat(_toConsumableArray(component[0].children), [childId]);
                _context25.next = 6;
                return Component.update({ _id: _id }, { children: children });

              case 6:
                return _context25.abrupt("return", _context25.sent);

              case 7:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, undefined);
      }));

      function addChild(_x71, _x72, _x73) {
        return _ref65.apply(this, arguments);
      }

      return addChild;
    }(),
    editComponentName: function () {
      var _ref68 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(__, _ref66, _ref67) {
        var _id = _ref66._id,
            name = _ref66.name;
        var Component = _ref67.Component;
        var newComponent;
        return regeneratorRuntime.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                _context26.next = 2;
                return Component.update({ _id: _id }, { name: name });

              case 2:
                _context26.next = 4;
                return Component.find({ _id: _id });

              case 4:
                newComponent = _context26.sent;
                return _context26.abrupt("return", prepare(newComponent[0]));

              case 6:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, undefined);
      }));

      function editComponentName(_x74, _x75, _x76) {
        return _ref68.apply(this, arguments);
      }

      return editComponentName;
    }(),
    addProp: function () {
      var _ref71 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(__, _ref69, _ref70) {
        var prop = _ref69.prop;
        var Prop = _ref70.Prop,
            Component = _ref70.Component;

        var _id, component;

        return regeneratorRuntime.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                _context27.next = 2;
                return Prop(prop).save();

              case 2:
                _id = prop.componentId;
                _context27.next = 5;
                return Component.find({ _id: _id });

              case 5:
                component = _context27.sent;
                return _context27.abrupt("return", prepare(component[0]));

              case 7:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27, undefined);
      }));

      function addProp(_x77, _x78, _x79) {
        return _ref71.apply(this, arguments);
      }

      return addProp;
    }(),
    deleteProp: function () {
      var _ref74 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(__, _ref72, _ref73) {
        var _id = _ref72._id;
        var Prop = _ref73.Prop;
        var result;
        return regeneratorRuntime.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                _context28.next = 2;
                return Prop.deleteOne({ _id: _id });

              case 2:
                result = _context28.sent;
                return _context28.abrupt("return", result.n === 1);

              case 4:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, undefined);
      }));

      function deleteProp(_x80, _x81, _x82) {
        return _ref74.apply(this, arguments);
      }

      return deleteProp;
    }(),
    editProp: function () {
      var _ref77 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29(__, _ref75, _ref76) {
        var _id = _ref75._id,
            name = _ref75.name,
            proptype = _ref75.proptype;
        var Prop = _ref76.Prop;
        var prop;
        return regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                _context29.next = 2;
                return Prop.findOneAndUpdate({ _id: _id }, { name: name, proptype: proptype });

              case 2:
                _context29.next = 4;
                return Prop.find({ _id: _id });

              case 4:
                prop = _context29.sent;
                return _context29.abrupt("return", prepare(prop[0]));

              case 6:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, undefined);
      }));

      function editProp(_x83, _x84, _x85) {
        return _ref77.apply(this, arguments);
      }

      return editProp;
    }(),
    addState: function () {
      var _ref80 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30(__, _ref78, _ref79) {
        var state = _ref78.state;
        var State = _ref79.State,
            Component = _ref79.Component;

        var _id, component;

        return regeneratorRuntime.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                _context30.next = 2;
                return State(state).save();

              case 2:
                _id = state.componentId;
                _context30.next = 5;
                return Component.find({ _id: _id });

              case 5:
                component = _context30.sent;
                return _context30.abrupt("return", prepare(component[0]));

              case 7:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, undefined);
      }));

      function addState(_x86, _x87, _x88) {
        return _ref80.apply(this, arguments);
      }

      return addState;
    }(),
    deleteState: function () {
      var _ref83 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31(__, _ref81, _ref82) {
        var _id = _ref81._id;
        var State = _ref82.State;
        var result;
        return regeneratorRuntime.wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                _context31.next = 2;
                return State.deleteOne({ _id: _id });

              case 2:
                result = _context31.sent;
                return _context31.abrupt("return", result.n === 1);

              case 4:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31, undefined);
      }));

      function deleteState(_x89, _x90, _x91) {
        return _ref83.apply(this, arguments);
      }

      return deleteState;
    }(),
    editState: function () {
      var _ref86 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32(__, _ref84, _ref85) {
        var _id = _ref84._id,
            name = _ref84.name,
            statetype = _ref84.statetype;
        var State = _ref85.State;
        var state;
        return regeneratorRuntime.wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                _context32.next = 2;
                return State.findOneAndUpdate({ _id: _id }, { name: name, statetype: statetype });

              case 2:
                _context32.next = 4;
                return State.find({ _id: _id });

              case 4:
                state = _context32.sent;
                return _context32.abrupt("return", prepare(state[0]));

              case 6:
              case "end":
                return _context32.stop();
            }
          }
        }, _callee32, undefined);
      }));

      function editState(_x92, _x93, _x94) {
        return _ref86.apply(this, arguments);
      }

      return editState;
    }(),
    addCallback: function () {
      var _ref89 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33(__, _ref87, _ref88) {
        var callback = _ref87.callback;
        var Callback = _ref88.Callback;
        var result, cb;
        return regeneratorRuntime.wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                _context33.next = 2;
                return Callback(callback).save();

              case 2:
                result = _context33.sent;
                _context33.next = 5;
                return Callback.find({ _id: result._id });

              case 5:
                cb = _context33.sent;
                return _context33.abrupt("return", prepare(cb[0]));

              case 7:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, undefined);
      }));

      function addCallback(_x95, _x96, _x97) {
        return _ref89.apply(this, arguments);
      }

      return addCallback;
    }(),
    deleteCallback: function () {
      var _ref92 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee34(__, _ref90, _ref91) {
        var _id = _ref90._id;
        var Callback = _ref91.Callback;
        var result;
        return regeneratorRuntime.wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                _context34.next = 2;
                return Callback.deleteOne({ _id: _id });

              case 2:
                result = _context34.sent;
                return _context34.abrupt("return", result.n === 1);

              case 4:
              case "end":
                return _context34.stop();
            }
          }
        }, _callee34, undefined);
      }));

      function deleteCallback(_x98, _x99, _x100) {
        return _ref92.apply(this, arguments);
      }

      return deleteCallback;
    }(),
    editCallback: function () {
      var _ref95 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee35(__, _ref93, _ref94) {
        var _id = _ref93._id,
            name = _ref93.name,
            description = _ref93.description,
            setState = _ref93.setState,
            functionArgs = _ref93.functionArgs;
        var Callback = _ref94.Callback;
        var result, cb;
        return regeneratorRuntime.wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                _context35.next = 2;
                return Callback.findOneAndUpdate({ _id: _id }, {
                  name: name,
                  description: description,
                  setState: setState,
                  functionArgs: functionArgs
                });

              case 2:
                result = _context35.sent;
                _context35.next = 5;
                return Callback.find({ _id: result._id });

              case 5:
                cb = _context35.sent;
                return _context35.abrupt("return", prepare(cb[0]));

              case 7:
              case "end":
                return _context35.stop();
            }
          }
        }, _callee35, undefined);
      }));

      function editCallback(_x101, _x102, _x103) {
        return _ref95.apply(this, arguments);
      }

      return editCallback;
    }(),
    unassignComponent: function () {
      var _ref98 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee36(__, _ref96, _ref97) {
        var _id = _ref96._id,
            parentId = _ref96.parentId;
        var Component = _ref97.Component;
        var parentComp, newChildren, newParent, newChild;
        return regeneratorRuntime.wrap(function _callee36$(_context36) {
          while (1) {
            switch (_context36.prev = _context36.next) {
              case 0:
                _context36.next = 2;
                return Component.find({ _id: parentId });

              case 2:
                parentComp = _context36.sent;
                _context36.next = 5;
                return Component.update({ _id: _id }, { placement: "unassigned" });

              case 5:
                newChildren = parentComp[0].children.filter(function (id) {
                  return id !== _id;
                });
                _context36.next = 8;
                return Component.update({ _id: parentId }, { children: newChildren });

              case 8:
                _context36.next = 10;
                return Component.find({ _id: parentId });

              case 10:
                newParent = _context36.sent;
                _context36.next = 13;
                return Component.find({ _id: _id });

              case 13:
                newChild = _context36.sent;
                return _context36.abrupt("return", [prepare(newChild[0]), prepare(newParent[0])]);

              case 15:
              case "end":
                return _context36.stop();
            }
          }
        }, _callee36, undefined);
      }));

      function unassignComponent(_x104, _x105, _x106) {
        return _ref98.apply(this, arguments);
      }

      return unassignComponent;
    }(),
    assignComponent: function () {
      var _ref101 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee37(__, _ref99, _ref100) {
        var _id = _ref99._id,
            parentId = _ref99.parentId;
        var Component = _ref100.Component;
        var parentComp, newChildren, newParent, newChild;
        return regeneratorRuntime.wrap(function _callee37$(_context37) {
          while (1) {
            switch (_context37.prev = _context37.next) {
              case 0:
                _context37.next = 2;
                return Component.find({
                  _id: parentId
                });

              case 2:
                parentComp = _context37.sent;
                _context37.next = 5;
                return Component.update({ _id: _id }, { placement: "child" });

              case 5:
                newChildren = [].concat(_toConsumableArray(parentComp[0].children), [_id]);
                _context37.next = 8;
                return Component.update({ _id: parentId }, { children: newChildren });

              case 8:
                _context37.next = 10;
                return Component.find({
                  _id: parentId
                });

              case 10:
                newParent = _context37.sent;
                _context37.next = 13;
                return Component.find({
                  _id: _id
                });

              case 13:
                newChild = _context37.sent;
                return _context37.abrupt("return", [prepare(newChild[0]), prepare(newParent[0])]);

              case 15:
              case "end":
                return _context37.stop();
            }
          }
        }, _callee37, undefined);
      }));

      function assignComponent(_x107, _x108, _x109) {
        return _ref101.apply(this, arguments);
      }

      return assignComponent;
    }()
  }
};
//# sourceMappingURL=resolvers.js.map