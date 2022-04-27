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
            _context.next = 2;
            return _models["default"].channel.findOne({
              where: {
                id: req.body.id
              }
            });

          case 2:
            channel = _context.sent;
            _context.next = 5;
            return channel.update({
              banned: !channel.banned,
              banMessage: req.body.banMessage
            });

          case 5:
            updatedChannel = _context.sent;
            res.locals.name = 'banChannel';
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
            res.locals.result = _context.sent;
            next();

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
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
              limit: req.body.limit,
              offset: req.body.offset,
              where: channelOptions,
              include: [{
                model: _models["default"].group,
                as: 'group'
              }]
            };
            res.locals.name = 'channel';
            _context2.next = 9;
            return _models["default"].channel.count(options);

          case 9:
            res.locals.count = _context2.sent;
            _context2.next = 12;
            return _models["default"].channel.findAll(options);

          case 12:
            res.locals.result = _context2.sent;
            next();

          case 14:
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