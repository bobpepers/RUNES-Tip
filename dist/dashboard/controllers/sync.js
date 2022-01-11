"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startSyncBlocks = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _settings = _interopRequireDefault(require("../../config/settings"));

var _syncKomodo = require("../../services/syncKomodo");

var _syncRunebase = require("../../services/syncRunebase");

var _syncPirate = require("../../services/syncPirate");

var settings = (0, _settings["default"])();

var startSyncBlocks = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            try {
              if (settings.coin.setting === 'Runebase') {
                (0, _syncRunebase.startRunebaseSync)();
              } else if (settings.coin.setting === 'Pirate') {
                (0, _syncPirate.startPirateSync)();
              } else if (settings.coin.setting === 'Dust') {
                (0, _syncKomodo.startKomodoSync)();
              } else {
                (0, _syncRunebase.startRunebaseSync)();
              }

              res.locals.sync = 'TRUE';
              next();
            } catch (error) {
              console.log(error);
              res.locals.error = error;
              next();
            }

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function startSyncBlocks(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.startSyncBlocks = startSyncBlocks;