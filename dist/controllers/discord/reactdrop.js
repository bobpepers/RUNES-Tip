"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listenReactDrop = exports.discordReactDrop = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _svgPngConverter = require("svg-png-converter");

var _lodash = _interopRequireDefault(require("lodash"));

var _svgCaptcha = _interopRequireDefault(require("svg-captcha"));

var _sequelize = require("sequelize");

var _discord = require("discord.js");

var _algebraicCaptcha = require("algebraic-captcha");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _discord2 = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _emoji = _interopRequireDefault(require("../../config/emoji"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _validateAmount = require("../../helpers/discord/validateAmount");

var _waterFaucet = require("../../helpers/discord/waterFaucet");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var settings = (0, _settings["default"])();

function shuffle(array) {
  var currentIndex = array.length;
  var randomIndex; // While there remain elements to shuffle...

  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex); // currentIndex--;

    currentIndex -= 1; // And swap it with the current element.
    // eslint-disable-next-line no-param-reassign

    var _ref = [array[randomIndex], array[currentIndex]];
    array[currentIndex] = _ref[0];
    array[randomIndex] = _ref[1];
  }

  return array;
}

var listenReactDrop = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(reactMessage, distance, reactDrop, io, queue) {
    var filter, collector;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            filter = function filter() {
              return true;
            };

            collector = reactMessage.createReactionCollector({
              filter: filter,
              time: distance
            });
            collector.on('collect', /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(reaction, collector) {
                var findReactUser, findReactTip, captcha, captchaPng, _findReactTip, backgroundArray, captchaTypeArray, randomFunc, randomBackground, modes, preCaptcha, constructEmoji, captchaPngFixed, awaitCaptchaMessage, Ccollector;

                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        if (collector.bot) {
                          _context7.next = 55;
                          break;
                        }

                        _context7.next = 3;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "discord-".concat(collector.id)
                          }
                        });

                      case 3:
                        findReactUser = _context7.sent;
                        _context7.next = 6;
                        return _models["default"].reactdroptip.findOne({
                          where: {
                            userId: findReactUser.id,
                            reactdropId: reactDrop.id
                          }
                        });

                      case 6:
                        findReactTip = _context7.sent;

                        if (findReactTip) {
                          _context7.next = 55;
                          break;
                        }

                        backgroundArray = ['#cc9966', '#ffffff', "#FF5733", "#33FFE6", "#272F92 ", "#882792", "#922759"];
                        captchaTypeArray = ['svg', 'algebraic'];
                        randomFunc = captchaTypeArray[Math.floor(Math.random() * captchaTypeArray.length)];
                        randomBackground = backgroundArray[Math.floor(Math.random() * backgroundArray.length)];

                        if (!(randomFunc === 'svg')) {
                          _context7.next = 21;
                          break;
                        }

                        while (!captcha || Number(captcha.text) < 0) {
                          captcha = _svgCaptcha["default"].createMathExpr({
                            mathMin: 0,
                            mathMax: 9,
                            mathOperator: '+-',
                            background: randomBackground,
                            noise: 15,
                            color: true
                          });
                        }

                        console.log(captcha);
                        _context7.next = 17;
                        return (0, _svgPngConverter.svg2png)({
                          input: "".concat(captcha.data).trim(),
                          encoding: 'dataURL',
                          format: 'png',
                          width: 150,
                          height: 50,
                          multiplier: 3,
                          quality: 1
                        });

                      case 17:
                        captchaPng = _context7.sent;
                        _context7.next = 20;
                        return _models["default"].reactdroptip.create({
                          status: 'waiting',
                          captchaType: 'svg',
                          solution: captcha.text,
                          userId: findReactUser.id,
                          reactdropId: reactDrop.id
                        });

                      case 20:
                        _findReactTip = _context7.sent;

                      case 21:
                        if (!(randomFunc === 'algebraic')) {
                          _context7.next = 36;
                          break;
                        }

                        modes = ['formula', 'equation'];

                      case 23:
                        if (!(!captcha || Number(captcha.answer) < 0)) {
                          _context7.next = 30;
                          break;
                        }

                        preCaptcha = new _algebraicCaptcha.AlgebraicCaptcha({
                          width: 150,
                          height: 50,
                          background: randomBackground,
                          noise: Math.floor(Math.random() * (8 - 4 + 1)) + 4,
                          minValue: 1,
                          maxValue: 9,
                          operandAmount: Math.floor(Math.random() * 2 + 1),
                          operandTypes: ['+', '-'],
                          mode: modes[Math.round(Math.random())],
                          targetSymbol: '?'
                        }); // eslint-disable-next-line no-await-in-loop

                        _context7.next = 27;
                        return preCaptcha.generateCaptcha();

                      case 27:
                        captcha = _context7.sent;
                        _context7.next = 23;
                        break;

                      case 30:
                        _context7.next = 32;
                        return (0, _svgPngConverter.svg2png)({
                          input: "".concat(captcha.image).trim(),
                          encoding: 'dataURL',
                          format: 'png',
                          width: 150,
                          height: 50,
                          multiplier: 3,
                          quality: 1
                        });

                      case 32:
                        captchaPng = _context7.sent;
                        _context7.next = 35;
                        return _models["default"].reactdroptip.create({
                          status: 'waiting',
                          captchaType: 'algebraic',
                          solution: captcha.answer.toString(),
                          userId: findReactUser.id,
                          reactdropId: reactDrop.id
                        });

                      case 35:
                        _findReactTip = _context7.sent;

                      case 36:
                        if (reaction._emoji && reaction._emoji.animated) {
                          constructEmoji = reaction._emoji.id ? "<a:".concat(reaction._emoji.name, ":").concat(reaction._emoji.id, ">") : reaction._emoji.name;
                        } else if (reaction._emoji && !reaction._emoji.animated) {
                          constructEmoji = reaction._emoji.id ? "<:".concat(reaction._emoji.name, ":").concat(reaction._emoji.id, ">") : reaction._emoji.name;
                        }

                        if (!(reactDrop.emoji !== constructEmoji)) {
                          _context7.next = 44;
                          break;
                        }

                        _context7.next = 40;
                        return collector.send('Failed, pressed wrong emoji');

                      case 40:
                        _context7.next = 42;
                        return _findReactTip.update({
                          status: 'failed'
                        });

                      case 42:
                        _context7.next = 55;
                        break;

                      case 44:
                        captchaPngFixed = captchaPng.replace('data:image/png;base64,', '');
                        _context7.next = 47;
                        return collector.send({
                          embeds: [(0, _discord2.ReactdropCaptchaMessage)(collector.id)],
                          files: [new _discord.MessageAttachment(Buffer.from(captchaPngFixed, 'base64'), 'captcha.png')]
                        });

                      case 47:
                        awaitCaptchaMessage = _context7.sent;
                        _context7.next = 50;
                        return awaitCaptchaMessage.channel.createMessageCollector({
                          filter: filter,
                          time: 60000,
                          max: 1
                        });

                      case 50:
                        Ccollector = _context7.sent;
                        _context7.next = 53;
                        return Ccollector.on('collect', /*#__PURE__*/function () {
                          var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(m) {
                            var collectReactdrop;
                            return _regenerator["default"].wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    _context3.next = 2;
                                    return _models["default"].sequelize.transaction({
                                      isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                    }, /*#__PURE__*/function () {
                                      var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                                        var reactDropRecord, row, _reactDropRecord, _row;

                                        return _regenerator["default"].wrap(function _callee$(_context) {
                                          while (1) {
                                            switch (_context.prev = _context.next) {
                                              case 0:
                                                if (!(m.content === _findReactTip.solution)) {
                                                  _context.next = 13;
                                                  break;
                                                }

                                                _context.next = 3;
                                                return _findReactTip.update({
                                                  status: 'success'
                                                }, {
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 3:
                                                _context.next = 5;
                                                return _models["default"].reactdrop.findOne({
                                                  where: {
                                                    id: _findReactTip.reactdropId
                                                  },
                                                  include: [{
                                                    model: _models["default"].group,
                                                    as: 'group'
                                                  }, {
                                                    model: _models["default"].channel,
                                                    as: 'channel'
                                                  }],
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 5:
                                                reactDropRecord = _context.sent;
                                                row = new _discord.MessageActionRow().addComponents(new _discord.MessageButton().setLabel('Back to ReactDrop').setStyle('LINK').setURL("https://discord.com/channels/".concat(reactDropRecord.group.groupId.replace("discord-", ""), "/").concat(reactDropRecord.channel.channelId.replace("discord-", ""), "/").concat(reactDropRecord.discordMessageId)));
                                                _context.next = 9;
                                                return m.react('✅');

                                              case 9:
                                                _context.next = 11;
                                                return collector.send({
                                                  content: "\u200B",
                                                  components: [row]
                                                });

                                              case 11:
                                                _context.next = 24;
                                                break;

                                              case 13:
                                                if (!(m.content !== _findReactTip.solution)) {
                                                  _context.next = 24;
                                                  break;
                                                }

                                                _context.next = 16;
                                                return _findReactTip.update({
                                                  status: 'failed'
                                                }, {
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 16:
                                                _context.next = 18;
                                                return _models["default"].reactdrop.findOne({
                                                  where: {
                                                    id: _findReactTip.reactdropId
                                                  },
                                                  include: [{
                                                    model: _models["default"].group,
                                                    as: 'group'
                                                  }, {
                                                    model: _models["default"].channel,
                                                    as: 'channel'
                                                  }],
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 18:
                                                _reactDropRecord = _context.sent;
                                                _row = new _discord.MessageActionRow().addComponents(new _discord.MessageButton().setLabel('Back to ReactDrop').setStyle('LINK').setURL("https://discord.com/channels/".concat(_reactDropRecord.group.groupId.replace("discord-", ""), "/").concat(_reactDropRecord.channel.channelId.replace("discord-", ""), "/").concat(_reactDropRecord.discordMessageId)));
                                                _context.next = 22;
                                                return m.react('❌');

                                              case 22:
                                                _context.next = 24;
                                                return collector.send({
                                                  content: "Failed\nSolution: **".concat(_findReactTip.solution, "**"),
                                                  components: [_row]
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
                                        return _ref5.apply(this, arguments);
                                      };
                                    }())["catch"]( /*#__PURE__*/function () {
                                      var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err) {
                                        return _regenerator["default"].wrap(function _callee2$(_context2) {
                                          while (1) {
                                            switch (_context2.prev = _context2.next) {
                                              case 0:
                                                _context2.prev = 0;
                                                _context2.next = 3;
                                                return _models["default"].error.create({
                                                  type: 'collectAnswerReactDrop',
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
                                                console.log('failed');

                                              case 9:
                                              case "end":
                                                return _context2.stop();
                                            }
                                          }
                                        }, _callee2, null, [[0, 5]]);
                                      }));

                                      return function (_x10) {
                                        return _ref6.apply(this, arguments);
                                      };
                                    }());

                                  case 2:
                                    collectReactdrop = _context3.sent;

                                  case 3:
                                  case "end":
                                    return _context3.stop();
                                }
                              }
                            }, _callee3);
                          }));

                          return function (_x8) {
                            return _ref4.apply(this, arguments);
                          };
                        }());

                      case 53:
                        _context7.next = 55;
                        return Ccollector.on('end', /*#__PURE__*/function () {
                          var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(collected) {
                            var endingCollectReactdrop;
                            return _regenerator["default"].wrap(function _callee6$(_context6) {
                              while (1) {
                                switch (_context6.prev = _context6.next) {
                                  case 0:
                                    _context6.next = 2;
                                    return Promise(function (r) {
                                      return setTimeout(r, 200);
                                    });

                                  case 2:
                                    _context6.next = 4;
                                    return _models["default"].sequelize.transaction({
                                      isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                    }, /*#__PURE__*/function () {
                                      var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(t) {
                                        var findReactUserTwo, findReactTipTwo;
                                        return _regenerator["default"].wrap(function _callee4$(_context4) {
                                          while (1) {
                                            switch (_context4.prev = _context4.next) {
                                              case 0:
                                                _context4.next = 2;
                                                return _models["default"].user.findOne({
                                                  where: {
                                                    user_id: "discord-".concat(collector.id)
                                                  },
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 2:
                                                findReactUserTwo = _context4.sent;
                                                _context4.next = 5;
                                                return _models["default"].reactdroptip.findOne({
                                                  where: {
                                                    userId: findReactUserTwo.id,
                                                    reactdropId: reactDrop.id
                                                  },
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 5:
                                                findReactTipTwo = _context4.sent;

                                                if (!(findReactTipTwo.status === 'waiting')) {
                                                  _context4.next = 10;
                                                  break;
                                                }

                                                _context4.next = 9;
                                                return findReactTipTwo.update({
                                                  status: 'failed'
                                                }, {
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 9:
                                                collector.send('Out of time');

                                              case 10:
                                                t.afterCommit(function () {
                                                  console.log('done');
                                                });

                                              case 11:
                                              case "end":
                                                return _context4.stop();
                                            }
                                          }
                                        }, _callee4);
                                      }));

                                      return function (_x12) {
                                        return _ref8.apply(this, arguments);
                                      };
                                    }())["catch"]( /*#__PURE__*/function () {
                                      var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(err) {
                                        return _regenerator["default"].wrap(function _callee5$(_context5) {
                                          while (1) {
                                            switch (_context5.prev = _context5.next) {
                                              case 0:
                                                _context5.prev = 0;
                                                _context5.next = 3;
                                                return _models["default"].error.create({
                                                  type: 'endAnswerReactDrop',
                                                  error: "".concat(err)
                                                });

                                              case 3:
                                                _context5.next = 8;
                                                break;

                                              case 5:
                                                _context5.prev = 5;
                                                _context5.t0 = _context5["catch"](0);

                                                _logger["default"].error("Error Discord: ".concat(_context5.t0));

                                              case 8:
                                                console.log(err);
                                                _context5.next = 11;
                                                return collector.send('Something went wrong');

                                              case 11:
                                              case "end":
                                                return _context5.stop();
                                            }
                                          }
                                        }, _callee5, null, [[0, 5]]);
                                      }));

                                      return function (_x13) {
                                        return _ref9.apply(this, arguments);
                                      };
                                    }());

                                  case 4:
                                    endingCollectReactdrop = _context6.sent;
                                    _context6.next = 7;
                                    return queue.add(function () {
                                      return endingCollectReactdrop;
                                    });

                                  case 7:
                                  case "end":
                                    return _context6.stop();
                                }
                              }
                            }, _callee6);
                          }));

                          return function (_x11) {
                            return _ref7.apply(this, arguments);
                          };
                        }());

                      case 55:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x6, _x7) {
                return _ref3.apply(this, arguments);
              };
            }());
            collector.on('end', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
              var activity, endingReactdrop;
              return _regenerator["default"].wrap(function _callee10$(_context10) {
                while (1) {
                  switch (_context10.prev = _context10.next) {
                    case 0:
                      activity = [];
                      _context10.next = 3;
                      return _models["default"].sequelize.transaction({
                        isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                      }, /*#__PURE__*/function () {
                        var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(t) {
                          var endReactDrop, returnWallet, updatedWallet, faucetSetting, faucetWatered, amountEach, listOfUsersRained, withoutBotsSorted, _iterator, _step, receiver, earnerWallet, userIdReceivedRain, tipActivity, newStringListUsers, cutStringListUsers, _iterator2, _step2, element, initiator;

                          return _regenerator["default"].wrap(function _callee8$(_context8) {
                            while (1) {
                              switch (_context8.prev = _context8.next) {
                                case 0:
                                  _context8.next = 2;
                                  return _models["default"].reactdrop.findOne({
                                    where: {
                                      id: reactDrop.id,
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
                                      model: _models["default"].reactdroptip,
                                      as: 'reactdroptips',
                                      required: false,
                                      where: {
                                        status: 'success'
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

                                case 2:
                                  endReactDrop = _context8.sent;

                                  if (!endReactDrop) {
                                    _context8.next = 86;
                                    break;
                                  }

                                  if (!(endReactDrop.reactdroptips.length <= 0)) {
                                    _context8.next = 16;
                                    break;
                                  }

                                  _context8.next = 7;
                                  return _models["default"].wallet.findOne({
                                    where: {
                                      userId: endReactDrop.userId
                                    },
                                    lock: t.LOCK.UPDATE,
                                    transaction: t
                                  });

                                case 7:
                                  returnWallet = _context8.sent;
                                  _context8.next = 10;
                                  return returnWallet.update({
                                    available: returnWallet.available + endReactDrop.amount
                                  }, {
                                    lock: t.LOCK.UPDATE,
                                    transaction: t
                                  });

                                case 10:
                                  updatedWallet = _context8.sent;
                                  _context8.next = 13;
                                  return endReactDrop.update({
                                    ended: true
                                  }, {
                                    lock: t.LOCK.UPDATE,
                                    transaction: t
                                  });

                                case 13:
                                  // reactMessage.channel.send('Nobody claimed, returning funds to reactdrop initiator');
                                  reactMessage.channel.send({
                                    embeds: [(0, _discord2.ReactDropReturnInitiatorMessage)()]
                                  });
                                  _context8.next = 86;
                                  break;

                                case 16:
                                  _context8.next = 18;
                                  return _models["default"].features.findOne({
                                    where: {
                                      type: 'local',
                                      name: 'faucet',
                                      groupId: endReactDrop.group.id,
                                      channelId: endReactDrop.channel.id
                                    },
                                    lock: t.LOCK.UPDATE,
                                    transaction: t
                                  });

                                case 18:
                                  faucetSetting = _context8.sent;

                                  if (faucetSetting) {
                                    _context8.next = 23;
                                    break;
                                  }

                                  _context8.next = 22;
                                  return _models["default"].features.findOne({
                                    where: {
                                      type: 'local',
                                      name: 'faucet',
                                      groupId: endReactDrop.group.id,
                                      channelId: null
                                    },
                                    lock: t.LOCK.UPDATE,
                                    transaction: t
                                  });

                                case 22:
                                  faucetSetting = _context8.sent;

                                case 23:
                                  if (faucetSetting) {
                                    _context8.next = 27;
                                    break;
                                  }

                                  _context8.next = 26;
                                  return _models["default"].features.findOne({
                                    where: {
                                      type: 'global',
                                      name: 'faucet'
                                    },
                                    lock: t.LOCK.UPDATE,
                                    transaction: t
                                  });

                                case 26:
                                  faucetSetting = _context8.sent;

                                case 27:
                                  _context8.next = 29;
                                  return (0, _waterFaucet.waterFaucet)(t, Number(endReactDrop.feeAmount), faucetSetting);

                                case 29:
                                  faucetWatered = _context8.sent;
                                  //
                                  amountEach = ((Number(endReactDrop.amount) - Number(endReactDrop.feeAmount)) / Number(endReactDrop.reactdroptips.length)).toFixed(0);
                                  _context8.next = 33;
                                  return endReactDrop.update({
                                    ended: true,
                                    userCount: Number(endReactDrop.reactdroptips.length)
                                  }, {
                                    lock: t.LOCK.UPDATE,
                                    transaction: t
                                  });

                                case 33:
                                  listOfUsersRained = [];
                                  _context8.next = 36;
                                  return _lodash["default"].sortBy(endReactDrop.reactdroptips, 'createdAt');

                                case 36:
                                  withoutBotsSorted = _context8.sent;
                                  // eslint-disable-next-line no-restricted-syntax
                                  _iterator = _createForOfIteratorHelper(withoutBotsSorted);
                                  _context8.prev = 38;

                                  _iterator.s();

                                case 40:
                                  if ((_step = _iterator.n()).done) {
                                    _context8.next = 56;
                                    break;
                                  }

                                  receiver = _step.value;
                                  _context8.next = 44;
                                  return receiver.user.wallet.update({
                                    available: receiver.user.wallet.available + Number(amountEach)
                                  }, {
                                    lock: t.LOCK.UPDATE,
                                    transaction: t
                                  });

                                case 44:
                                  earnerWallet = _context8.sent;

                                  if (receiver.user.ignoreMe) {
                                    listOfUsersRained.push("".concat(receiver.user.username));
                                  } else {
                                    userIdReceivedRain = receiver.user.user_id.replace('discord-', '');
                                    listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                                  }

                                  tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                                  _context8.next = 49;
                                  return _models["default"].activity.create({
                                    amount: Number(amountEach),
                                    type: 'reactdroptip_s',
                                    spenderId: endReactDrop.user.id,
                                    earnerId: receiver.user.id,
                                    reactdropId: endReactDrop.id,
                                    reactdroptipId: receiver.id,
                                    earner_balance: earnerWallet.available + earnerWallet.locked
                                  }, {
                                    lock: t.LOCK.UPDATE,
                                    transaction: t
                                  });

                                case 49:
                                  tipActivity = _context8.sent;
                                  _context8.next = 52;
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
                                      model: _models["default"].reactdrop,
                                      as: 'reactdrop'
                                    }, {
                                      model: _models["default"].reactdroptip,
                                      as: 'reactdroptip'
                                    }],
                                    lock: t.LOCK.UPDATE,
                                    transaction: t
                                  });

                                case 52:
                                  tipActivity = _context8.sent;
                                  activity.unshift(tipActivity);

                                case 54:
                                  _context8.next = 40;
                                  break;

                                case 56:
                                  _context8.next = 61;
                                  break;

                                case 58:
                                  _context8.prev = 58;
                                  _context8.t0 = _context8["catch"](38);

                                  _iterator.e(_context8.t0);

                                case 61:
                                  _context8.prev = 61;

                                  _iterator.f();

                                  return _context8.finish(61);

                                case 64:
                                  newStringListUsers = listOfUsersRained.join(", "); // console.log(newStringListUsers);

                                  // console.log(newStringListUsers);
                                  cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                                  // eslint-disable-next-line no-restricted-syntax
                                  _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                                  _context8.prev = 67;

                                  _iterator2.s();

                                case 69:
                                  if ((_step2 = _iterator2.n()).done) {
                                    _context8.next = 75;
                                    break;
                                  }

                                  element = _step2.value;
                                  _context8.next = 73;
                                  return reactMessage.channel.send(element);

                                case 73:
                                  _context8.next = 69;
                                  break;

                                case 75:
                                  _context8.next = 80;
                                  break;

                                case 77:
                                  _context8.prev = 77;
                                  _context8.t1 = _context8["catch"](67);

                                  _iterator2.e(_context8.t1);

                                case 80:
                                  _context8.prev = 80;

                                  _iterator2.f();

                                  return _context8.finish(80);

                                case 83:
                                  initiator = endReactDrop.user.user_id.replace('discord-', '');
                                  _context8.next = 86;
                                  return reactMessage.channel.send({
                                    embeds: [(0, _discord2.AfterReactDropSuccessMessage)(endReactDrop, amountEach, initiator)]
                                  });

                                case 86:
                                  t.afterCommit(function () {
                                    console.log('done');
                                  });

                                case 87:
                                case "end":
                                  return _context8.stop();
                              }
                            }
                          }, _callee8, null, [[38, 58, 61, 64], [67, 77, 80, 83]]);
                        }));

                        return function (_x14) {
                          return _ref11.apply(this, arguments);
                        };
                      }())["catch"]( /*#__PURE__*/function () {
                        var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(err) {
                          return _regenerator["default"].wrap(function _callee9$(_context9) {
                            while (1) {
                              switch (_context9.prev = _context9.next) {
                                case 0:
                                  _context9.prev = 0;
                                  _context9.next = 3;
                                  return _models["default"].error.create({
                                    type: 'endReactDrop',
                                    error: "".concat(err)
                                  });

                                case 3:
                                  _context9.next = 8;
                                  break;

                                case 5:
                                  _context9.prev = 5;
                                  _context9.t0 = _context9["catch"](0);

                                  _logger["default"].error("Error Discord: ".concat(_context9.t0));

                                case 8:
                                  console.log(err);
                                  console.log('error');

                                case 10:
                                case "end":
                                  return _context9.stop();
                              }
                            }
                          }, _callee9, null, [[0, 5]]);
                        }));

                        return function (_x15) {
                          return _ref12.apply(this, arguments);
                        };
                      }());

                    case 3:
                      endingReactdrop = _context10.sent;
                      _context10.next = 6;
                      return queue.add(function () {
                        return endingReactdrop;
                      });

                    case 6:
                      io.to('admin').emit('updateActivity', {
                        activity: activity
                      });

                    case 7:
                    case "end":
                      return _context10.stop();
                  }
                }
              }, _callee10);
            })));

          case 4:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function listenReactDrop(_x, _x2, _x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.listenReactDrop = listenReactDrop;

var discordReactDrop = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(discordClient, message, filteredMessage, io, groupTask, channelTask, setting, faucetSetting, queue) {
    var activity, useEmojis, user;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            if (!(!groupTask || !channelTask)) {
              _context15.next = 4;
              break;
            }

            _context15.next = 3;
            return message.channel.send({
              embeds: [(0, _discord2.NotInDirectMessage)(message, 'Reactdrop')]
            });

          case 3:
            return _context15.abrupt("return");

          case 4:
            activity = [];
            useEmojis = [];
            _context15.next = 8;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(t) {
                var failActivity, _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, textTime, cutLastTimeLetter, cutNumberTime, isnum, timeFailActivity, _timeFailActivity, allEmojis, failEmojiActivity, timeDay, timeHour, timeMinute, timeSecond, dateObj, countDownDate, now, distance, randomAmount, i, randomX, shuffeledEmojisArray, findGroup, wallet, sendReactDropMessage, group, channel, fee, newReactDrop, preActivity, finalActivity, reactMessage, _iterator3, _step3, shufEmoji, updateMessage;

                return _regenerator["default"].wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        _context13.next = 2;
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
                        user = _context13.sent;

                        if (user) {
                          _context13.next = 11;
                          break;
                        }

                        _context13.next = 6;
                        return _models["default"].activity.create({
                          type: 'reactdrop_f'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 6:
                        failActivity = _context13.sent;
                        activity.unshift(failActivity);
                        _context13.next = 10;
                        return message.channel.send({
                          embeds: [(0, _discord2.userNotFoundMessage)(message, 'ReactDrop')]
                        });

                      case 10:
                        return _context13.abrupt("return");

                      case 11:
                        _context13.next = 13;
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[2], user, setting, 'reactdrop');

                      case 13:
                        _yield$validateAmount = _context13.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context13.next = 20;
                          break;
                        }

                        activity = activityValiateAmount;
                        return _context13.abrupt("return");

                      case 20:
                        /// Reactdrop
                        // Convert Message time to MS
                        textTime = '5m';

                        if (filteredMessage[3]) {
                          // eslint-disable-next-line prefer-destructuring
                          textTime = filteredMessage[3];
                        } // const textTime = filteredMessage[3];


                        // const textTime = filteredMessage[3];
                        cutLastTimeLetter = textTime.substring(textTime.length - 1, textTime.length).toLowerCase();
                        cutNumberTime = textTime.substring(0, textTime.length - 1);
                        isnum = /^\d+$/.test(cutNumberTime);

                        if (!(!isnum // && Number(cutNumberTime) < 0
                        || cutLastTimeLetter !== 'd' && cutLastTimeLetter !== 'h' && cutLastTimeLetter !== 'm' && cutLastTimeLetter !== 's')) {
                          _context13.next = 34;
                          break;
                        }

                        _context13.next = 28;
                        return _models["default"].activity.create({
                          type: 'reactdrop_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 28:
                        timeFailActivity = _context13.sent;
                        activity.unshift(timeFailActivity);
                        _context13.next = 32;
                        return message.channel.send({
                          embeds: [(0, _discord2.invalidTimeMessage)(message, 'Reactdrop')]
                        });

                      case 32:
                        _context13.next = 141;
                        break;

                      case 34:
                        if (!(cutLastTimeLetter === 's' && Number(cutNumberTime) < 60)) {
                          _context13.next = 43;
                          break;
                        }

                        _context13.next = 37;
                        return _models["default"].activity.create({
                          type: 'reactdrop_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 37:
                        _timeFailActivity = _context13.sent;
                        activity.unshift(_timeFailActivity);
                        _context13.next = 41;
                        return message.channel.send({
                          embeds: [(0, _discord2.minimumTimeReactDropMessage)(message)]
                        });

                      case 41:
                        _context13.next = 141;
                        break;

                      case 43:
                        allEmojis = _emoji["default"];
                        _context13.next = 46;
                        return message.guild.emojis.cache.forEach(function (customEmoji) {
                          if (customEmoji.animated) {
                            allEmojis.push("<a:".concat(customEmoji.name, ":").concat(customEmoji.id, ">"));
                          } else {
                            allEmojis.push("<:".concat(customEmoji.name, ":").concat(customEmoji.id, ">"));
                          }
                        });

                      case 46:
                        if (!filteredMessage[4]) {
                          // eslint-disable-next-line no-param-reassign
                          filteredMessage[4] = _lodash["default"].sample(allEmojis);
                        }

                        console.log(filteredMessage[4]);

                        if (allEmojis.includes(filteredMessage[4])) {
                          _context13.next = 57;
                          break;
                        }

                        _context13.next = 51;
                        return _models["default"].activity.create({
                          type: 'reactdrop_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 51:
                        failEmojiActivity = _context13.sent;
                        activity.unshift(failEmojiActivity);
                        _context13.next = 55;
                        return message.channel.send({
                          embeds: [(0, _discord2.invalidEmojiMessage)(message, 'Reactdrop')]
                        });

                      case 55:
                        _context13.next = 141;
                        break;

                      case 57:
                        timeDay = Number(cutNumberTime) * 24 * 60 * 60 * 1000;
                        timeHour = Number(cutNumberTime) * 60 * 60 * 1000;
                        timeMinute = Number(cutNumberTime) * 60 * 1000;
                        timeSecond = Number(cutNumberTime) * 1000;

                        if (!(cutLastTimeLetter === 'd' && timeDay > 172800000 || cutLastTimeLetter === 'h' && timeHour > 172800000 || cutLastTimeLetter === 'm' && timeMinute > 172800000 || cutLastTimeLetter === 's' && timeSecond > 172800000)) {
                          _context13.next = 65;
                          break;
                        }

                        _context13.next = 64;
                        return message.channel.send({
                          embeds: [(0, _discord2.maxTimeReactdropMessage)(message)]
                        });

                      case 64:
                        return _context13.abrupt("return");

                      case 65:
                        _context13.next = 67;
                        return new Date().getTime();

                      case 67:
                        dateObj = _context13.sent;

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

                        _context13.next = 74;
                        return new Date(dateObj);

                      case 74:
                        dateObj = _context13.sent;
                        _context13.next = 77;
                        return dateObj.getTime();

                      case 77:
                        countDownDate = _context13.sent;
                        _context13.next = 80;
                        return new Date().getTime();

                      case 80:
                        now = _context13.sent;
                        distance = countDownDate - now;
                        randomAmount = Math.floor(Math.random() * 3) + 1;

                        for (i = 0; i < randomAmount; i += 1) {
                          randomX = Math.floor(Math.random() * allEmojis.length);
                          useEmojis.push(allEmojis[randomX]);
                        }

                        _context13.next = 86;
                        return useEmojis.push(filteredMessage[4]);

                      case 86:
                        _context13.next = 88;
                        return shuffle(useEmojis);

                      case 88:
                        shuffeledEmojisArray = _context13.sent;
                        _context13.next = 91;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "discord-".concat(message.guildId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 91:
                        findGroup = _context13.sent;

                        if (findGroup) {
                          _context13.next = 96;
                          break;
                        }

                        console.log('group not found');
                        _context13.next = 141;
                        break;

                      case 96:
                        _context13.next = 98;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 98:
                        wallet = _context13.sent;
                        _context13.next = 101;
                        return message.channel.send({
                          embeds: [(0, _discord2.reactDropMessage)(distance, message.author.id, filteredMessage[4], amount)]
                        });

                      case 101:
                        sendReactDropMessage = _context13.sent;
                        _context13.next = 104;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "discord-".concat(message.guildId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 104:
                        group = _context13.sent;
                        _context13.next = 107;
                        return _models["default"].channel.findOne({
                          where: {
                            channelId: "discord-".concat(message.channelId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 107:
                        channel = _context13.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        _context13.next = 111;
                        return _models["default"].reactdrop.create({
                          feeAmount: Number(fee),
                          amount: amount,
                          groupId: group.id,
                          channelId: channel.id,
                          ends: dateObj,
                          emoji: filteredMessage[4],
                          discordMessageId: sendReactDropMessage.id,
                          userId: user.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 111:
                        newReactDrop = _context13.sent;
                        _context13.next = 114;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'reactdrop_s',
                          spenderId: user.id,
                          reactdropId: newReactDrop.id,
                          spender_balance: wallet.available + wallet.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 114:
                        preActivity = _context13.sent;
                        _context13.next = 117;
                        return _models["default"].activity.findOne({
                          where: {
                            id: preActivity.id
                          },
                          include: [{
                            model: _models["default"].reactdrop,
                            as: 'reactdrop'
                          }, {
                            model: _models["default"].user,
                            as: 'spender'
                          }],
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 117:
                        finalActivity = _context13.sent;
                        activity.unshift(finalActivity);
                        _context13.next = 121;
                        return discordClient.guilds.cache.get(sendReactDropMessage.guildId).channels.cache.get(sendReactDropMessage.channelId).messages.fetch(sendReactDropMessage.id);

                      case 121:
                        reactMessage = _context13.sent;
                        listenReactDrop(reactMessage, distance, newReactDrop, io, queue); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator3 = _createForOfIteratorHelper(shuffeledEmojisArray);
                        _context13.prev = 124;

                        _iterator3.s();

                      case 126:
                        if ((_step3 = _iterator3.n()).done) {
                          _context13.next = 132;
                          break;
                        }

                        shufEmoji = _step3.value;
                        _context13.next = 130;
                        return reactMessage.react(shufEmoji);

                      case 130:
                        _context13.next = 126;
                        break;

                      case 132:
                        _context13.next = 137;
                        break;

                      case 134:
                        _context13.prev = 134;
                        _context13.t0 = _context13["catch"](124);

                        _iterator3.e(_context13.t0);

                      case 137:
                        _context13.prev = 137;

                        _iterator3.f();

                        return _context13.finish(137);

                      case 140:
                        updateMessage = setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
                          return _regenerator["default"].wrap(function _callee12$(_context12) {
                            while (1) {
                              switch (_context12.prev = _context12.next) {
                                case 0:
                                  now = new Date().getTime();
                                  console.log('listen');
                                  distance = countDownDate - now;
                                  _context12.next = 5;
                                  return reactMessage.edit({
                                    embeds: [(0, _discord2.reactDropMessage)(distance, message.author.id, filteredMessage[4], amount)]
                                  });

                                case 5:
                                  if (distance < 0) {
                                    clearInterval(updateMessage);
                                  }

                                case 6:
                                case "end":
                                  return _context12.stop();
                              }
                            }
                          }, _callee12);
                        })), 10000);

                      case 141:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 142:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13, null, [[124, 134, 137, 140]]);
              }));

              return function (_x25) {
                return _ref14.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(err) {
                return _regenerator["default"].wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        _context14.prev = 0;
                        _context14.next = 3;
                        return _models["default"].error.create({
                          type: 'reactDrop',
                          error: "".concat(err)
                        });

                      case 3:
                        _context14.next = 8;
                        break;

                      case 5:
                        _context14.prev = 5;
                        _context14.t0 = _context14["catch"](0);

                        _logger["default"].error("Error Discord: ".concat(_context14.t0));

                      case 8:
                        console.log(err);
                        console.log(useEmojis);

                        _logger["default"].error("reactdrop error: ".concat(err, "\nEmojis used: ").concat(useEmojis));

                        _context14.next = 13;
                        return message.channel.send({
                          embeds: [(0, _discord2.discordErrorMessage)("ReactDrop")]
                        });

                      case 13:
                      case "end":
                        return _context14.stop();
                    }
                  }
                }, _callee14, null, [[0, 5]]);
              }));

              return function (_x26) {
                return _ref16.apply(this, arguments);
              };
            }());

          case 8:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 9:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function discordReactDrop(_x16, _x17, _x18, _x19, _x20, _x21, _x22, _x23, _x24) {
    return _ref13.apply(this, arguments);
  };
}();

exports.discordReactDrop = discordReactDrop;