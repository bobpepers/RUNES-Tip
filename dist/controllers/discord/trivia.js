"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listenTrivia = exports.discordTrivia = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = require("sequelize");

var _discord = require("discord.js");

var _discord2 = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _validateAmount = require("../../helpers/discord/validateAmount");

var _waterFaucet = require("../../helpers/waterFaucet");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var listenTrivia = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(triviaMessage, distance, triviaRecord, io, queue, updateMessage, answerString) {
    var collector;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            collector = triviaMessage.createMessageComponentCollector({
              componentType: 'BUTTON',
              time: distance
            });
            collector.on('collect', /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(reaction) {
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        if (reaction.user.bot) {
                          _context4.next = 3;
                          break;
                        }

                        _context4.next = 3;
                        return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
                          return _regenerator["default"].wrap(function _callee3$(_context3) {
                            while (1) {
                              switch (_context3.prev = _context3.next) {
                                case 0:
                                  _context3.next = 2;
                                  return _models["default"].sequelize.transaction({
                                    isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                  }, /*#__PURE__*/function () {
                                    var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                                      var findAllCorrectUserTriviaAnswersStart, findTrivUser, findTriviaTip, findTriviaAnswer, insertTriviaTip, findAllCorrectUserTriviaAnswers;
                                      return _regenerator["default"].wrap(function _callee$(_context) {
                                        while (1) {
                                          switch (_context.prev = _context.next) {
                                            case 0:
                                              _context.next = 2;
                                              return _models["default"].triviatip.findAll({
                                                where: {
                                                  triviaId: triviaRecord.id
                                                },
                                                include: [{
                                                  model: _models["default"].triviaanswer,
                                                  as: 'triviaanswer',
                                                  where: {
                                                    correct: true
                                                  }
                                                }],
                                                lock: t.LOCK.UPDATE,
                                                transaction: t
                                              });

                                            case 2:
                                              findAllCorrectUserTriviaAnswersStart = _context.sent;

                                              if (!(Number(findAllCorrectUserTriviaAnswersStart.length) < Number(triviaRecord.userCount))) {
                                                _context.next = 24;
                                                break;
                                              }

                                              _context.next = 6;
                                              return _models["default"].user.findOne({
                                                where: {
                                                  user_id: "discord-".concat(reaction.user.id)
                                                },
                                                lock: t.LOCK.UPDATE,
                                                transaction: t
                                              });

                                            case 6:
                                              findTrivUser = _context.sent;

                                              if (!findTrivUser) {
                                                _context.next = 24;
                                                break;
                                              }

                                              _context.next = 10;
                                              return _models["default"].triviatip.findOne({
                                                where: {
                                                  userId: findTrivUser.id,
                                                  triviaId: triviaRecord.id
                                                },
                                                lock: t.LOCK.UPDATE,
                                                transaction: t
                                              });

                                            case 10:
                                              findTriviaTip = _context.sent;

                                              if (findTriviaTip) {
                                                reaction.reply({
                                                  content: "We already received an answer from you",
                                                  ephemeral: true
                                                });
                                              }

                                              if (findTriviaTip) {
                                                _context.next = 24;
                                                break;
                                              }

                                              _context.next = 15;
                                              return _models["default"].triviaanswer.findOne({
                                                where: {
                                                  answer: reaction.customId,
                                                  triviaquestionId: triviaRecord.triviaquestionId
                                                },
                                                lock: t.LOCK.UPDATE,
                                                transaction: t
                                              });

                                            case 15:
                                              findTriviaAnswer = _context.sent;
                                              _context.next = 18;
                                              return _models["default"].triviatip.create({
                                                userId: findTrivUser.id,
                                                triviaId: triviaRecord.id,
                                                triviaanswerId: findTriviaAnswer.id,
                                                groupId: triviaRecord.groupId,
                                                channelId: triviaRecord.channelId
                                              }, {
                                                lock: t.LOCK.UPDATE,
                                                transaction: t
                                              });

                                            case 18:
                                              insertTriviaTip = _context.sent;
                                              _context.next = 21;
                                              return _models["default"].triviatip.findAll({
                                                where: {
                                                  triviaId: triviaRecord.id
                                                },
                                                include: [{
                                                  model: _models["default"].triviaanswer,
                                                  as: 'triviaanswer',
                                                  // required: false,
                                                  where: {
                                                    correct: true
                                                  }
                                                }],
                                                lock: t.LOCK.UPDATE,
                                                transaction: t
                                              });

                                            case 21:
                                              findAllCorrectUserTriviaAnswers = _context.sent;

                                              if (Number(findAllCorrectUserTriviaAnswers.length) >= Number(triviaRecord.userCount)) {
                                                collector.stop('Collector stopped manually');
                                              }

                                              reaction.reply({
                                                content: "Thank you, we received your answer\nYou answered: ".concat(reaction.customId),
                                                ephemeral: true
                                              });

                                            case 24:
                                              t.afterCommit(function () {
                                                console.log('done');
                                              });

                                            case 25:
                                            case "end":
                                              return _context.stop();
                                          }
                                        }
                                      }, _callee);
                                    }));

                                    return function (_x9) {
                                      return _ref4.apply(this, arguments);
                                    };
                                  }())["catch"]( /*#__PURE__*/function () {
                                    var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err) {
                                      return _regenerator["default"].wrap(function _callee2$(_context2) {
                                        while (1) {
                                          switch (_context2.prev = _context2.next) {
                                            case 0:
                                              _context2.prev = 0;
                                              _context2.next = 3;
                                              return _models["default"].error.create({
                                                type: 'answerTrivia',
                                                error: "".concat(err)
                                              });

                                            case 3:
                                              _context2.next = 8;
                                              break;

                                            case 5:
                                              _context2.prev = 5;
                                              _context2.t0 = _context2["catch"](0);

                                              _logger["default"].error("Error Discord: ".concat(_context2.t0));

                                            case 8:
                                              console.log(err);

                                              _logger["default"].error("trivia error: ".concat(err));

                                            case 10:
                                            case "end":
                                              return _context2.stop();
                                          }
                                        }
                                      }, _callee2, null, [[0, 5]]);
                                    }));

                                    return function (_x10) {
                                      return _ref5.apply(this, arguments);
                                    };
                                  }());

                                case 2:
                                case "end":
                                  return _context3.stop();
                              }
                            }
                          }, _callee3);
                        })));

                      case 3:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x8) {
                return _ref2.apply(this, arguments);
              };
            }());
            collector.on('end', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
              var activity;
              return _regenerator["default"].wrap(function _callee8$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      console.log('end trivia drop');
                      activity = [];
                      _context8.next = 4;
                      return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
                        var actualUserId;
                        return _regenerator["default"].wrap(function _callee7$(_context7) {
                          while (1) {
                            switch (_context7.prev = _context7.next) {
                              case 0:
                                clearInterval(updateMessage);
                                actualUserId = triviaRecord.user.user_id.replace('discord-', '');
                                _context7.next = 4;
                                return triviaMessage.edit({
                                  embeds: [(0, _discord2.triviaMessageDiscord)(triviaRecord.id, -1, actualUserId, triviaRecord.triviaquestion.question, answerString, triviaRecord.amount, triviaRecord.userCount)],
                                  components: []
                                });

                              case 4:
                                _context7.next = 6;
                                return _models["default"].sequelize.transaction({
                                  isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                }, /*#__PURE__*/function () {
                                  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(t) {
                                    var correctAnswer, endTriviaDrop, returnWallet, updatedWallet, faucetSetting, faucetWatered, amountEach, listOfUsersRained, withoutBotsSorted, _iterator, _step, receiver, updateTriviaTip, earnerWallet, userIdReceivedRain, tipActivity, newStringListUsers, cutStringListUsers, _iterator2, _step2, element, initiator;

                                    return _regenerator["default"].wrap(function _callee5$(_context5) {
                                      while (1) {
                                        switch (_context5.prev = _context5.next) {
                                          case 0:
                                            _context5.next = 2;
                                            return _models["default"].triviaanswer.findOne({
                                              where: {
                                                triviaquestionId: triviaRecord.triviaquestionId,
                                                correct: true
                                              },
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 2:
                                            correctAnswer = _context5.sent;
                                            _context5.next = 5;
                                            return _models["default"].trivia.findOne({
                                              where: {
                                                id: triviaRecord.id,
                                                ended: false
                                              },
                                              lock: t.LOCK.UPDATE,
                                              transaction: t,
                                              include: [{
                                                model: _models["default"].group,
                                                as: 'group'
                                              }, {
                                                model: _models["default"].channel,
                                                as: 'channel'
                                              }, {
                                                model: _models["default"].triviatip,
                                                as: 'triviatips',
                                                required: false,
                                                where: {
                                                  triviaanswerId: correctAnswer.id
                                                },
                                                include: [{
                                                  model: _models["default"].user,
                                                  as: 'user',
                                                  include: [{
                                                    model: _models["default"].wallet,
                                                    as: 'wallet'
                                                  }]
                                                }]
                                              }, {
                                                model: _models["default"].user,
                                                as: 'user'
                                              }]
                                            });

                                          case 5:
                                            endTriviaDrop = _context5.sent;

                                            if (!endTriviaDrop) {
                                              _context5.next = 93;
                                              break;
                                            }

                                            if (!(endTriviaDrop.triviatips.length <= 0)) {
                                              _context5.next = 20;
                                              break;
                                            }

                                            _context5.next = 10;
                                            return _models["default"].wallet.findOne({
                                              where: {
                                                userId: endTriviaDrop.userId
                                              },
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 10:
                                            returnWallet = _context5.sent;
                                            _context5.next = 13;
                                            return returnWallet.update({
                                              available: returnWallet.available + endTriviaDrop.amount
                                            }, {
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 13:
                                            updatedWallet = _context5.sent;
                                            _context5.next = 16;
                                            return endTriviaDrop.update({
                                              ended: true
                                            }, {
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 16:
                                            _context5.next = 18;
                                            return triviaMessage.channel.send({
                                              embeds: [(0, _discord2.triviaReturnInitiatorMessage)()]
                                            });

                                          case 18:
                                            _context5.next = 93;
                                            break;

                                          case 20:
                                            _context5.next = 22;
                                            return _models["default"].features.findOne({
                                              where: {
                                                type: 'local',
                                                name: 'trivia',
                                                groupId: endTriviaDrop.group.id,
                                                channelId: endTriviaDrop.channel.id
                                              },
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 22:
                                            faucetSetting = _context5.sent;

                                            if (faucetSetting) {
                                              _context5.next = 27;
                                              break;
                                            }

                                            _context5.next = 26;
                                            return _models["default"].features.findOne({
                                              where: {
                                                type: 'local',
                                                name: 'trivia',
                                                groupId: endTriviaDrop.group.id,
                                                channelId: null
                                              },
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 26:
                                            faucetSetting = _context5.sent;

                                          case 27:
                                            if (faucetSetting) {
                                              _context5.next = 31;
                                              break;
                                            }

                                            _context5.next = 30;
                                            return _models["default"].features.findOne({
                                              where: {
                                                type: 'global',
                                                name: 'trivia'
                                              },
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 30:
                                            faucetSetting = _context5.sent;

                                          case 31:
                                            _context5.next = 33;
                                            return (0, _waterFaucet.waterFaucet)(t, Number(endTriviaDrop.feeAmount), faucetSetting);

                                          case 33:
                                            faucetWatered = _context5.sent;
                                            //
                                            amountEach = ((Number(endTriviaDrop.amount) - Number(endTriviaDrop.feeAmount)) / Number(endTriviaDrop.triviatips.length)).toFixed(0);
                                            _context5.next = 37;
                                            return endTriviaDrop.update({
                                              ended: true,
                                              userCount: Number(endTriviaDrop.triviatips.length)
                                            }, {
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 37:
                                            listOfUsersRained = [];
                                            _context5.next = 40;
                                            return _lodash["default"].sortBy(endTriviaDrop.triviatips, 'createdAt');

                                          case 40:
                                            withoutBotsSorted = _context5.sent;
                                            // eslint-disable-next-line no-restricted-syntax
                                            _iterator = _createForOfIteratorHelper(withoutBotsSorted);
                                            _context5.prev = 42;

                                            _iterator.s();

                                          case 44:
                                            if ((_step = _iterator.n()).done) {
                                              _context5.next = 63;
                                              break;
                                            }

                                            receiver = _step.value;
                                            _context5.next = 48;
                                            return receiver.update({
                                              amount: Number(amountEach)
                                            }, {
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 48:
                                            updateTriviaTip = _context5.sent;
                                            _context5.next = 51;
                                            return receiver.user.wallet.update({
                                              available: receiver.user.wallet.available + Number(amountEach)
                                            }, {
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 51:
                                            earnerWallet = _context5.sent;

                                            if (receiver.user.ignoreMe) {
                                              listOfUsersRained.push("".concat(receiver.user.username));
                                            } else {
                                              userIdReceivedRain = receiver.user.user_id.replace('discord-', '');
                                              listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                                            }

                                            tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                                            _context5.next = 56;
                                            return _models["default"].activity.create({
                                              amount: Number(amountEach),
                                              type: 'triviatip_s',
                                              spenderId: endTriviaDrop.user.id,
                                              earnerId: receiver.user.id,
                                              triviaId: endTriviaDrop.id,
                                              triviatipId: receiver.id,
                                              earner_balance: earnerWallet.available + earnerWallet.locked
                                            }, {
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 56:
                                            tipActivity = _context5.sent;
                                            _context5.next = 59;
                                            return _models["default"].activity.findOne({
                                              where: {
                                                id: tipActivity.id
                                              },
                                              include: [{
                                                model: _models["default"].user,
                                                as: 'earner'
                                              }, {
                                                model: _models["default"].user,
                                                as: 'spender'
                                              }, {
                                                model: _models["default"].trivia,
                                                as: 'trivia'
                                              }, {
                                                model: _models["default"].triviatip,
                                                as: 'triviatip'
                                              }],
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 59:
                                            tipActivity = _context5.sent;
                                            activity.unshift(tipActivity);

                                          case 61:
                                            _context5.next = 44;
                                            break;

                                          case 63:
                                            _context5.next = 68;
                                            break;

                                          case 65:
                                            _context5.prev = 65;
                                            _context5.t0 = _context5["catch"](42);

                                            _iterator.e(_context5.t0);

                                          case 68:
                                            _context5.prev = 68;

                                            _iterator.f();

                                            return _context5.finish(68);

                                          case 71:
                                            newStringListUsers = listOfUsersRained.join(", "); // console.log(newStringListUsers);

                                            // console.log(newStringListUsers);
                                            cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                                            // eslint-disable-next-line no-restricted-syntax
                                            _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                                            _context5.prev = 74;

                                            _iterator2.s();

                                          case 76:
                                            if ((_step2 = _iterator2.n()).done) {
                                              _context5.next = 82;
                                              break;
                                            }

                                            element = _step2.value;
                                            _context5.next = 80;
                                            return triviaMessage.channel.send(element);

                                          case 80:
                                            _context5.next = 76;
                                            break;

                                          case 82:
                                            _context5.next = 87;
                                            break;

                                          case 84:
                                            _context5.prev = 84;
                                            _context5.t1 = _context5["catch"](74);

                                            _iterator2.e(_context5.t1);

                                          case 87:
                                            _context5.prev = 87;

                                            _iterator2.f();

                                            return _context5.finish(87);

                                          case 90:
                                            initiator = endTriviaDrop.user.user_id.replace('discord-', '');
                                            _context5.next = 93;
                                            return triviaMessage.channel.send({
                                              embeds: [(0, _discord2.AfterTriviaSuccessMessage)(endTriviaDrop, amountEach, initiator)]
                                            });

                                          case 93:
                                            t.afterCommit(function () {
                                              console.log('done');
                                            });

                                          case 94:
                                          case "end":
                                            return _context5.stop();
                                        }
                                      }
                                    }, _callee5, null, [[42, 65, 68, 71], [74, 84, 87, 90]]);
                                  }));

                                  return function (_x11) {
                                    return _ref8.apply(this, arguments);
                                  };
                                }())["catch"]( /*#__PURE__*/function () {
                                  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(err) {
                                    return _regenerator["default"].wrap(function _callee6$(_context6) {
                                      while (1) {
                                        switch (_context6.prev = _context6.next) {
                                          case 0:
                                            _context6.prev = 0;
                                            _context6.next = 3;
                                            return _models["default"].error.create({
                                              type: 'endTrivia',
                                              error: "".concat(err)
                                            });

                                          case 3:
                                            _context6.next = 8;
                                            break;

                                          case 5:
                                            _context6.prev = 5;
                                            _context6.t0 = _context6["catch"](0);

                                            _logger["default"].error("Error Discord: ".concat(_context6.t0));

                                          case 8:
                                            console.log(err);

                                            _logger["default"].error("trivia error: ".concat(err));

                                          case 10:
                                          case "end":
                                            return _context6.stop();
                                        }
                                      }
                                    }, _callee6, null, [[0, 5]]);
                                  }));

                                  return function (_x12) {
                                    return _ref9.apply(this, arguments);
                                  };
                                }());

                              case 6:
                                io.to('admin').emit('updateActivity', {
                                  activity: activity
                                });

                              case 7:
                              case "end":
                                return _context7.stop();
                            }
                          }
                        }, _callee7);
                      })));

                    case 4:
                    case "end":
                      return _context8.stop();
                  }
                }
              }, _callee8);
            })));

          case 3:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function listenTrivia(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
    return _ref.apply(this, arguments);
  };
}();

exports.listenTrivia = listenTrivia;

var discordTrivia = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(discordClient, message, filteredMessage, io, groupTask, channelTask, setting, faucetSetting, queue) {
    var activity, useEmojis, user;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            if (!(!groupTask || !channelTask)) {
              _context13.next = 4;
              break;
            }

            _context13.next = 3;
            return message.channel.send({
              embeds: [(0, _discord2.NotInDirectMessage)(message, 'Trivia')]
            });

          case 3:
            return _context13.abrupt("return");

          case 4:
            activity = [];
            useEmojis = [];
            _context13.next = 8;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(t) {
                var failActivity, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, totalPeople, isnumPeople, textTime, cutLastTimeLetter, cutNumberTime, isnum, amountPeopleFailActivity, timeFailActivity, _timeFailActivity, randomQuestion, failFindTriviaQuestion, timeDay, timeHour, timeMinute, timeSecond, dateObj, countDownDate, now, distance, findGroup, wallet, row, alphabet, answers, answerString, positionAlphabet, group, channel, fee, _iterator3, _step3, answer, newTriviaCreate, sendTriviaMessage, newUpdatedTriviaCreate, newTrivia, preActivity, finalActivity, triviaMessage, updateMessage;

                return _regenerator["default"].wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "discord-".concat(message.author.id)
                          },
                          include: [{
                            model: _models["default"].wallet,
                            as: 'wallet'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 2:
                        user = _context11.sent;

                        if (user) {
                          _context11.next = 11;
                          break;
                        }

                        _context11.next = 6;
                        return _models["default"].activity.create({
                          type: 'trivia_f'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 6:
                        failActivity = _context11.sent;
                        activity.unshift(failActivity);
                        _context11.next = 10;
                        return message.channel.send({
                          embeds: [(0, _discord2.userNotFoundMessage)(message, 'Trivia')]
                        });

                      case 10:
                        return _context11.abrupt("return");

                      case 11:
                        _context11.next = 13;
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[2], user, setting, 'trivia');

                      case 13:
                        _yield$validateAmount = _context11.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context11.next = 20;
                          break;
                        }

                        activity = activityValiateAmount;
                        return _context11.abrupt("return");

                      case 20:
                        /// Trivia
                        /// Amount of people to win trivia
                        totalPeople = 1;

                        if (filteredMessage[3]) {
                          // eslint-disable-next-line prefer-destructuring
                          totalPeople = filteredMessage[3];
                        }

                        isnumPeople = /^\d+$/.test(totalPeople); // Convert Message time to MS

                        // Convert Message time to MS
                        textTime = '5m';

                        if (filteredMessage[4]) {
                          // eslint-disable-next-line prefer-destructuring
                          textTime = filteredMessage[4];
                        } // const textTime = filteredMessage[3];


                        // const textTime = filteredMessage[3];
                        cutLastTimeLetter = textTime.substring(textTime.length - 1, textTime.length).toLowerCase();
                        cutNumberTime = textTime.substring(0, textTime.length - 1);
                        isnum = /^\d+$/.test(cutNumberTime);

                        if (!(!isnumPeople && totalPeople % 1 === 0)) {
                          _context11.next = 37;
                          break;
                        }

                        _context11.next = 31;
                        return _models["default"].activity.create({
                          type: 'trivia_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 31:
                        amountPeopleFailActivity = _context11.sent;
                        activity.unshift(amountPeopleFailActivity);
                        _context11.next = 35;
                        return message.channel.send({
                          embeds: [(0, _discord2.invalidPeopleAmountMessage)(message, 'Trivia')]
                        });

                      case 35:
                        _context11.next = 140;
                        break;

                      case 37:
                        if (!(!isnum // && Number(cutNumberTime) < 0
                        || cutLastTimeLetter !== 'd' && cutLastTimeLetter !== 'h' && cutLastTimeLetter !== 'm' && cutLastTimeLetter !== 's')) {
                          _context11.next = 46;
                          break;
                        }

                        _context11.next = 40;
                        return _models["default"].activity.create({
                          type: 'trivia_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 40:
                        timeFailActivity = _context11.sent;
                        activity.unshift(timeFailActivity);
                        _context11.next = 44;
                        return message.channel.send({
                          embeds: [(0, _discord2.invalidTimeMessage)(message, 'Trivia')]
                        });

                      case 44:
                        _context11.next = 140;
                        break;

                      case 46:
                        if (!(cutLastTimeLetter === 's' && Number(cutNumberTime) < 30)) {
                          _context11.next = 55;
                          break;
                        }

                        _context11.next = 49;
                        return _models["default"].activity.create({
                          type: 'trivia_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 49:
                        _timeFailActivity = _context11.sent;
                        activity.unshift(_timeFailActivity);
                        _context11.next = 53;
                        return message.channel.send({
                          embeds: [(0, _discord2.minimumTimeReactDropMessage)(message)]
                        });

                      case 53:
                        _context11.next = 140;
                        break;

                      case 55:
                        _context11.next = 57;
                        return _models["default"].triviaquestion.findOne({
                          order: _models["default"].sequelize.random(),
                          where: {
                            enabled: true
                          },
                          include: [{
                            model: _models["default"].triviaanswer,
                            as: 'triviaanswers'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 57:
                        randomQuestion = _context11.sent;

                        if (randomQuestion) {
                          _context11.next = 67;
                          break;
                        }

                        _context11.next = 61;
                        return _models["default"].activity.create({
                          type: 'trivia_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 61:
                        failFindTriviaQuestion = _context11.sent;
                        activity.unshift(failFindTriviaQuestion);
                        _context11.next = 65;
                        return message.channel.send({
                          embeds: [(0, _discord2.noTriviaQuestionFoundMessage)(message, 'Trivia')]
                        });

                      case 65:
                        _context11.next = 140;
                        break;

                      case 67:
                        timeDay = Number(cutNumberTime) * 24 * 60 * 60 * 1000;
                        timeHour = Number(cutNumberTime) * 60 * 60 * 1000;
                        timeMinute = Number(cutNumberTime) * 60 * 1000;
                        timeSecond = Number(cutNumberTime) * 1000;

                        if (!(cutLastTimeLetter === 'd' && timeDay > 172800000 || cutLastTimeLetter === 'h' && timeHour > 172800000 || cutLastTimeLetter === 'm' && timeMinute > 172800000 || cutLastTimeLetter === 's' && timeSecond > 172800000)) {
                          _context11.next = 75;
                          break;
                        }

                        _context11.next = 74;
                        return message.channel.send({
                          embeds: [(0, _discord2.maxTimeTriviaMessage)(message)]
                        });

                      case 74:
                        return _context11.abrupt("return");

                      case 75:
                        _context11.next = 77;
                        return new Date().getTime();

                      case 77:
                        dateObj = _context11.sent;

                        if (cutLastTimeLetter === 'd') {
                          dateObj += timeDay;
                        }

                        if (cutLastTimeLetter === 'h') {
                          dateObj += timeHour;
                        }

                        if (cutLastTimeLetter === 'm') {
                          dateObj += timeMinute;
                        }

                        if (cutLastTimeLetter === 's') {
                          dateObj += timeSecond;
                        }

                        _context11.next = 84;
                        return new Date(dateObj);

                      case 84:
                        dateObj = _context11.sent;
                        _context11.next = 87;
                        return dateObj.getTime();

                      case 87:
                        countDownDate = _context11.sent;
                        _context11.next = 90;
                        return new Date().getTime();

                      case 90:
                        now = _context11.sent;
                        distance = countDownDate - now; // console.log(shuffeledEmojisArray);

                        _context11.next = 94;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "discord-".concat(message.guildId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 94:
                        findGroup = _context11.sent;

                        if (findGroup) {
                          _context11.next = 99;
                          break;
                        }

                        console.log('group not found');
                        _context11.next = 140;
                        break;

                      case 99:
                        _context11.next = 101;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 101:
                        wallet = _context11.sent;
                        row = new _discord.MessageActionRow();
                        alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
                        answers = _lodash["default"].shuffle(randomQuestion.triviaanswers);
                        answerString = '';
                        positionAlphabet = 0; // console.log(answers);

                        _context11.next = 109;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "discord-".concat(message.guildId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 109:
                        group = _context11.sent;
                        _context11.next = 112;
                        return _models["default"].channel.findOne({
                          where: {
                            channelId: "discord-".concat(message.channelId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 112:
                        channel = _context11.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator3 = _createForOfIteratorHelper(answers);

                        try {
                          // eslint-disable-next-line no-restricted-syntax
                          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                            answer = _step3.value;
                            row.addComponents(new _discord.MessageButton().setCustomId(answer.answer).setLabel(alphabet[parseInt(positionAlphabet, 10)]).setStyle('PRIMARY'));
                            answerString += "".concat(alphabet[parseInt(positionAlphabet, 10)], ". ").concat(answer.answer, "\n");
                            positionAlphabet += 1;
                          }
                        } catch (err) {
                          _iterator3.e(err);
                        } finally {
                          _iterator3.f();
                        }

                        _context11.next = 118;
                        return _models["default"].trivia.create({
                          feeAmount: Number(fee),
                          amount: amount,
                          userCount: totalPeople,
                          groupId: group.id,
                          channelId: channel.id,
                          ends: dateObj,
                          triviaquestionId: randomQuestion.id,
                          discordMessageId: 'notYetSpecified',
                          userId: user.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 118:
                        newTriviaCreate = _context11.sent;
                        _context11.next = 121;
                        return message.channel.send({
                          embeds: [(0, _discord2.triviaMessageDiscord)(newTriviaCreate.id, distance, message.author.id, randomQuestion.question, answerString, amount, totalPeople)],
                          components: [row]
                        });

                      case 121:
                        sendTriviaMessage = _context11.sent;
                        _context11.next = 124;
                        return newTriviaCreate.update({
                          discordMessageId: sendTriviaMessage.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 124:
                        newUpdatedTriviaCreate = _context11.sent;
                        _context11.next = 127;
                        return _models["default"].trivia.findOne({
                          where: {
                            id: newUpdatedTriviaCreate.id
                          },
                          include: [{
                            model: _models["default"].triviaquestion,
                            as: 'triviaquestion'
                          }, {
                            model: _models["default"].user,
                            as: 'user'
                          }],
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 127:
                        newTrivia = _context11.sent;
                        _context11.next = 130;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'trivia_s',
                          spenderId: user.id,
                          triviaId: newTrivia.id,
                          spender_balance: wallet.available + wallet.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 130:
                        preActivity = _context11.sent;
                        _context11.next = 133;
                        return _models["default"].activity.findOne({
                          where: {
                            id: preActivity.id
                          },
                          include: [{
                            model: _models["default"].trivia,
                            as: 'trivia'
                          }, {
                            model: _models["default"].user,
                            as: 'spender'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 133:
                        finalActivity = _context11.sent;
                        activity.unshift(finalActivity);
                        _context11.next = 137;
                        return discordClient.guilds.cache.get(sendTriviaMessage.guildId).channels.cache.get(sendTriviaMessage.channelId).messages.fetch(sendTriviaMessage.id);

                      case 137:
                        triviaMessage = _context11.sent;
                        updateMessage = setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
                          return _regenerator["default"].wrap(function _callee10$(_context10) {
                            while (1) {
                              switch (_context10.prev = _context10.next) {
                                case 0:
                                  now = new Date().getTime();
                                  console.log('listen trivia');
                                  distance = countDownDate - now;
                                  _context10.next = 5;
                                  return triviaMessage.edit({
                                    embeds: [(0, _discord2.triviaMessageDiscord)(newTrivia.id, distance, message.author.id, randomQuestion.question, answerString, amount, totalPeople)]
                                  });

                                case 5:
                                  if (distance < 0) {
                                    clearInterval(updateMessage);
                                  }

                                case 6:
                                case "end":
                                  return _context10.stop();
                              }
                            }
                          }, _callee10);
                        })), 10000);
                        listenTrivia(triviaMessage, distance, newTrivia, io, queue, updateMessage, answerString);

                      case 140:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 141:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee11);
              }));

              return function (_x22) {
                return _ref11.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(err) {
                return _regenerator["default"].wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        _context12.prev = 0;
                        _context12.next = 3;
                        return _models["default"].error.create({
                          type: 'trivia',
                          error: "".concat(err)
                        });

                      case 3:
                        _context12.next = 8;
                        break;

                      case 5:
                        _context12.prev = 5;
                        _context12.t0 = _context12["catch"](0);

                        _logger["default"].error("Error Discord: ".concat(_context12.t0));

                      case 8:
                        console.log(err);

                        _logger["default"].error("trivia error: ".concat(err));

                        message.channel.send({
                          embeds: [(0, _discord2.discordErrorMessage)("Trivia")]
                        });

                      case 11:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12, null, [[0, 5]]);
              }));

              return function (_x23) {
                return _ref13.apply(this, arguments);
              };
            }());

          case 8:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 9:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function discordTrivia(_x13, _x14, _x15, _x16, _x17, _x18, _x19, _x20, _x21) {
    return _ref10.apply(this, arguments);
  };
}();

exports.discordTrivia = discordTrivia;