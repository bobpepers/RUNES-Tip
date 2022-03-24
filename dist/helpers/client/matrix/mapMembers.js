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
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(matrixClient, message, t, onlineMembers, setting) {
    var mappedMembersArray, withoutBots, _iterator, _step, matrixUser, userExist, userIdTest, user, wallet, address, newAddress, addressAlreadyExist, userExistNew, _userIdTest, withoutBotsSorted;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mappedMembersArray = [];
            withoutBots = [];
            console.log(onlineMembers);
            _context.next = 5;
            return onlineMembers.filter(function (a) {
              return a.userId !== message.sender.userId && a.userId !== matrixClient.credentials.userId;
            });

          case 5:
            mappedMembersArray = _context.sent;

            if (!(mappedMembersArray.length > setting.maxSampleSize)) {
              _context.next = 10;
              break;
            }

            _context.next = 9;
            return _lodash["default"].sampleSize(mappedMembersArray, setting.maxSampleSize);

          case 9:
            mappedMembersArray = _context.sent;

          case 10:
            // eslint-disable-next-line no-restricted-syntax
            _iterator = _createForOfIteratorHelper(mappedMembersArray);
            _context.prev = 11;

            _iterator.s();

          case 13:
            if ((_step = _iterator.n()).done) {
              _context.next = 70;
              break;
            }

            matrixUser = _step.value;
            _context.next = 17;
            return _models["default"].user.findOne({
              where: {
                user_id: "matrix-".concat(matrixUser.userId)
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

          case 17:
            userExist = _context.sent;

            if (!userExist) {
              _context.next = 26;
              break;
            }

            _context.next = 21;
            return userExist.user_id.replace('matrix-', '');

          case 21:
            userIdTest = _context.sent;

            if (!(userIdTest !== message.sender.userId)) {
              _context.next = 26;
              break;
            }

            if (userExist.banned) {
              _context.next = 26;
              break;
            }

            _context.next = 26;
            return withoutBots.push(userExist);

          case 26:
            if (userExist) {
              _context.next = 68;
              break;
            }

            user = void 0;
            console.log(matrixUser);
            _context.next = 31;
            return _models["default"].user.create({
              user_id: "matrix-".concat(matrixUser.userId),
              username: "".concat(matrixUser.name),
              firstname: '',
              lastname: ''
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 31:
            user = _context.sent;

            if (!user) {
              _context.next = 58;
              break;
            }

            if (!(user.username !== "".concat(matrixUser.name))) {
              _context.next = 37;
              break;
            }

            _context.next = 36;
            return user.update({
              username: "".concat(matrixUser.name)
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 36:
            user = _context.sent;

          case 37:
            _context.next = 39;
            return _models["default"].wallet.findOne({
              where: {
                userId: user.id
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 39:
            wallet = _context.sent;

            if (wallet) {
              _context.next = 44;
              break;
            }

            _context.next = 43;
            return _models["default"].wallet.create({
              userId: user.id,
              available: 0,
              locked: 0
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 43:
            wallet = _context.sent;

          case 44:
            _context.next = 46;
            return _models["default"].address.findOne({
              where: {
                walletId: wallet.id
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 46:
            address = _context.sent;

            if (address) {
              _context.next = 58;
              break;
            }

            _context.next = 50;
            return (0, _rclient.getInstance)().getNewAddress();

          case 50:
            newAddress = _context.sent;
            _context.next = 53;
            return _models["default"].address.findOne({
              where: {
                address: newAddress
              },
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 53:
            addressAlreadyExist = _context.sent;

            if (addressAlreadyExist) {
              _context.next = 58;
              break;
            }

            _context.next = 57;
            return _models["default"].address.create({
              address: newAddress,
              walletId: wallet.id,
              type: 'deposit',
              confirmed: true
            }, {
              transaction: t,
              lock: t.LOCK.UPDATE
            });

          case 57:
            address = _context.sent;

          case 58:
            _context.next = 60;
            return _models["default"].user.findOne({
              where: {
                user_id: "matrix-".concat(matrixUser.userId)
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

          case 60:
            userExistNew = _context.sent;

            if (!userExistNew) {
              _context.next = 68;
              break;
            }

            _context.next = 64;
            return userExistNew.user_id.replace('matrix-', '');

          case 64:
            _userIdTest = _context.sent;

            if (!(_userIdTest !== message.sender.userId)) {
              _context.next = 68;
              break;
            }

            _context.next = 68;
            return withoutBots.push(userExistNew);

          case 68:
            _context.next = 13;
            break;

          case 70:
            _context.next = 75;
            break;

          case 72:
            _context.prev = 72;
            _context.t0 = _context["catch"](11);

            _iterator.e(_context.t0);

          case 75:
            _context.prev = 75;

            _iterator.f();

            return _context.finish(75);

          case 78:
            _context.next = 80;
            return _lodash["default"].sortBy(withoutBots, 'createdAt');

          case 80:
            withoutBotsSorted = _context.sent;
            return _context.abrupt("return", withoutBotsSorted);

          case 82:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[11, 72, 75, 78]]);
  }));

  return function mapMembers(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

exports.mapMembers = mapMembers;