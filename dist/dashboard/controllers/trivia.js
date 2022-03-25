"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.switchTriviaQuestion = exports.removeTriviaQuestion = exports.insertTrivia = exports.fetchTriviaQuestions = void 0;

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
            _context.prev = 0;
            _context.next = 3;
            return _models["default"].triviaanswer.destroy({
              where: {
                triviaquestionId: req.body.id
              }
            });

          case 3:
            removeAnswers = _context.sent;
            _context.next = 6;
            return _models["default"].triviaquestion.destroy({
              where: {
                id: req.body.id
              }
            });

          case 6:
            res.locals.trivia = _context.sent;
            console.log(res.locals.trivia);
            next();
            _context.next = 16;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            res.locals.error = _context.t0;
            next();

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
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
            _context2.prev = 0;
            _context2.next = 3;
            return _models["default"].triviaquestion.findOne({
              where: {
                id: req.body.id
              }
            });

          case 3:
            findTriviaQuestion = _context2.sent;
            _context2.next = 6;
            return findTriviaQuestion.update({
              enabled: !findTriviaQuestion.enabled
            });

          case 6:
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
            res.locals.trivia = _context2.sent;
            console.log(res.locals.trivia);
            next();
            _context2.next = 18;
            break;

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            res.locals.error = _context2.t0;
            next();

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 13]]);
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
            _context3.prev = 0;
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
            res.locals.trivia = _context3.sent;
            console.log(res.locals.trivia);
            next();
            _context3.next = 13;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);
            res.locals.error = _context3.t0;
            next();

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 8]]);
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
              _context4.next = 4;
              break;
            }

            console.log('question cannot be empty');
            res.locals.error = 'question cannot be empty';
            return _context4.abrupt("return", next());

          case 4:
            if (!(req.body.question.answers.length < 2)) {
              _context4.next = 8;
              break;
            }

            console.log('must have more then 2 answers');
            res.locals.error = 'must have more then 2 answers';
            return _context4.abrupt("return", next());

          case 8:
            if (!(req.body.question.answers.length > 5)) {
              _context4.next = 12;
              break;
            }

            console.log('maximum is 5 answers');
            res.locals.error = 'maximum is 5 answers';
            return _context4.abrupt("return", next());

          case 12:
            if (_lodash["default"].find(req.body.question.answers, {
              correct: 'true'
            })) {
              _context4.next = 16;
              break;
            }

            console.log('must have a correct answer');
            res.locals.error = 'must have a correct answer';
            return _context4.abrupt("return", next());

          case 16:
            _context4.prev = 16;
            _context4.next = 19;
            return _models["default"].triviaquestion.create({
              question: req.body.question.question
            });

          case 19:
            question = _context4.sent;
            _iterator = _createForOfIteratorHelper(req.body.question.answers);
            _context4.prev = 21;

            _iterator.s();

          case 23:
            if ((_step = _iterator.n()).done) {
              _context4.next = 31;
              break;
            }

            answer = _step.value;
            console.log(answer);
            _context4.next = 28;
            return _models["default"].triviaanswer.create({
              triviaquestionId: question.id,
              correct: answer.correct === 'true',
              answer: answer.answer
            });

          case 28:
            newAnswer = _context4.sent;

          case 29:
            _context4.next = 23;
            break;

          case 31:
            _context4.next = 36;
            break;

          case 33:
            _context4.prev = 33;
            _context4.t0 = _context4["catch"](21);

            _iterator.e(_context4.t0);

          case 36:
            _context4.prev = 36;

            _iterator.f();

            return _context4.finish(36);

          case 39:
            _context4.next = 41;
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

          case 41:
            res.locals.trivia = _context4.sent;
            console.log(res.locals.trivia);
            next();
            _context4.next = 51;
            break;

          case 46:
            _context4.prev = 46;
            _context4.t1 = _context4["catch"](16);
            console.log(_context4.t1);
            res.locals.error = _context4.t1;
            next();

          case 51:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[16, 46], [21, 33, 36, 39]]);
  }));

  return function insertTrivia(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

exports.insertTrivia = insertTrivia;