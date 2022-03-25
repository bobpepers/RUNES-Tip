"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchChannels = exports.banChannel = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var banChannel = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var channel, updatedChannel;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _models["default"].channel.findOne({
              where: {
                id: req.body.id
              }
            });

          case 3:
            channel = _context.sent;
            _context.next = 6;
            return channel.update({
              banned: !channel.banned,
              banMessage: req.body.banMessage
            });

          case 6:
            updatedChannel = _context.sent;
            _context.next = 9;
            return _models["default"].channel.findOne({
              where: {
                id: req.body.id
              },
              include: [{
                model: _models["default"].group,
                as: 'group'
              }]
            });

          case 9:
            res.locals.channel = _context.sent;
            _context.next = 16;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);
            res.locals.error = _context.t0;
            console.log(_context.t0);

          case 16:
            // console.log(res.locals.channel);
            next();

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 12]]);
  }));

  return function banChannel(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.banChannel = banChannel;

var fetchChannels = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var channelOptions, options;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // console.log('fetcChannels_____________________________');
            // console.log(req.body);
            channelOptions = {};

            if (req.body.id !== '') {
              channelOptions.id = Number(req.body.id);
            }

            if (req.body.channelId !== '') {
              channelOptions.channelId = req.body.channelId;
            }

            if (req.body.channelName !== '') {
              channelOptions.channelName = req.body.channelName;
            }

            if (req.body.serverId !== 'all') {
              channelOptions.groupId = req.body.serverId;
            }

            options = {
              order: [['id', 'DESC']],
              limit: 300,
              where: channelOptions,
              include: [{
                model: _models["default"].group,
                as: 'group'
              }]
            };
            _context2.next = 8;
            return _models["default"].channel.findAll(options);

          case 8:
            res.locals.channels = _context2.sent;
            // console.log(res.locals.channels);
            next();

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchChannels(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.fetchChannels = fetchChannels;