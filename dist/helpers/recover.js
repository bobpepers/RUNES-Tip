"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recoverMatrixReactdrops = exports.recoverDiscordTrivia = exports.recoverDiscordReactdrops = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _discord = require("discord.js");

var _lodash = _interopRequireDefault(require("lodash"));

var _models = _interopRequireDefault(require("../models"));

var _discord2 = require("../messages/discord");

var _reactdrop = require("../controllers/discord/reactdrop");

var _trivia = require("../controllers/discord/trivia");

var _reactdrop2 = require("../controllers/matrix/reactdrop");

var _matrix = require("../messages/matrix");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var recoverDiscordReactdrops = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(discordClient, io, queue) {
    var allRunningReactDrops, _iterator, _step, _loop;

    return _regenerator["default"].wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _models["default"].reactdrop.findAll({
              where: {
                ended: false,
                side: 'discord'
              },
              include: [{
                model: _models["default"].group,
                as: 'group'
              }, {
                model: _models["default"].channel,
                as: 'channel'
              }, {
                model: _models["default"].user,
                as: 'user'
              }]
            });

          case 2:
            allRunningReactDrops = _context3.sent;
            // eslint-disable-next-line no-restricted-syntax
            _iterator = _createForOfIteratorHelper(allRunningReactDrops);
            _context3.prev = 4;
            _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
              var runningReactDrop, actualChannelId, actualGroupId, actualUserId, reactMessage, countDownDate, now, distance, updateMessage;
              return _regenerator["default"].wrap(function _loop$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      runningReactDrop = _step.value;
                      actualChannelId = runningReactDrop.channel.channelId.replace('discord-', '');
                      actualGroupId = runningReactDrop.group.groupId.replace('discord-', '');
                      actualUserId = runningReactDrop.user.user_id.replace('discord-', ''); // eslint-disable-next-line no-await-in-loop

                      _context2.next = 6;
                      return discordClient.guilds.cache.get(actualGroupId).channels.cache.get(actualChannelId).messages.fetch(runningReactDrop.messageId);

                    case 6:
                      reactMessage = _context2.sent;
                      _context2.next = 9;
                      return runningReactDrop.ends.getTime();

                    case 9:
                      countDownDate = _context2.sent;
                      now = new Date().getTime();
                      distance = countDownDate - now;
                      console.log('recover listenReactDrop'); // eslint-disable-next-line no-await-in-loop

                      _context2.next = 15;
                      return (0, _reactdrop.listenReactDrop)(reactMessage, distance, runningReactDrop, io, queue);

                    case 15:
                      // eslint-disable-next-line no-loop-func
                      updateMessage = setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                        return _regenerator["default"].wrap(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                now = new Date().getTime();
                                distance = countDownDate - now;
                                _context.next = 4;
                                return reactMessage.edit({
                                  embeds: [(0, _discord2.reactDropMessage)(runningReactDrop.id, distance, actualUserId, runningReactDrop.emoji, runningReactDrop.amount)]
                                });

                              case 4:
                                if (distance < 0) {
                                  clearInterval(updateMessage);
                                }

                              case 5:
                              case "end":
                                return _context.stop();
                            }
                          }
                        }, _callee);
                      })), 10000);

                    case 16:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _loop);
            });

            _iterator.s();

          case 7:
            if ((_step = _iterator.n()).done) {
              _context3.next = 11;
              break;
            }

            return _context3.delegateYield(_loop(), "t0", 9);

          case 9:
            _context3.next = 7;
            break;

          case 11:
            _context3.next = 16;
            break;

          case 13:
            _context3.prev = 13;
            _context3.t1 = _context3["catch"](4);

            _iterator.e(_context3.t1);

          case 16:
            _context3.prev = 16;

            _iterator.f();

            return _context3.finish(16);

          case 19:
            return _context3.abrupt("return", true);

          case 20:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee2, null, [[4, 13, 16, 19]]);
  }));

  return function recoverDiscordReactdrops(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.recoverDiscordReactdrops = recoverDiscordReactdrops;

var recoverDiscordTrivia = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(discordClient, io, queue) {
    var allRunningTrivia, _iterator2, _step2, _loop2;

    return _regenerator["default"].wrap(function _callee4$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _models["default"].trivia.findAll({
              where: {
                ended: false
              },
              include: [{
                model: _models["default"].group,
                as: 'group'
              }, {
                model: _models["default"].channel,
                as: 'channel'
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
              }]
            });

          case 2:
            allRunningTrivia = _context6.sent;
            // eslint-disable-next-line no-restricted-syntax
            _iterator2 = _createForOfIteratorHelper(allRunningTrivia);
            _context6.prev = 4;
            _loop2 = /*#__PURE__*/_regenerator["default"].mark(function _loop2() {
              var runningTrivia, actualChannelId, actualGroupId, actualUserId, triviaMessage, countDownDate, now, distance, row, alphabet, answers, answerString, positionAlphabet, _iterator3, _step3, answer, updateMessage;

              return _regenerator["default"].wrap(function _loop2$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      runningTrivia = _step2.value;
                      actualChannelId = runningTrivia.channel.channelId.replace('discord-', '');
                      actualGroupId = runningTrivia.group.groupId.replace('discord-', '');
                      actualUserId = runningTrivia.user.user_id.replace('discord-', ''); // eslint-disable-next-line no-await-in-loop

                      _context5.next = 6;
                      return discordClient.guilds.cache.get(actualGroupId).channels.cache.get(actualChannelId).messages.fetch(runningTrivia.messageId);

                    case 6:
                      triviaMessage = _context5.sent;
                      _context5.next = 9;
                      return runningTrivia.ends.getTime();

                    case 9:
                      countDownDate = _context5.sent;
                      now = new Date().getTime();
                      distance = countDownDate - now;
                      row = new _discord.MessageActionRow();
                      alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
                      answers = _lodash["default"].shuffle(runningTrivia.triviaquestion.triviaanswers);
                      answerString = '';
                      positionAlphabet = 0; // console.log(answers);
                      // eslint-disable-next-line no-restricted-syntax

                      _iterator3 = _createForOfIteratorHelper(answers);

                      try {
                        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                          answer = _step3.value;
                          row.addComponents(new _discord.MessageButton().setCustomId(answer.answer).setLabel(alphabet[parseInt(positionAlphabet, 10)]).setStyle('PRIMARY'));
                          answerString += "".concat(alphabet[parseInt(positionAlphabet, 10)], ". ").concat(answer.answer, "\n");
                          positionAlphabet += 1;
                        } // eslint-disable-next-line no-await-in-loop

                      } catch (err) {
                        _iterator3.e(err);
                      } finally {
                        _iterator3.f();
                      }

                      _context5.next = 21;
                      return triviaMessage.edit({
                        embeds: [(0, _discord2.triviaMessageDiscord)(runningTrivia.id, distance, actualUserId, runningTrivia.triviaquestion.question, answerString, runningTrivia.amount, runningTrivia.userCount)],
                        components: [row]
                      });

                    case 21:
                      // eslint-disable-next-line no-loop-func
                      updateMessage = setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
                        return _regenerator["default"].wrap(function _callee3$(_context4) {
                          while (1) {
                            switch (_context4.prev = _context4.next) {
                              case 0:
                                now = new Date().getTime();
                                distance = countDownDate - now;
                                _context4.next = 4;
                                return triviaMessage.edit({
                                  embeds: [(0, _discord2.triviaMessageDiscord)(runningTrivia.id, distance, actualUserId, runningTrivia.triviaquestion.question, answerString, runningTrivia.amount, runningTrivia.userCount)]
                                });

                              case 4:
                                if (distance < 0) {
                                  clearInterval(updateMessage);
                                }

                              case 5:
                              case "end":
                                return _context4.stop();
                            }
                          }
                        }, _callee3);
                      })), 10000);
                      console.log('recover trivia'); // eslint-disable-next-line no-await-in-loop

                      (0, _trivia.listenTrivia)(triviaMessage, distance, runningTrivia, io, queue, updateMessage, answerString);

                    case 24:
                    case "end":
                      return _context5.stop();
                  }
                }
              }, _loop2);
            });

            _iterator2.s();

          case 7:
            if ((_step2 = _iterator2.n()).done) {
              _context6.next = 11;
              break;
            }

            return _context6.delegateYield(_loop2(), "t0", 9);

          case 9:
            _context6.next = 7;
            break;

          case 11:
            _context6.next = 16;
            break;

          case 13:
            _context6.prev = 13;
            _context6.t1 = _context6["catch"](4);

            _iterator2.e(_context6.t1);

          case 16:
            _context6.prev = 16;

            _iterator2.f();

            return _context6.finish(16);

          case 19:
            return _context6.abrupt("return", true);

          case 20:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee4, null, [[4, 13, 16, 19]]);
  }));

  return function recoverDiscordTrivia(_x4, _x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.recoverDiscordTrivia = recoverDiscordTrivia;

var recoverMatrixReactdrops = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(matrixClient, io, queue) {
    var allRunningReactDrops, _iterator4, _step4, _loop3;

    return _regenerator["default"].wrap(function _callee6$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _models["default"].reactdrop.findAll({
              where: {
                ended: false,
                side: 'matrix'
              },
              include: [{
                model: _models["default"].group,
                as: 'group'
              }, {
                model: _models["default"].user,
                as: 'user'
              }]
            });

          case 2:
            allRunningReactDrops = _context9.sent;
            // eslint-disable-next-line no-restricted-syntax
            _iterator4 = _createForOfIteratorHelper(allRunningReactDrops);
            _context9.prev = 4;
            _loop3 = /*#__PURE__*/_regenerator["default"].mark(function _loop3() {
              var runningReactDrop, actualGroupId, countDownDate, now, distance, updateMessage;
              return _regenerator["default"].wrap(function _loop3$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      runningReactDrop = _step4.value;
                      actualGroupId = runningReactDrop.group.groupId.replace('matrix-', ''); // const actualUserId = runningReactDrop.user.user_id.replace('matrix-', '');
                      // eslint-disable-next-line no-await-in-loop

                      _context8.next = 4;
                      return runningReactDrop.ends.getTime();

                    case 4:
                      countDownDate = _context8.sent;
                      now = new Date().getTime();
                      distance = countDownDate - now;
                      console.log('recover listenMatrixReactDrop'); // eslint-disable-next-line no-await-in-loop

                      _context8.next = 10;
                      return (0, _reactdrop2.listenMatrixReactDrop)(matrixClient, runningReactDrop.messageId, distance, runningReactDrop, io, queue);

                    case 10:
                      // eslint-disable-next-line no-loop-func
                      updateMessage = setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
                        var editedMessage;
                        return _regenerator["default"].wrap(function _callee5$(_context7) {
                          while (1) {
                            switch (_context7.prev = _context7.next) {
                              case 0:
                                now = new Date().getTime();
                                console.log('listen');
                                distance = countDownDate - now;
                                editedMessage = (0, _matrix.matrixReactDropMessage)(runningReactDrop.id, distance, runningReactDrop.user, runningReactDrop.emoji, runningReactDrop.amount);
                                _context7.next = 6;
                                return matrixClient.sendEvent(actualGroupId, 'm.room.message', {
                                  "m.relates_to": {
                                    event_id: runningReactDrop.messageId,
                                    rel_type: "m.replace"
                                  },
                                  body: editedMessage.body,
                                  "m.new_content": editedMessage
                                });

                              case 6:
                                if (distance < 0) {
                                  clearInterval(updateMessage);
                                }

                              case 7:
                              case "end":
                                return _context7.stop();
                            }
                          }
                        }, _callee5);
                      })), 10000);

                    case 11:
                    case "end":
                      return _context8.stop();
                  }
                }
              }, _loop3);
            });

            _iterator4.s();

          case 7:
            if ((_step4 = _iterator4.n()).done) {
              _context9.next = 11;
              break;
            }

            return _context9.delegateYield(_loop3(), "t0", 9);

          case 9:
            _context9.next = 7;
            break;

          case 11:
            _context9.next = 16;
            break;

          case 13:
            _context9.prev = 13;
            _context9.t1 = _context9["catch"](4);

            _iterator4.e(_context9.t1);

          case 16:
            _context9.prev = 16;

            _iterator4.f();

            return _context9.finish(16);

          case 19:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee6, null, [[4, 13, 16, 19]]);
  }));

  return function recoverMatrixReactdrops(_x7, _x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

exports.recoverMatrixReactdrops = recoverMatrixReactdrops;