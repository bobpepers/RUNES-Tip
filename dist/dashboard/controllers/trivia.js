"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.switchTriviaQuestion = exports.removeTriviaQuestion = exports.insertTrivia = exports.fetchTrivias = exports.fetchTriviaQuestions = exports.fetchTrivia = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _models = _interopRequireDefault(require("../../models"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var removeTriviaQuestion = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var removeAnswers;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].triviaanswer.destroy({
              where: {
                triviaquestionId: req.body.id
              }
            });

          case 2:
            removeAnswers = _context.sent;
            _context.next = 5;
            return _models["default"].triviaquestion.destroy({
              where: {
                id: req.body.id
              }
            });

          case 5:
            res.locals.removeQuestion = _context.sent;
            res.locals.name = 'removeTriviaQuestion';
            res.locals.result = {
              id: req.body.id
            };
            next();

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function removeTriviaQuestion(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.removeTriviaQuestion = removeTriviaQuestion;

var switchTriviaQuestion = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var findTriviaQuestion;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _models["default"].triviaquestion.findOne({
              where: {
                id: req.body.id
              }
            });

          case 2:
            findTriviaQuestion = _context2.sent;
            _context2.next = 5;
            return findTriviaQuestion.update({
              enabled: !findTriviaQuestion.enabled
            });

          case 5:
            res.locals.name = 'switchTriviaQuestion';
            _context2.next = 8;
            return _models["default"].triviaquestion.findOne({
              where: {
                id: findTriviaQuestion.id
              },
              include: [{
                model: _models["default"].trivia,
                as: 'trivia',
                attributes: ['id']
              }, {
                model: _models["default"].triviaanswer,
                as: 'triviaanswers'
              }]
            });

          case 8:
            res.locals.result = _context2.sent;
            next();

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function switchTriviaQuestion(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.switchTriviaQuestion = switchTriviaQuestion;

var fetchTriviaQuestions = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            res.locals.name = 'fetchTriviaQuestions';
            _context3.next = 3;
            return _models["default"].triviaquestion.findAll({
              order: [['id', 'DESC']],
              include: [{
                model: _models["default"].trivia,
                as: 'trivia',
                attributes: ['id']
              }, {
                model: _models["default"].triviaanswer,
                as: 'triviaanswers'
              }]
            });

          case 3:
            res.locals.result = _context3.sent;
            _context3.next = 6;
            return _models["default"].triviaquestion.count();

          case 6:
            res.locals.count = _context3.sent;
            next();

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function fetchTriviaQuestions(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.fetchTriviaQuestions = fetchTriviaQuestions;

var insertTrivia = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var question, _iterator, _step, answer, newAnswer;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!(req.body.question.question === '')) {
              _context4.next = 2;
              break;
            }

            throw new Error("question cannot be empty");

          case 2:
            if (!(req.body.question.answers.length < 2)) {
              _context4.next = 4;
              break;
            }

            throw new Error("must have more then 2 answers");

          case 4:
            if (!(req.body.question.answers.length > 5)) {
              _context4.next = 6;
              break;
            }

            throw new Error("maximum is 5 answers");

          case 6:
            if (_lodash["default"].find(req.body.question.answers, {
              correct: 'true'
            })) {
              _context4.next = 8;
              break;
            }

            throw new Error("must have a correct answer");

          case 8:
            _context4.next = 10;
            return _models["default"].triviaquestion.create({
              question: req.body.question.question
            });

          case 10:
            question = _context4.sent;
            _iterator = _createForOfIteratorHelper(req.body.question.answers);
            _context4.prev = 12;

            _iterator.s();

          case 14:
            if ((_step = _iterator.n()).done) {
              _context4.next = 22;
              break;
            }

            answer = _step.value;
            console.log(answer);
            _context4.next = 19;
            return _models["default"].triviaanswer.create({
              triviaquestionId: question.id,
              correct: answer.correct === 'true',
              answer: answer.answer
            });

          case 19:
            newAnswer = _context4.sent;

          case 20:
            _context4.next = 14;
            break;

          case 22:
            _context4.next = 27;
            break;

          case 24:
            _context4.prev = 24;
            _context4.t0 = _context4["catch"](12);

            _iterator.e(_context4.t0);

          case 27:
            _context4.prev = 27;

            _iterator.f();

            return _context4.finish(27);

          case 30:
            res.locals.name = 'insertTrivia';
            _context4.next = 33;
            return _models["default"].triviaquestion.findOne({
              where: {
                id: question.id
              },
              include: [{
                model: _models["default"].trivia,
                as: 'trivia',
                attributes: ['id']
              }, {
                model: _models["default"].triviaanswer,
                as: 'triviaanswers'
              }]
            });

          case 33:
            res.locals.result = _context4.sent;
            console.log(res.locals.result);
            next();

          case 36:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[12, 24, 27, 30]]);
  }));

  return function insertTrivia(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

exports.insertTrivia = insertTrivia;

var fetchTrivias = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var options;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            options = {
              order: [['id', 'DESC']],
              limit: req.body.limit,
              offset: req.body.offset,
              include: [{
                model: _models["default"].user,
                as: 'user',
                attributes: ['id', 'username', 'user_id']
              }, {
                model: _models["default"].group,
                as: 'group',
                attributes: ['id', 'groupName', 'groupId']
              }]
            };
            res.locals.name = 'trivia';
            _context5.next = 4;
            return _models["default"].trivia.count(options);

          case 4:
            res.locals.count = _context5.sent;
            _context5.next = 7;
            return _models["default"].trivia.findAll(options);

          case 7:
            res.locals.result = _context5.sent;
            next();

          case 9:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function fetchTrivias(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

exports.fetchTrivias = fetchTrivias;

var fetchTrivia = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var options;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            options = {
              where: {
                id: req.body.id
              },
              include: [{
                model: _models["default"].group,
                as: 'group',
                required: false
              }, {
                model: _models["default"].channel,
                as: 'channel',
                required: false
              }, {
                model: _models["default"].user,
                as: 'user'
              }, {
                model: _models["default"].triviaquestion,
                as: 'triviaquestion',
                include: [{
                  model: _models["default"].triviaanswer,
                  as: 'triviaanswers'
                }]
              }, {
                model: _models["default"].triviatip,
                as: 'triviatips',
                include: [{
                  model: _models["default"].triviaanswer,
                  as: 'triviaanswer'
                }, {
                  model: _models["default"].user,
                  as: 'user',
                  include: [{
                    model: _models["default"].wallet,
                    as: 'wallet'
                  }]
                }]
              }]
            };
            res.locals.name = 'trivia';
            _context6.next = 4;
            return _models["default"].trivia.findOne(options);

          case 4:
            res.locals.result = _context6.sent;
            next();

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function fetchTrivia(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();

exports.fetchTrivia = fetchTrivia;