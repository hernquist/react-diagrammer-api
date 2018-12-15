"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _apolloServerExpress = require("apollo-server-express");

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _schema = require("./graphql/schema");

var _schema2 = _interopRequireDefault(_schema);

var _models = require("./models/models");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// mongoose.connect("mongodb://localhost/react-diagrammer");
_mongoose2.default.connect("mongodb://hernquist:Obama2020@ds115664.mlab.com:15664/react-diagrammer").then(function (res) {
  return console.log("mongoose.connection... mlab connected");
}).catch(function (err) {
  return console.log("mongoose.connect", err);
});

var User = _mongoose2.default.model("User", _models.user);
var Project = _mongoose2.default.model("Project", _models.project);
var Component = _mongoose2.default.model("Component", _models.component);
var Prop = _mongoose2.default.model("Prop", _models.prop);
var State = _mongoose2.default.model("State", _models.state);
var Callback = _mongoose2.default.model("Callback", _models.cb);

var app = (0, _express2.default)();
var dev = process.env.NODE_ENV === "development";
var homePath = "/graphiql";

// auth middleware
var SECRET = "qwertyuiopsdflkjsdlfkj";
var addUserMiddleware = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req) {
    var token, message, signUp, _ref2, _user;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            token = req.headers["x-token"]; // || req.headers.authorization;

            console.log("[addUserMiddleware] token:", token);
            message = req.headers.referer;
            signUp = typeof message === "string" && message.includes("signUp");
            _context.prev = 4;
            _context.next = 7;
            return _jsonwebtoken2.default.verify(token, SECRET);

          case 7:
            _ref2 = _context.sent;
            _user = _ref2.user;

            console.log("[addUserMiddleware] user:", _user);
            req.user = _user;
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](4);

            if (signUp) {
              console.log("SignUp");
            } else {
              console.log("Error-1:", _context.t0.name);
            }

          case 16:
            req.next();

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[4, 13]]);
  }));

  return function addUserMiddleware(_x) {
    return _ref.apply(this, arguments);
  };
}();

app.use(addUserMiddleware);
app.use((0, _morgan2.default)("dev"));
app.use((0, _cors2.default)("*"));

app.use(homePath, (0, _apolloServerExpress.graphiqlExpress)({
  endpointURL: "/graphql"
}));

app.use("/graphql", _bodyParser2.default.json(), (0, _apolloServerExpress.graphqlExpress)(function (req) {
  return {
    schema: _schema2.default,
    context: {
      User: User,
      Project: Project,
      Component: Component,
      Prop: Prop,
      State: State,
      Callback: Callback,
      SECRET: SECRET,
      user: req.user
    }
  };
}));

app.use("/", function (_, res) {
  res.json("Go to /graphiql to test your queries and mutations!");
});

var server = app.listen(3001, function () {
  var _server$address = server.address(),
      port = _server$address.port;

  console.info("Express listen at http://localhost:" + port);
});
//# sourceMappingURL=server.js.map