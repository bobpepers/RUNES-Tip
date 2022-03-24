"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapMembers = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _models = _interopRequireDefault(require("../../../models"));

var _rclient = require("../../../services/rclient");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var mapMembers = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(ctx, t, onlineMembers, setting) {
    var mappedMembersArray, withoutBots, _iterator, _step, telegramUser, userExist, userIdTest, user, wallet, address, newAddress, addressAlreadyExist, userExistNew, _userIdTest, withoutBotsSorted;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mappedMembersArray = [];
            withoutBots = [];
            _context.next = 4;
            return onlineMembers.filter(function (a) {
              return Number(a.id) !== ctx.update.message.from.id && Number(a.id) !== ctx.botInfo.id;
            });

          case 4:
            mappedMembersArray = _context.sent;

            if (!(mappedMembersArray.length > setting.maxSampleSize)) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return _lodash["default"].sampleSize(mappedMembersArray, setting.maxSampleSize);

          case 8:
            mappedMembersArray = _context.sent;

          case 9:
            // eslint-disable-next-line no-restricted-syntax
            _iterator = _createForOfIteratorHelper(mappedMembersArray);
            _context.prev = 10;

            _iterator.s();

          case 12:
            if ((_step = _iterator.n()).done) {
              _context.next = 67;
              break;
            }

            telegramUser = _step.value;
            _context.next = 16;
            return _models["default"].user.findOne({
              where: {
                user_id: "telegram-".concat(Number(telegramUser.id))
              },
              include: [{
                model: _models["default"].wallet,
                as: 'wallet',
                required: true,
                include: [{
                  model: _models["default"].address,
                  as: 'addresses',
                  required: false
                }]
              }],
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 16:
            userExist = _context.sent;

            if (!userExist) {
              _context.next = 29;
              break;
            }

            if (!(userExist.username !== telegramUser.username || userExist.firstname !== telegramUser.firstName || userExist.lastname !== telegramUser.lastName)) {
              _context.next = 22;
              break;
            }

            _context.next = 21;
            return userExist.update({
              username: telegramUser.username,
              firstname: telegramUser.firstName,
              lastname: telegramUser.lastName
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 21:
            userExist = _context.sent;

          case 22:
            _context.next = 24;
            return userExist.user_id.replace('telegram-', '');

          case 24:
            userIdTest = _context.sent;

            if (!(userIdTest !== ctx.update.message.from.id)) {
              _context.next = 29;
              break;
            }

            if (userExist.banned) {
              _context.next = 29;
              break;
            }

            _context.next = 29;
            return withoutBots.push(userExist);

          case 29:
            if (userExist) {
              _context.next = 65;
              break;
            }

            // let user;
            console.log(telegramUser);
            _context.next = 33;
            return _models["default"].user.create({
              user_id: "telegram-".concat(Number(telegramUser.id)),
              username: telegramUser.username,
              firstname: telegramUser.firstName,
              lastname: telegramUser.lastName
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 33:
            user = _context.sent;
            _context.next = 36;
            return _models["default"].wallet.findOne({
              where: {
                userId: user.id
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 36:
            wallet = _context.sent;

            if (wallet) {
              _context.next = 41;
              break;
            }

            _context.next = 40;
            return _models["default"].wallet.create({
              userId: user.id,
              available: 0,
              locked: 0
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 40:
            wallet = _context.sent;

          case 41:
            _context.next = 43;
            return _models["default"].address.findOne({
              where: {
                walletId: wallet.id
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 43:
            address = _context.sent;

            if (address) {
              _context.next = 55;
              break;
            }

            _context.next = 47;
            return (0, _rclient.getInstance)().getNewAddress();

          case 47:
            newAddress = _context.sent;
            _context.next = 50;
            return _models["default"].address.findOne({
              where: {
                address: newAddress
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 50:
            addressAlreadyExist = _context.sent;

            if (addressAlreadyExist) {
              _context.next = 55;
              break;
            }

            _context.next = 54;
            return _models["default"].address.create({
              address: newAddress,
              walletId: wallet.id,
              type: 'deposit',
              confirmed: true
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 54:
            address = _context.sent;

          case 55:
            _context.next = 57;
            return _models["default"].user.findOne({
              where: {
                user_id: "telegram-".concat(Number(telegramUser.id))
              },
              include: [{
                model: _models["default"].wallet,
                as: 'wallet',
                required: true,
                include: [{
                  model: _models["default"].address,
                  as: 'addresses',
                  required: true
                }]
              }],
              lock: t.LOCK.UPDATE,
              transaction: t
            });

          case 57:
            userExistNew = _context.sent;

            if (!userExistNew) {
              _context.next = 65;
              break;
            }

            _context.next = 61;
            return userExistNew.user_id.replace('telegram-', '');

          case 61:
            _userIdTest = _context.sent;

            if (!(_userIdTest !== ctx.update.message.from.id)) {
              _context.next = 65;
              break;
            }

            _context.next = 65;
            return withoutBots.push(userExistNew);

          case 65:
            _context.next = 12;
            break;

          case 67:
            _context.next = 72;
            break;

          case 69:
            _context.prev = 69;
            _context.t0 = _context["catch"](10);

            _iterator.e(_context.t0);

          case 72:
            _context.prev = 72;

            _iterator.f();

            return _context.finish(72);

          case 75:
            _context.next = 77;
            return _lodash["default"].sortBy(withoutBots, 'createdAt');

          case 77:
            withoutBotsSorted = _context.sent;
            return _context.abrupt("return", withoutBotsSorted);

          case 79:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[10, 69, 72, 75]]);
  }));

  return function mapMembers(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.mapMembers = mapMembers;