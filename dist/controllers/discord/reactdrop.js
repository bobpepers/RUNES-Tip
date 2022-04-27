"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listenReactDrop = exports.discordReactDrop = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = require("sequelize");

var _discord = require("discord.js");

var _discord2 = require("../../messages/discord");

var _models = _interopRequireDefault(require("../../models"));

var _emoji = _interopRequireDefault(require("../../config/emoji"));

var _logger = _interopRequireDefault(require("../../helpers/logger"));

var _generateCaptcha = require("../../helpers/generateCaptcha");

var _waterFaucet = require("../../helpers/waterFaucet");

var _validateAmount = require("../../helpers/client/discord/validateAmount");

var _userWalletExist = require("../../helpers/client/discord/userWalletExist");

var _settings = require("../settings");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var listenReactDrop = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(reactMessage, distance, reactDrop, io, queue) {
    var filter, collector;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            filter = function filter() {
              return true;
            };

            collector = reactMessage.createReactionCollector({
              filter: filter,
              time: distance
            });
            collector.on('collect', /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(reaction, collector) {
                var findReactUser, findReactTip, _yield$generateCaptch, _yield$generateCaptch2, captchaImage, captchaText, captchaType, constructEmoji, captchaPngFixed, awaitCaptchaMessage, Ccollector;

                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        if (collector.bot) {
                          _context7.next = 39;
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

                        if (!findReactUser) {
                          _context7.next = 39;
                          break;
                        }

                        _context7.next = 7;
                        return _models["default"].reactdroptip.findOne({
                          where: {
                            userId: findReactUser.id,
                            reactdropId: reactDrop.id
                          }
                        });

                      case 7:
                        findReactTip = _context7.sent;

                        if (findReactTip) {
                          _context7.next = 39;
                          break;
                        }

                        _context7.next = 11;
                        return (0, _generateCaptcha.generateCaptcha)();

                      case 11:
                        _yield$generateCaptch = _context7.sent;
                        _yield$generateCaptch2 = (0, _slicedToArray2["default"])(_yield$generateCaptch, 3);
                        captchaImage = _yield$generateCaptch2[0];
                        captchaText = _yield$generateCaptch2[1];
                        captchaType = _yield$generateCaptch2[2];
                        _context7.next = 18;
                        return _models["default"].reactdroptip.create({
                          status: 'waiting',
                          captchaType: captchaType,
                          solution: captchaText,
                          userId: findReactUser.id,
                          reactdropId: reactDrop.id
                        });

                      case 18:
                        findReactTip = _context7.sent;

                        if (reaction._emoji && reaction._emoji.animated) {
                          constructEmoji = reaction._emoji.id ? "<a:".concat(reaction._emoji.name, ":").concat(reaction._emoji.id, ">") : reaction._emoji.name;
                        } else if (reaction._emoji && !reaction._emoji.animated) {
                          constructEmoji = reaction._emoji.id ? "<:".concat(reaction._emoji.name, ":").concat(reaction._emoji.id, ">") : reaction._emoji.name;
                        }

                        if (!(reactDrop.emoji !== constructEmoji)) {
                          _context7.next = 27;
                          break;
                        }

                        _context7.next = 23;
                        return collector.send('Failed, pressed wrong emoji')["catch"](function (e) {
                          console.log('failed to send wrong emoji warning');
                          console.log(e);
                        });

                      case 23:
                        _context7.next = 25;
                        return findReactTip.update({
                          status: 'failed'
                        });

                      case 25:
                        _context7.next = 39;
                        break;

                      case 27:
                        // const captchaPngFixed = captchaImage.toString('base64');
                        // const captchaPngFixed = captchaImage.toString('base64').replace('data:image/png;base64,', '');
                        captchaPngFixed = captchaImage;
                        _context7.next = 30;
                        return collector.send({
                          embeds: [(0, _discord2.ReactdropCaptchaMessage)(collector.id)],
                          // files: [new MessageAttachment(Buffer.from(captchaPngFixed, 'base64'), 'captcha.png')],
                          files: [new _discord.MessageAttachment(captchaPngFixed, 'captcha.png')]
                        })["catch"](function (e) {
                          console.log('failed to send captcha');
                          console.log(e);
                        });

                      case 30:
                        awaitCaptchaMessage = _context7.sent;

                        if (!awaitCaptchaMessage) {
                          _context7.next = 39;
                          break;
                        }

                        _context7.next = 34;
                        return awaitCaptchaMessage.channel.createMessageCollector({
                          filter: filter,
                          time: 60000,
                          max: 1
                        });

                      case 34:
                        Ccollector = _context7.sent;
                        _context7.next = 37;
                        return Ccollector.on('collect', /*#__PURE__*/function () {
                          var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(m) {
                            return _regenerator["default"].wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    _context3.next = 2;
                                    return _models["default"].sequelize.transaction({
                                      isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                    }, /*#__PURE__*/function () {
                                      var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                                        var reactDropRecord, backToReactDropButton, _reactDropRecord, row;

                                        return _regenerator["default"].wrap(function _callee$(_context) {
                                          while (1) {
                                            switch (_context.prev = _context.next) {
                                              case 0:
                                                if (!(m.content === findReactTip.solution)) {
                                                  _context.next = 13;
                                                  break;
                                                }

                                                _context.next = 3;
                                                return findReactTip.update({
                                                  status: 'success'
                                                }, {
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 3:
                                                _context.next = 5;
                                                return _models["default"].reactdrop.findOne({
                                                  where: {
                                                    id: findReactTip.reactdropId
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
                                                backToReactDropButton = new _discord.MessageActionRow().addComponents(new _discord.MessageButton().setLabel('Back to ReactDrop').setStyle('LINK').setURL("https://discord.com/channels/".concat(reactDropRecord.group.groupId.replace("discord-", ""), "/").concat(reactDropRecord.channel.channelId.replace("discord-", ""), "/").concat(reactDropRecord.messageId)));
                                                _context.next = 9;
                                                return m.react('✅');

                                              case 9:
                                                _context.next = 11;
                                                return collector.send({
                                                  content: "\u200B",
                                                  components: [backToReactDropButton]
                                                });

                                              case 11:
                                                _context.next = 24;
                                                break;

                                              case 13:
                                                if (!(m.content !== findReactTip.solution)) {
                                                  _context.next = 24;
                                                  break;
                                                }

                                                _context.next = 16;
                                                return findReactTip.update({
                                                  status: 'failed'
                                                }, {
                                                  lock: t.LOCK.UPDATE,
                                                  transaction: t
                                                });

                                              case 16:
                                                _context.next = 18;
                                                return _models["default"].reactdrop.findOne({
                                                  where: {
                                                    id: findReactTip.reactdropId
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
                                                row = new _discord.MessageActionRow().addComponents(new _discord.MessageButton().setLabel('Back to ReactDrop').setStyle('LINK').setURL("https://discord.com/channels/".concat(_reactDropRecord.group.groupId.replace("discord-", ""), "/").concat(_reactDropRecord.channel.channelId.replace("discord-", ""), "/").concat(_reactDropRecord.messageId)));
                                                _context.next = 22;
                                                return m.react('❌');

                                              case 22:
                                                _context.next = 24;
                                                return collector.send({
                                                  content: "Failed\nSolution: **".concat(findReactTip.solution, "**"),
                                                  components: [row]
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
                                        return _ref5.apply(this, arguments);
                                      };
                                    }());

                                  case 2:
                                  case "end":
                                    return _context3.stop();
                                }
                              }
                            }, _callee3);
                          }));

                          return function (_x8) {
                            return _ref3.apply(this, arguments);
                          };
                        }());

                      case 37:
                        _context7.next = 39;
                        return Ccollector.on('end', /*#__PURE__*/function () {
                          var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(collected) {
                            return _regenerator["default"].wrap(function _callee6$(_context6) {
                              while (1) {
                                switch (_context6.prev = _context6.next) {
                                  case 0:
                                    _context6.next = 2;
                                    return new Promise(function (r) {
                                      return setTimeout(r, 200);
                                    });

                                  case 2:
                                    _context6.next = 4;
                                    return _models["default"].sequelize.transaction({
                                      isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
                                    }, /*#__PURE__*/function () {
                                      var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(t) {
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
                                        return _ref7.apply(this, arguments);
                                      };
                                    }())["catch"]( /*#__PURE__*/function () {
                                      var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(err) {
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
                                                return collector.send('Something went wrong')["catch"](function (e) {
                                                  console.log(e);
                                                });

                                              case 11:
                                              case "end":
                                                return _context5.stop();
                                            }
                                          }
                                        }, _callee5, null, [[0, 5]]);
                                      }));

                                      return function (_x13) {
                                        return _ref8.apply(this, arguments);
                                      };
                                    }());

                                  case 4:
                                  case "end":
                                    return _context6.stop();
                                }
                              }
                            }, _callee6);
                          }));

                          return function (_x11) {
                            return _ref6.apply(this, arguments);
                          };
                        }());

                      case 39:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x6, _x7) {
                return _ref2.apply(this, arguments);
              };
            }());
            collector.on('end', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
              return _regenerator["default"].wrap(function _callee11$(_context11) {
                while (1) {
                  switch (_context11.prev = _context11.next) {
                    case 0:
                      _context11.next = 2;
                      return queue.add( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
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
                                    var endReactDrop, returnWallet, updatedWallet, faucetSetting, faucetWatered, amountEach, listOfUsersRained, withoutBotsSorted, _iterator, _step, receiver, updateReactDropTipAmount, earnerWallet, userIdReceivedRain, tipActivity, newStringListUsers, cutStringListUsers, _iterator2, _step2, element, initiator;

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
                                              _context8.next = 82;
                                              break;
                                            }

                                            if (!(endReactDrop.reactdroptips.length <= 0)) {
                                              _context8.next = 17;
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
                                            _context8.next = 15;
                                            return reactMessage.channel.send({
                                              embeds: [(0, _discord2.ReactDropReturnInitiatorMessage)()]
                                            });

                                          case 15:
                                            _context8.next = 82;
                                            break;

                                          case 17:
                                            _context8.next = 19;
                                            return (0, _settings.waterFaucetSettings)(endReactDrop.group.id, endReactDrop.channel.id, t);

                                          case 19:
                                            faucetSetting = _context8.sent;
                                            _context8.next = 22;
                                            return (0, _waterFaucet.waterFaucet)(t, Number(endReactDrop.feeAmount), faucetSetting);

                                          case 22:
                                            faucetWatered = _context8.sent;
                                            //
                                            amountEach = ((Number(endReactDrop.amount) - Number(endReactDrop.feeAmount)) / Number(endReactDrop.reactdroptips.length)).toFixed(0);
                                            _context8.next = 26;
                                            return endReactDrop.update({
                                              ended: true,
                                              userCount: Number(endReactDrop.reactdroptips.length)
                                            }, {
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 26:
                                            listOfUsersRained = [];
                                            _context8.next = 29;
                                            return _lodash["default"].sortBy(endReactDrop.reactdroptips, 'createdAt');

                                          case 29:
                                            withoutBotsSorted = _context8.sent;
                                            // eslint-disable-next-line no-restricted-syntax
                                            _iterator = _createForOfIteratorHelper(withoutBotsSorted);
                                            _context8.prev = 31;

                                            _iterator.s();

                                          case 33:
                                            if ((_step = _iterator.n()).done) {
                                              _context8.next = 52;
                                              break;
                                            }

                                            receiver = _step.value;
                                            _context8.next = 37;
                                            return receiver.update({
                                              amount: Number(amountEach)
                                            }, {
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 37:
                                            updateReactDropTipAmount = _context8.sent;
                                            _context8.next = 40;
                                            return receiver.user.wallet.update({
                                              available: receiver.user.wallet.available + Number(amountEach)
                                            }, {
                                              lock: t.LOCK.UPDATE,
                                              transaction: t
                                            });

                                          case 40:
                                            earnerWallet = _context8.sent;

                                            if (receiver.user.ignoreMe) {
                                              listOfUsersRained.push("".concat(receiver.user.username));
                                            } else {
                                              userIdReceivedRain = receiver.user.user_id.replace('discord-', '');
                                              listOfUsersRained.push("<@".concat(userIdReceivedRain, ">"));
                                            }

                                            tipActivity = void 0; // eslint-disable-next-line no-await-in-loop

                                            _context8.next = 45;
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

                                          case 45:
                                            tipActivity = _context8.sent;
                                            _context8.next = 48;
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

                                          case 48:
                                            tipActivity = _context8.sent;
                                            activity.unshift(tipActivity);

                                          case 50:
                                            _context8.next = 33;
                                            break;

                                          case 52:
                                            _context8.next = 57;
                                            break;

                                          case 54:
                                            _context8.prev = 54;
                                            _context8.t0 = _context8["catch"](31);

                                            _iterator.e(_context8.t0);

                                          case 57:
                                            _context8.prev = 57;

                                            _iterator.f();

                                            return _context8.finish(57);

                                          case 60:
                                            newStringListUsers = listOfUsersRained.join(", ");
                                            cutStringListUsers = newStringListUsers.match(/.{1,1999}(\s|$)/g); // eslint-disable-next-line no-restricted-syntax

                                            // eslint-disable-next-line no-restricted-syntax
                                            _iterator2 = _createForOfIteratorHelper(cutStringListUsers);
                                            _context8.prev = 63;

                                            _iterator2.s();

                                          case 65:
                                            if ((_step2 = _iterator2.n()).done) {
                                              _context8.next = 71;
                                              break;
                                            }

                                            element = _step2.value;
                                            _context8.next = 69;
                                            return reactMessage.channel.send(element);

                                          case 69:
                                            _context8.next = 65;
                                            break;

                                          case 71:
                                            _context8.next = 76;
                                            break;

                                          case 73:
                                            _context8.prev = 73;
                                            _context8.t1 = _context8["catch"](63);

                                            _iterator2.e(_context8.t1);

                                          case 76:
                                            _context8.prev = 76;

                                            _iterator2.f();

                                            return _context8.finish(76);

                                          case 79:
                                            initiator = endReactDrop.user.user_id.replace('discord-', '');
                                            _context8.next = 82;
                                            return reactMessage.channel.send({
                                              embeds: [(0, _discord2.AfterReactDropSuccessMessage)(endReactDrop, amountEach, initiator)]
                                            });

                                          case 82:
                                            t.afterCommit(function () {
                                              console.log('done');
                                            });

                                          case 83:
                                          case "end":
                                            return _context8.stop();
                                        }
                                      }
                                    }, _callee8, null, [[31, 54, 57, 60], [63, 73, 76, 79]]);
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

                                if (activity.length > 0) {
                                  io.to('admin').emit('updateActivity', {
                                    activity: activity
                                  });
                                }

                              case 5:
                              case "end":
                                return _context10.stop();
                            }
                          }
                        }, _callee10);
                      })));

                    case 2:
                    case "end":
                      return _context11.stop();
                  }
                }
              }, _callee11);
            })));

          case 4:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function listenReactDrop(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

exports.listenReactDrop = listenReactDrop;

var discordReactDrop = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(discordClient, message, filteredMessage, io, groupTask, channelTask, setting, faucetSetting, queue) {
    var activity, useEmojis;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            activity = [];
            useEmojis = [];
            _context16.next = 4;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(t) {
                var _yield$userWalletExis, _yield$userWalletExis2, user, userActivity, _yield$validateAmount, _yield$validateAmount2, validAmount, activityValiateAmount, amount, textTime, cutLastTimeLetter, cutNumberTime, isnum, timeFailActivity, _timeFailActivity, allEmojis, failEmojiActivity, timeDay, timeHour, timeMinute, timeSecond, dateObj, countDownDate, now, distance, randomAmount, i, randomX, shuffeledEmojisArray, findGroup, wallet, group, channel, fee, newReactDrop, sendReactDropMessage, newUpdatedReactDrop, preActivity, finalActivity, reactMessage, _iterator3, _step3, shufEmoji, updateMessage;

                return _regenerator["default"].wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        _context14.next = 2;
                        return (0, _userWalletExist.userWalletExist)(message, t, filteredMessage[1].toLowerCase());

                      case 2:
                        _yield$userWalletExis = _context14.sent;
                        _yield$userWalletExis2 = (0, _slicedToArray2["default"])(_yield$userWalletExis, 2);
                        user = _yield$userWalletExis2[0];
                        userActivity = _yield$userWalletExis2[1];

                        if (userActivity) {
                          activity.unshift(userActivity);
                        }

                        if (user) {
                          _context14.next = 9;
                          break;
                        }

                        return _context14.abrupt("return");

                      case 9:
                        _context14.next = 11;
                        return (0, _validateAmount.validateAmount)(message, t, filteredMessage[2], user, setting, 'reactdrop');

                      case 11:
                        _yield$validateAmount = _context14.sent;
                        _yield$validateAmount2 = (0, _slicedToArray2["default"])(_yield$validateAmount, 3);
                        validAmount = _yield$validateAmount2[0];
                        activityValiateAmount = _yield$validateAmount2[1];
                        amount = _yield$validateAmount2[2];

                        if (validAmount) {
                          _context14.next = 19;
                          break;
                        }

                        activity.unshift(activityValiateAmount);
                        return _context14.abrupt("return");

                      case 19:
                        // Convert Message time to MS
                        textTime = '5m';

                        if (filteredMessage[3]) {
                          // eslint-disable-next-line prefer-destructuring
                          textTime = filteredMessage[3];
                        }

                        cutLastTimeLetter = textTime.substring(textTime.length - 1, textTime.length).toLowerCase();
                        cutNumberTime = textTime.substring(0, textTime.length - 1);
                        isnum = /^\d+$/.test(cutNumberTime);

                        if (!(!isnum // && Number(cutNumberTime) < 0
                        || cutLastTimeLetter !== 'd' && cutLastTimeLetter !== 'h' && cutLastTimeLetter !== 'm' && cutLastTimeLetter !== 's')) {
                          _context14.next = 33;
                          break;
                        }

                        _context14.next = 27;
                        return _models["default"].activity.create({
                          type: 'reactdrop_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 27:
                        timeFailActivity = _context14.sent;
                        activity.unshift(timeFailActivity);
                        _context14.next = 31;
                        return message.channel.send({
                          embeds: [(0, _discord2.invalidTimeMessage)(message, 'Reactdrop')]
                        });

                      case 31:
                        _context14.next = 142;
                        break;

                      case 33:
                        if (!(cutLastTimeLetter === 's' && Number(cutNumberTime) < 60)) {
                          _context14.next = 42;
                          break;
                        }

                        _context14.next = 36;
                        return _models["default"].activity.create({
                          type: 'reactdrop_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 36:
                        _timeFailActivity = _context14.sent;
                        activity.unshift(_timeFailActivity);
                        _context14.next = 40;
                        return message.channel.send({
                          embeds: [(0, _discord2.minimumTimeReactDropMessage)(message)]
                        });

                      case 40:
                        _context14.next = 142;
                        break;

                      case 42:
                        allEmojis = _emoji["default"];
                        _context14.next = 45;
                        return message.guild.emojis.cache.forEach(function (customEmoji) {
                          if (customEmoji.animated) {
                            allEmojis.push("<a:".concat(customEmoji.name, ":").concat(customEmoji.id, ">"));
                          } else {
                            allEmojis.push("<:".concat(customEmoji.name, ":").concat(customEmoji.id, ">"));
                          }
                        });

                      case 45:
                        if (!filteredMessage[4]) {
                          // eslint-disable-next-line no-param-reassign
                          filteredMessage[4] = _lodash["default"].sample(allEmojis);
                        }

                        if (allEmojis.includes(filteredMessage[4])) {
                          _context14.next = 55;
                          break;
                        }

                        _context14.next = 49;
                        return _models["default"].activity.create({
                          type: 'reactdrop_f',
                          spenderId: user.id
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 49:
                        failEmojiActivity = _context14.sent;
                        activity.unshift(failEmojiActivity);
                        _context14.next = 53;
                        return message.channel.send({
                          embeds: [(0, _discord2.invalidEmojiMessage)(message, 'Reactdrop')]
                        });

                      case 53:
                        _context14.next = 142;
                        break;

                      case 55:
                        timeDay = Number(cutNumberTime) * 24 * 60 * 60 * 1000;
                        timeHour = Number(cutNumberTime) * 60 * 60 * 1000;
                        timeMinute = Number(cutNumberTime) * 60 * 1000;
                        timeSecond = Number(cutNumberTime) * 1000;

                        if (!(cutLastTimeLetter === 'd' && timeDay > 172800000 || cutLastTimeLetter === 'h' && timeHour > 172800000 || cutLastTimeLetter === 'm' && timeMinute > 172800000 || cutLastTimeLetter === 's' && timeSecond > 172800000)) {
                          _context14.next = 63;
                          break;
                        }

                        _context14.next = 62;
                        return message.channel.send({
                          embeds: [(0, _discord2.maxTimeReactdropMessage)(message)]
                        });

                      case 62:
                        return _context14.abrupt("return");

                      case 63:
                        _context14.next = 65;
                        return new Date().getTime();

                      case 65:
                        dateObj = _context14.sent;

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

                        _context14.next = 72;
                        return new Date(dateObj);

                      case 72:
                        dateObj = _context14.sent;
                        _context14.next = 75;
                        return dateObj.getTime();

                      case 75:
                        countDownDate = _context14.sent;
                        _context14.next = 78;
                        return new Date().getTime();

                      case 78:
                        now = _context14.sent;
                        distance = countDownDate - now;
                        randomAmount = Math.floor(Math.random() * 3) + 2;

                        for (i = 0; i < randomAmount; i += 1) {
                          randomX = Math.floor(Math.random() * allEmojis.length);
                          useEmojis.push(allEmojis[parseInt(randomX, 10)]);
                        }

                        _context14.next = 84;
                        return useEmojis.push(filteredMessage[4]);

                      case 84:
                        _context14.next = 86;
                        return _lodash["default"].shuffle(useEmojis);

                      case 86:
                        shuffeledEmojisArray = _context14.sent;
                        _context14.next = 89;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "discord-".concat(message.guildId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 89:
                        findGroup = _context14.sent;

                        if (findGroup) {
                          _context14.next = 94;
                          break;
                        }

                        console.log('group not found');
                        _context14.next = 142;
                        break;

                      case 94:
                        _context14.next = 96;
                        return user.wallet.update({
                          available: user.wallet.available - amount
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 96:
                        wallet = _context14.sent;
                        _context14.next = 99;
                        return _models["default"].group.findOne({
                          where: {
                            groupId: "discord-".concat(message.guildId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 99:
                        group = _context14.sent;
                        _context14.next = 102;
                        return _models["default"].channel.findOne({
                          where: {
                            channelId: "discord-".concat(message.channelId)
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 102:
                        channel = _context14.sent;
                        fee = (amount / 100 * (setting.fee / 1e2)).toFixed(0);
                        _context14.next = 106;
                        return _models["default"].reactdrop.create({
                          feeAmount: Number(fee),
                          amount: amount,
                          groupId: group.id,
                          channelId: channel.id,
                          ends: dateObj,
                          emoji: filteredMessage[4],
                          messageId: 'notYetSpecified',
                          userId: user.id,
                          side: 'discord'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 106:
                        newReactDrop = _context14.sent;
                        _context14.next = 109;
                        return message.channel.send({
                          embeds: [(0, _discord2.reactDropMessage)(newReactDrop.id, distance, message.author.id, filteredMessage[4], amount)]
                        });

                      case 109:
                        sendReactDropMessage = _context14.sent;
                        _context14.next = 112;
                        return newReactDrop.update({
                          messageId: sendReactDropMessage.id
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 112:
                        newUpdatedReactDrop = _context14.sent;
                        _context14.next = 115;
                        return _models["default"].activity.create({
                          amount: amount,
                          type: 'reactdrop_s',
                          spenderId: user.id,
                          reactdropId: newUpdatedReactDrop.id,
                          spender_balance: wallet.available + wallet.locked
                        }, {
                          lock: t.LOCK.UPDATE,
                          transaction: t
                        });

                      case 115:
                        preActivity = _context14.sent;
                        _context14.next = 118;
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

                      case 118:
                        finalActivity = _context14.sent;
                        activity.unshift(finalActivity);
                        _context14.next = 122;
                        return discordClient.guilds.cache.get(sendReactDropMessage.guildId).channels.cache.get(sendReactDropMessage.channelId).messages.fetch(sendReactDropMessage.id);

                      case 122:
                        reactMessage = _context14.sent;
                        listenReactDrop(reactMessage, distance, newUpdatedReactDrop, io, queue); // eslint-disable-next-line no-restricted-syntax

                        // eslint-disable-next-line no-restricted-syntax
                        _iterator3 = _createForOfIteratorHelper(shuffeledEmojisArray);
                        _context14.prev = 125;

                        _iterator3.s();

                      case 127:
                        if ((_step3 = _iterator3.n()).done) {
                          _context14.next = 133;
                          break;
                        }

                        shufEmoji = _step3.value;
                        _context14.next = 131;
                        return reactMessage.react(shufEmoji);

                      case 131:
                        _context14.next = 127;
                        break;

                      case 133:
                        _context14.next = 138;
                        break;

                      case 135:
                        _context14.prev = 135;
                        _context14.t0 = _context14["catch"](125);

                        _iterator3.e(_context14.t0);

                      case 138:
                        _context14.prev = 138;

                        _iterator3.f();

                        return _context14.finish(138);

                      case 141:
                        updateMessage = setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
                          return _regenerator["default"].wrap(function _callee13$(_context13) {
                            while (1) {
                              switch (_context13.prev = _context13.next) {
                                case 0:
                                  now = new Date().getTime();
                                  distance = countDownDate - now;
                                  _context13.next = 4;
                                  return reactMessage.edit({
                                    embeds: [(0, _discord2.reactDropMessage)(newUpdatedReactDrop.id, distance, message.author.id, filteredMessage[4], amount)]
                                  });

                                case 4:
                                  if (distance < 0) {
                                    clearInterval(updateMessage);
                                  }

                                case 5:
                                case "end":
                                  return _context13.stop();
                              }
                            }
                          }, _callee13);
                        })), 10000);

                      case 142:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 143:
                      case "end":
                        return _context14.stop();
                    }
                  }
                }, _callee14, null, [[125, 135, 138, 141]]);
              }));

              return function (_x25) {
                return _ref14.apply(this, arguments);
              };
            }())["catch"]( /*#__PURE__*/function () {
              var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(err) {
                return _regenerator["default"].wrap(function _callee15$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        _context15.prev = 0;
                        _context15.next = 3;
                        return _models["default"].error.create({
                          type: 'reactDrop',
                          error: "".concat(err)
                        });

                      case 3:
                        _context15.next = 8;
                        break;

                      case 5:
                        _context15.prev = 5;
                        _context15.t0 = _context15["catch"](0);

                        _logger["default"].error("Error Discord: ".concat(_context15.t0));

                      case 8:
                        console.log(err);
                        console.log(useEmojis);

                        _logger["default"].error("reactdrop error: ".concat(err, "\nEmojis used: ").concat(useEmojis));

                        _context15.next = 13;
                        return message.channel.send({
                          embeds: [(0, _discord2.discordErrorMessage)("ReactDrop")]
                        })["catch"](function (e) {
                          console.log(e);
                        });

                      case 13:
                      case "end":
                        return _context15.stop();
                    }
                  }
                }, _callee15, null, [[0, 5]]);
              }));

              return function (_x26) {
                return _ref16.apply(this, arguments);
              };
            }());

          case 4:
            if (activity.length > 0) {
              io.to('admin').emit('updateActivity', {
                activity: activity
              });
            }

          case 5:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function discordReactDrop(_x16, _x17, _x18, _x19, _x20, _x21, _x22, _x23, _x24) {
    return _ref13.apply(this, arguments);
  };
}();

exports.discordReactDrop = discordReactDrop;