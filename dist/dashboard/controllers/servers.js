"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.leaveServer = exports.fetchServers = exports.banServer = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = require("sequelize");

var _telegram = require("telegram");

var _models = _interopRequireDefault(require("../../models"));

/* eslint-disable no-restricted-syntax */
var banServer = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var group;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].group.findOne({
              where: {
                id: req.body.id
              }
            });

          case 2:
            group = _context.sent;
            res.locals.name = 'banServer';
            _context.next = 6;
            return group.update({
              banned: !group.banned,
              banMessage: req.body.banMessage
            });

          case 6:
            res.locals.result = _context.sent;
            next();

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function banServer(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.banServer = banServer;

var fetchServers = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var userOptions, options, GroupsDB, currentDiscordGuilds, currentMatrixRooms, newGroupDBArray;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userOptions = {};

            if (req.body.platform !== 'all') {
              if (req.body.platform === 'telegram') {
                userOptions.groupId = (0, _defineProperty2["default"])({}, _sequelize.Op.startsWith, 'telegram-');
              }

              if (req.body.platform === 'discord') {
                userOptions.groupId = (0, _defineProperty2["default"])({}, _sequelize.Op.startsWith, 'discord-');
              }
            }

            if (req.body.id !== '') {
              userOptions.id = Number(req.body.id);
            }

            if (req.body.groupId !== '') {
              userOptions.groupId = req.body.groupId;
            }

            options = {
              order: [['id', 'DESC']],
              limit: req.body.limit,
              offset: req.body.offset,
              where: userOptions
            };
            _context2.next = 7;
            return _models["default"].group.findAll(options);

          case 7:
            GroupsDB = _context2.sent;
            _context2.next = 10;
            return res.locals.discordClient.guilds.cache.map(function (guild) {
              return guild.id;
            });

          case 10:
            currentDiscordGuilds = _context2.sent;
            _context2.next = 13;
            return res.locals.matrixClient.getRooms();

          case 13:
            currentMatrixRooms = _context2.sent;
            // const currentTelegramGroups = await res.locals.telegramApiClient.invoke(
            //   new Api.channels.GetChannels({
            //     id: newTelegramIdArray,
            //   }),
            // );
            // console.log(currentTelegramGroups);
            // eslint-disable-next-line guard-for-in
            newGroupDBArray = GroupsDB.map(function (group) {
              var myGroup = group.dataValues;

              if (myGroup.groupId.startsWith('discord-')) {
                var discordGroupId = myGroup.groupId.replace('discord-', '');

                if (currentDiscordGuilds.includes(discordGroupId)) {
                  myGroup.isInServer = true;
                } else {
                  myGroup.isInServer = false;
                }
              }

              if (myGroup.groupId.startsWith('matrix-')) {
                var matrixGroupId = myGroup.groupId.replace('matrix-', '');
                var foundRoom = currentMatrixRooms.find(function (o) {
                  return o.roomId === matrixGroupId;
                });

                if (foundRoom) {
                  myGroup.isInServer = true;
                } else {
                  myGroup.isInServer = false;
                }
              }

              return myGroup;
            });
            res.locals.name = 'servers';
            _context2.next = 18;
            return _models["default"].group.count(options);

          case 18:
            res.locals.count = _context2.sent;
            res.locals.result = newGroupDBArray;
            next();

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchServers(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.fetchServers = fetchServers;

var leaveServer = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var server, discordGroupId, matrixGroupId;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _models["default"].group.findOne({
              where: {
                id: req.body.id
              }
            });

          case 2:
            server = _context3.sent;

            if (server) {
              _context3.next = 5;
              break;
            }

            throw new Error("SERVER_NOT_FOUND");

          case 5:
            if (!server.groupId.startsWith('discord-')) {
              _context3.next = 9;
              break;
            }

            discordGroupId = server.groupId.replace('discord-', '');
            _context3.next = 9;
            return res.locals.discordClient.guilds.cache.get(discordGroupId).leave();

          case 9:
            if (!server.groupId.startsWith('matrix-')) {
              _context3.next = 13;
              break;
            }

            matrixGroupId = server.groupId.replace('matrix-', '');
            _context3.next = 13;
            return res.locals.matrixClient.leave(matrixGroupId);

          case 13:
            res.locals.name = 'leaveServer';
            res.locals.result = {
              id: server.id
            };
            next();

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function leaveServer(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.leaveServer = leaveServer;