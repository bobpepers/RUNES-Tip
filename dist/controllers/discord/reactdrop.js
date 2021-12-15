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

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var settings = (0, _settings["default"])();

function shuffle(array) {
  var currentIndex = array.length;
  var randomIndex; // While there remain elements to shuffle...

  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--; // And swap it with the current element.

    var _ref = [array[randomIndex], array[currentIndex]];
    array[currentIndex] = _ref[0];
    array[randomIndex] = _ref[1];
  }

  return array;
}

var listenReactDrop = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(reactMessage, distance, reactDrop, io) {
    var filter, collector;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            filter = function filter() {
              return true;
            };

            collector = reactMessage.createReactionCollector({
              filter: filter,
              time: distance
            });
            collector.on('collect', /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(reaction, collector) {
                var findReactUser, findReactTip, captcha, captchaPng, _findReactTip, backgroundArray, captchaTypeArray, randomFunc, randomBackground, modes, preCaptcha, constructEmoji, captchaPngFixed, awaitCaptchaMessage, Ccollector;

                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        if (collector.bot) {
                          _context5.next = 53;
                          break;
                        }

                        _context5.next = 3;
                        return _models["default"].user.findOne({
                          where: {
                            user_id: "discord-".concat(collector.id)
                          }
                        });

                      case 3:
                        findReactUser = _context5.sent;
                        _context5.next = 6;
                        return _models["default"].reactdroptip.findOne({
                          where: {
                            userId: findReactUser.id,
                            reactdropId: reactDrop.id
                          }
                        });

                      case 6:
                        findReactTip = _context5.sent;

                        if (findReactTip) {
                          _context5.next = 53;
                          break;
                        }

                        backgroundArray = ['#cc9966', '#ffffff', "#FF5733", "#33FFE6", "#272F92 ", "#882792", "#922759"];
                        captchaTypeArray = ['svg', 'algebraic'];
                        randomFunc = captchaTypeArray[Math.floor(Math.random() * captchaTypeArray.length)];
                        randomBackground = backgroundArray[Math.floor(Math.random() * backgroundArray.length)];

                        if (!(randomFunc === 'svg')) {
                          _context5.next = 21;
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
                        _context5.next = 17;
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
                        captchaPng = _context5.sent;
                        _context5.next = 20;
                        return _models["default"].reactdroptip.create({
                          status: 'waiting',
                          captchaType: 'svg',
                          solution: captcha.text,
                          userId: findReactUser.id,
                          reactdropId: reactDrop.id
                        });

                      case 20:
                        _findReactTip = _context5.sent;

                      case 21:
                        if (!(randomFunc === 'algebraic')) {
                          _context5.next = 37;
                          break;
                        }

                        modes = ['formula', 'equation'];

                      case 23:
                        if (!(!captcha || Number(captcha.answer) < 0)) {
                          _context5.next = 30;
                          break;
                        }

                        preCaptcha = new _algebraicCaptcha.AlgebraicCaptcha({
                          width: 150,
                          height: 50,
                          background: randomBackground,
                          noise: Math.floor(Math.random() * (8 - 4 + 1)) + 4,
                          minValue: 1,
                          maxValue: 20,
                          operandAmount: Math.floor(Math.random() * 2 + 1),
                          operandTypes: ['+', '-'],
                          mode: modes[Math.round(Math.random())],
                          targetSymbol: '?'
                        }); // eslint-disable-next-line no-await-in-loop

                        _context5.next = 27;
                        return preCaptcha.generateCaptcha();

                      case 27:
                        captcha = _context5.sent;
                        _context5.next = 23;
                        break;

                      case 30:
                        console.log(captcha);
                        _context5.next = 33;
                        return (0, _svgPngConverter.svg2png)({
                          input: "".concat(captcha.image).trim(),
                          encoding: 'dataURL',
                          format: 'png',
                          width: 150,
                          height: 50,
                          multiplier: 3,
                          quality: 1
                        });

                      case 33:
                        captchaPng = _context5.sent;
                        _context5.next = 36;
                        return _models["default"].reactdroptip.create({
                          status: 'waiting',
                          captchaType: 'algebraic',
                          solution: captcha.answer.toString(),
                          userId: findReactUser.id,
                          reactdropId: reactDrop.id
                        });

                      case 36:
                        _findReactTip = _context5.sent;

                      case 37:
                        // eslint-disable-next-line no-underscore-dangle
                        constructEmoji = reaction._emoji.id ? "<:".concat(reaction._emoji.name, ":").concat(reaction._emoji.id, ">") : reaction._emoji.name;

                        if (!(reactDrop.emoji !== constructEmoji)) {
                          _context5.next = 44;
                          break;
                        }

                        collector.send('Failed, pressed wrong emoji');
                        _context5.next = 42;
                        return _findReactTip.update({
                          status: 'failed'
                        });

                      case 42:
                        _context5.next = 53;
                        break;

                      case 44:
                        captchaPngFixed = captchaPng.replace('data:image/png;base64,', '');
                        _context5.next = 47;
                        return collector.send({
                          embeds: [(0, _discord2.ReactdropCaptchaMessage)(collector.id)],
                          files: [new _discord.MessageAttachment(Buffer.from(captchaPngFixed, 'base64'), 'captcha.png')]
                        });

                      case 47:
                        awaitCaptchaMessage = _context5.sent;
                        _context5.next = 50;
                        return awaitCaptchaMessage.channel.createMessageCollector({
                          filter: filter,
                          time: 60000,
                          max: 1
                        });

                      case 50:
                        Ccollector = _context5.sent;
                        Ccollector.on('collect', /*#__PURE__*/function () {
                          var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(m) {
                            return _regenerator["default"].wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    _context2.next = 2;
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
                                                _context.next = 22;
                                                break;

                                              case 13:
                                                _context.next = 15;
                                                return _findReactTip.update({
                                                  status: 'failed'
                                                }, {
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 15:
                                                _context.next = 17;
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

                                              case 17:
                                                _reactDropRecord = _context.sent;
                                                _row = new _discord.MessageActionRow().addComponents(new _discord.MessageButton().setLabel('Back to ReactDrop').setStyle('LINK').setURL("https://discord.com/channels/".concat(_reactDropRecord.group.groupId.replace("discord-", ""), "/").concat(_reactDropRecord.channel.channelId.replace("discord-", ""), "/").concat(_reactDropRecord.discordMessageId)));
                                                m.react('❌');
                                                _context.next = 22;
                                                return collector.send({
                                                  content: "\u200B",
                                                  components: [_row]
                                                });

                                              case 22:
                                                t.afterCommit(function () {
                                                  console.log('done');
                                                });

                                              case 23:
                                              case "end":
                                                return _context.stop();
                                            }
                                          }
                                        }, _callee);
                                      }));

                                      return function (_x8) {
                                        return _ref5.apply(this, arguments);
                                      };
                                    }())["catch"](function (err) {
                                      console.log('failed');
                                    });

                                  case 2:
                                  case "end":
                                    return _context2.stop();
                                }
                              }
                            }, _callee2);
                          }));

                          return function (_x7) {
                            return _ref4.apply(this, arguments);
                          };
                        }());
                        Ccollector.on('end', /*#__PURE__*/function () {
                          var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(collected) {
                            return _regenerator["default"].wrap(function _callee4$(_context4) {
                              while (1) {
                                switch (_context4.prev = _context4.next) {
                                  case 0:
                                    _context4.next = 2;
                                    return _models["default"].sequelize.transaction({
                                      isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                    }, /*#__PURE__*/function () {
                                      var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(t) {
                                        var findReactUserTwo, findReactTipTwo;
                                        return _regenerator["default"].wrap(function _callee3$(_context3) {
                                          while (1) {
                                            switch (_context3.prev = _context3.next) {
                                              case 0:
                                                _context3.next = 2;
                                                return _models["default"].user.findOne({
                                                  where: {
                                                    user_id: "discord-".concat(collector.id)
                                                  },
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 2:
                                                findReactUserTwo = _context3.sent;
                                                _context3.next = 5;
                                                return _models["default"].reactdroptip.findOne({
                                                  where: {
                                                    userId: findReactUserTwo.id,
                                                    reactdropId: reactDrop.id
                                                  },
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 5:
                                                findReactTipTwo = _context3.sent;

                                                if (!(findReactTipTwo.status === 'waiting')) {
                                                  _context3.next = 10;
                                                  break;
                                                }

                                                _context3.next = 9;
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
                                                  console.log('done'); // collector.send('Out of time');
                                                });

                                              case 11:
                                              case "end":
                                                return _context3.stop();
                                            }
                                          }
                                        }, _callee3);
                                      }));

                                      return function (_x10) {
                                        return _ref7.apply(this, arguments);
                                      };
                                    }())["catch"](function (err) {
                                      console.log(err);
                                      collector.send('Something went wrong');
                                    });

                                  case 2:
                                  case "end":
                                    return _context4.stop();
                                }
                              }
                            }, _callee4);
                          }));

                          return function (_x9) {
                            return _ref6.apply(this, arguments);
                          };
                        }());

                      case 53:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x5, _x6) {
                return _ref3.apply(this, arguments);
              };
            }());
            collector.on('end', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
              return _regenerator["default"].wrap(function _callee7$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      _context7.next = 2;
                      return _models["default"].sequelize.transaction({
                        isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                      }, /*#__PURE__*/function () {
                        var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(t) {
                          var endReactDrop, returnWallet, updatedWallet, amountEach, listOfUsersRained, _iterator, _step, receiver, earnerWallet, userIdReceivedRain, tipActivity, newStringListUsers, cutStringListUsers, _iterator2, _step2, element, initiator;

                          return _regenerator["default"].wrap(function _callee6$(_context6) {
                            while (1) {
                              switch (_context6.prev = _context6.next) {
                                case 0:
                                  _context6.next = 2;
                                  return _models["default"].reactdrop.findOne({
                                    where: {
                                      id: reactDrop.id
                                    },
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
                                  endReactDrop = _context6.sent;

                                  if (!endReactDrop) {
                                    _context6.next = 71;
                                    break;
                                  }

                                  if (!(endReactDrop.reactdroptips.length <= 0)) {
                                    _context6.next = 16;
                                    break;
                                  }

                                  _context6.next = 7;
                                  return _models["default"].wallet.findOne({
                                    where: {
                                      userId: endReactDrop.userId
                                    }
                                  });

                                case 7:
                                  returnWallet = _context6.sent;
                                  _context6.next = 10;
                                  return returnWallet.update({
                                    available: returnWallet.available + endReactDrop.amount
                                  });

                                case 10:
                                  updatedWallet = _context6.sent;
                                  _context6.next = 13;
                                  return endReactDrop.update({
                                    ended: true
                                  });

                                case 13:
                                  reactMessage.channel.send('Nobody claimed, returning funds to reactdrop initiator');
                                  _context6.next = 71;
                                  break;

                                case 16:
                                  amountEach = ((Number(endReactDrop.amount) - Number(endReactDrop.feeAmount)) / Number(endReactDrop.reactdroptips.length)).toFixed(0);
                                  console.log("amountEach");
                                  console.log(amountEach);
                                  _context6.next = 21;
                                  return endReactDrop.update({
                                    ended: true,
                                    userCount: Number(endReactDrop.reactdroptips.length)
                                  });

                                case 21:
                                  listOfUsersRained = []; // eslint-disable-next-line no-restricted-syntax

                                  // eslint-disable-next-line no-restricted-syntax
                                  _iterator = _createForOfIteratorHelper(endReactDrop.reactdroptips);
                                  _context6.prev = 23;

                                  _iterator.s();

                                case 25:
                                  if ((_step = _iterator.n()).done) {
                                    _context6.next = 42;
                                    break;
                                  }

                                  receiver = _step.value;
                                  _context6.next = 29;
                                  return receiver.user.wallet.update({
                                    available: receiver.user.wallet.available + Number(amountEach)
                                  });

                                case 29:
                                  earnerWallet = _context6.sent;

                                  if (receiver.user.ignoreMe) {
                                    listOfUsersRained.push("".concat(receiver.user.username));
                                  } else {
                                    userIdReceivedRain = receiver.user.user_id.replace('discord-', '');
                                    listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                                  }

                                  tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                                  _context6.next = 34;
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

                                case 34:
                                  tipActivity = _context6.sent;
                                  _context6.next = 37;
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

                                case 37:
                                  tipActivity = _context6.sent;
                                  console.log(tipActivity);
                                  io.to('admin').emit('updateActivity', {
                                    activity: tipActivity
                                  });

                                case 40:
                                  _context6.next = 25;
                                  break;

                                case 42:
                                  _context6.next = 47;
                                  break;

                                case 44:
                                  _context6.prev = 44;
                                  _context6.t0 = _context6["catch"](23);

                                  _iterator.e(_context6.t0);

                                case 47:
                                  _context6.prev = 47;

                                  _iterator.f();

                                  return _context6.finish(47);

                                case 50:
                                  newStringListUsers = listOfUsersRained.join(", "); // console.log(newStringListUsers);

                                  // console.log(newStringListUsers);
                                  cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                                  // eslint-disable-next-line no-restricted-syntax
                                  _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                                  _context6.prev = 53;

                                  _iterator2.s();

                                case 55:
                                  if ((_step2 = _iterator2.n()).done) {
                                    _context6.next = 61;
                                    break;
                                  }

                                  element = _step2.value;
                                  _context6.next = 59;
                                  return reactMessage.channel.send(element);

                                case 59:
                                  _context6.next = 55;
                                  break;

                                case 61:
                                  _context6.next = 66;
                                  break;

                                case 63:
                                  _context6.prev = 63;
                                  _context6.t1 = _context6["catch"](53);

                                  _iterator2.e(_context6.t1);

                                case 66:
                                  _context6.prev = 66;

                                  _iterator2.f();

                                  return _context6.finish(66);

                                case 69:
                                  initiator = endReactDrop.user.user_id.replace('discord-', '');
                                  reactMessage.channel.send({
                                    embeds: [(0, _discord2.AfterReactDropSuccessMessage)(endReactDrop, amountEach, initiator)]
                                  }); // reactMessage.channel.send(`${endReactDrop.reactdroptips.length} user(s) will share ${endReactDrop.amount / 1e8} ${process.env.CURRENCY_SYMBOL} (${amountEach / 1e8} each)`);

                                case 71:
                                  t.afterCommit(function () {
                                    console.log('done');
                                  });

                                case 72:
                                case "end":
                                  return _context6.stop();
                              }
                            }
                          }, _callee6, null, [[23, 44, 47, 50], [53, 63, 66, 69]]);
                        }));

                        return function (_x11) {
                          return _ref9.apply(this, arguments);
                        };
                      }())["catch"](function (err) {
                        console.log('error');
                      });

                    case 2:
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
  }));

  return function listenReactDrop(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.listenReactDrop = listenReactDrop;

var discordReactDrop = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(discordClient, message, filteredMessage, io, groupTask, channelTask, setting) {
    var activity, user;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(t) {
                var _yield$validateAmount, _yield$validateAmount2, activityValiateAmount, amount, textTime, cutLastTimeLetter, cutNumberTime, isnum, allEmojis, timeDay, timeHour, timeMinute, timeSecond, dateObj, countDownDate, now, distance, randomAmount, useEmojis, i, randomX, shuffeledEmojisArray, findGroup, wallet, sendReactDropMessage, group, channel, fee, newReactDrop, reactMessage, _iterator3, _step3, shufEmoji, updateMessage;

                return _regenerator["default"].wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        _context10.next = 2;
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
                        user = _context10.sent;

                        if (user) {
                          _context10.next = 10;
                          break;
                        }

                        _context10.next = 6;
                        return _models["default"].activity.create({
                          type: 'reactdrop_f'
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 6:
                        activity = _context10.sent;
                        _context10.next = 9;
                        return message.channel.send({
                          embeds: [(0, _discord2.userNotFoundMessage)(message, 'ReactDrop')]
                        });

                      case 9:
                        return _context10.abrupt("return");

                      case 10:
                        _context10.next = 12;
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[2], user, setting, 'reactdrop');

                      case 12:
                        _yield$validateAmount = _context10.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 2);
                        activityValiateAmount = _yield$validateAmount2[0];
                        amount = _yield$validateAmount2[1];

                        if (!activityValiateAmount) {
                          _context10.next = 19;
                          break;
                        }

                        activity = activityValiateAmount;
                        return _context10.abrupt("return");

                      case 19:
                        /// Reactdrop
                        // Convert Message time to MS
                        textTime = '5m';

                        if (filteredMessage[3]) {
                          textTime = filteredMessage[3];
                        } // const textTime = filteredMessage[3];


                        // const textTime = filteredMessage[3];
                        cutLastTimeLetter = textTime.substring(textTime.length - 1, textTime.length).toLowerCase();
                        cutNumberTime = textTime.substring(0, textTime.length - 1);
                        isnum = /^\d+$/.test(cutNumberTime);

                        if (!(!isnum // && Number(cutNumberTime) < 0
                        || cutLastTimeLetter !== 'd' && cutLastTimeLetter !== 'h' && cutLastTimeLetter !== 'm' && cutLastTimeLetter !== 's')) {
                          _context10.next = 32;
                          break;
                        }

                        _context10.next = 27;
                        return _models["default"].activity.create({
                          type: 'reactdrop_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 27:
                        activity = _context10.sent;
                        _context10.next = 30;
                        return message.channel.send({
                          embeds: [(0, _discord2.invalidTimeMessage)(message, 'Reactdrop')]
                        });

                      case 30:
                        _context10.next = 140;
                        break;

                      case 32:
                        if (!(cutLastTimeLetter === 's' && Number(cutNumberTime) < 60)) {
                          _context10.next = 40;
                          break;
                        }

                        _context10.next = 35;
                        return _models["default"].activity.create({
                          type: 'reactdrop_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 35:
                        activity = _context10.sent;
                        _context10.next = 38;
                        return message.channel.send({
                          embeds: [(0, _discord2.minimumTimeReactDropMessage)(message)]
                        });

                      case 38:
                        _context10.next = 140;
                        break;

                      case 40:
                        allEmojis = _emoji["default"];
                        _context10.next = 43;
                        return message.guild.emojis.cache.forEach(function (customEmoji) {
                          allEmojis.push("<:".concat(customEmoji.name, ":").concat(customEmoji.id, ">"));
                        });

                      case 43:
                        if (!filteredMessage[4]) {
                          filteredMessage[4] = '❤️';
                        }

                        if (allEmojis.includes(filteredMessage[4])) {
                          _context10.next = 52;
                          break;
                        }

                        _context10.next = 47;
                        return _models["default"].activity.create({
                          type: 'reactdrop_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 47:
                        activity = _context10.sent;
                        _context10.next = 50;
                        return message.channel.send({
                          embeds: [(0, _discord2.invalidEmojiMessage)(message, 'Reactdrop')]
                        });

                      case 50:
                        _context10.next = 140;
                        break;

                      case 52:
                        timeDay = Number(cutNumberTime) * 24 * 60 * 60 * 1000;
                        timeHour = Number(cutNumberTime) * 60 * 60 * 1000;
                        timeMinute = Number(cutNumberTime) * 60 * 1000;
                        timeSecond = Number(cutNumberTime) * 1000;

                        if (!(cutLastTimeLetter === 'd' && timeDay > 172800000 || cutLastTimeLetter === 'h' && timeHour > 172800000 || cutLastTimeLetter === 'm' && timeMinute > 172800000 || cutLastTimeLetter === 's' && timeSecond > 172800000)) {
                          _context10.next = 60;
                          break;
                        }

                        _context10.next = 59;
                        return message.channel.send({
                          embeds: [(0, _discord2.maxTimeReactdropMessage)(message)]
                        });

                      case 59:
                        return _context10.abrupt("return");

                      case 60:
                        _context10.next = 62;
                        return new Date().getTime();

                      case 62:
                        dateObj = _context10.sent;

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

                        _context10.next = 69;
                        return new Date(dateObj);

                      case 69:
                        dateObj = _context10.sent;
                        _context10.next = 72;
                        return dateObj.getTime();

                      case 72:
                        countDownDate = _context10.sent;
                        _context10.next = 75;
                        return new Date().getTime();

                      case 75:
                        now = _context10.sent;
                        distance = countDownDate - now;
                        randomAmount = Math.floor(Math.random() * 3) + 1;
                        useEmojis = [];

                        for (i = 0; i < randomAmount; i++) {
                          randomX = Math.floor(Math.random() * allEmojis.length);
                          useEmojis.push(allEmojis[randomX]);
                        }

                        _context10.next = 82;
                        return useEmojis.push(filteredMessage[4]);

                      case 82:
                        _context10.next = 84;
                        return shuffle(useEmojis);

                      case 84:
                        shuffeledEmojisArray = _context10.sent;
                        console.log(shuffeledEmojisArray);
                        _context10.next = 88;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "discord-".concat(message.guildId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 88:
                        findGroup = _context10.sent;

                        if (findGroup) {
                          _context10.next = 93;
                          break;
                        }

                        console.log('group not found');
                        _context10.next = 140;
                        break;

                      case 93:
                        _context10.next = 95;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 95:
                        wallet = _context10.sent;
                        console.log(distance);
                        console.log('distance');
                        _context10.next = 100;
                        return message.channel.send({
                          embeds: [(0, _discord2.reactDropMessage)(distance, message.author.id, filteredMessage[4], amount)]
                        });

                      case 100:
                        sendReactDropMessage = _context10.sent;
                        _context10.next = 103;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "discord-".concat(message.guildId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 103:
                        group = _context10.sent;
                        _context10.next = 106;
                        return _models["default"].channel.findOne({
                          where: {
                            channelId: "discord-".concat(message.channelId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 106:
                        channel = _context10.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        _context10.next = 110;
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

                      case 110:
                        newReactDrop = _context10.sent;
                        _context10.next = 113;
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

                      case 113:
                        activity = _context10.sent;
                        _context10.next = 116;
                        return _models["default"].activity.findOne({
                          where: {
                            id: activity.id
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

                      case 116:
                        activity = _context10.sent;
                        _context10.next = 119;
                        return discordClient.guilds.cache.get(sendReactDropMessage.guildId).channels.cache.get(sendReactDropMessage.channelId).messages.fetch(sendReactDropMessage.id);

                      case 119:
                        reactMessage = _context10.sent;
                        listenReactDrop(reactMessage, distance, newReactDrop, io); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator3 = _createForOfIteratorHelper(shuffeledEmojisArray);
                        _context10.prev = 122;

                        _iterator3.s();

                      case 124:
                        if ((_step3 = _iterator3.n()).done) {
                          _context10.next = 130;
                          break;
                        }

                        shufEmoji = _step3.value;
                        _context10.next = 128;
                        return reactMessage.react(shufEmoji);

                      case 128:
                        _context10.next = 124;
                        break;

                      case 130:
                        _context10.next = 135;
                        break;

                      case 132:
                        _context10.prev = 132;
                        _context10.t0 = _context10["catch"](122);

                        _iterator3.e(_context10.t0);

                      case 135:
                        _context10.prev = 135;

                        _iterator3.f();

                        return _context10.finish(135);

                      case 138:
                        updateMessage = setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
                          return _regenerator["default"].wrap(function _callee9$(_context9) {
                            while (1) {
                              switch (_context9.prev = _context9.next) {
                                case 0:
                                  now = new Date().getTime();
                                  console.log('listen');
                                  distance = countDownDate - now;
                                  _context9.next = 5;
                                  return reactMessage.edit({
                                    embeds: [(0, _discord2.reactDropMessage)(distance, message.author.id, filteredMessage[4], amount)]
                                  });

                                case 5:
                                  if (distance < 0) {
                                    clearInterval(updateMessage);
                                  }

                                case 6:
                                case "end":
                                  return _context9.stop();
                              }
                            }
                          }, _callee9);
                        })), 5000);

                        _logger["default"].info("Success started reactdrop Requested by: ".concat(user.user_id, "-").concat(user.username, " with ").concat(amount / 1e8, " ").concat(settings.coin.ticker));

                      case 140:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 141:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10, null, [[122, 132, 135, 138]]);
              }));

              return function (_x19) {
                return _ref11.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err);
              message.channel.send("Something went wrong.");
            });

          case 2:
            io.to('admin').emit('updateActivity', {
              activity: activity
            });

          case 3:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function discordReactDrop(_x12, _x13, _x14, _x15, _x16, _x17, _x18) {
    return _ref10.apply(this, arguments);
  };
}();

exports.discordReactDrop = discordReactDrop;