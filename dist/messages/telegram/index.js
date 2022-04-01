"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withdrawalAcceptedMessage = exports.withdrawalAcceptedAdminMessage = exports.welcomeMessage = exports.warnDirectMessage = exports.userNotFoundMessage = exports.userListMessage = exports.unableToWithdrawToSelfMessage = exports.unableToFindUserMessage = exports.tipSuccessMessage = exports.tipSingleSuccessMessage = exports.tipMultipleSuccessMessage = exports.timeOutAllAmoutMessage = exports.telegramWithdrawalRejectedMessage = exports.telegramWithdrawalConfirmedMessage = exports.telegramUserBannedMessage = exports.telegramServerBannedMessage = exports.telegramLimitSpamMessage = exports.telegramIncomingDepositMessage = exports.telegramDepositConfirmedMessage = exports.telegramBotMaintenanceMessage = exports.telegramBotDisabledMessage = exports.reviewMessage = exports.rainSuccessMessage = exports.rainErrorMessage = exports.priceMessage = exports.notEnoughUsers = exports.notEnoughActiveUsersMessage = exports.nodeIsOfflineMessage = exports.minimumMessage = exports.invalidTimeMessage = exports.invalidAmountMessage = exports.invalidAddressMessage = exports.insufficientBalanceMessage = exports.helpMessage = exports.groupNotFoundMessage = exports.featureDisabledServerMessage = exports.featureDisabledGlobalMessage = exports.faucetClaimedMessage = exports.errorMessage = exports.disallowDirectMessageMessage = exports.depositAddressNotFoundMessage = exports.depositAddressMessage = exports.confirmAllAmoutMessage = exports.claimTooFastFaucetMessage = exports.canceledAllAmoutMessage = exports.balanceMessage = exports.afterSuccessMessage = exports.InfoMessage = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _package = _interopRequireDefault(require("../../../package.json"));

var _settings = _interopRequireDefault(require("../../config/settings"));

var _userToMention = require("../../helpers/client/telegram/userToMention");

var _utils = require("../../helpers/utils");

/* eslint-disable import/prefer-default-export */
var settings = (0, _settings["default"])();

var featureDisabledServerMessage = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            result = "<u><b>This feature has been disabled for this group</b></u>\n\n<pre>".concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context.abrupt("return", result);

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function featureDisabledServerMessage() {
    return _ref.apply(this, arguments);
  };
}();

exports.featureDisabledServerMessage = featureDisabledServerMessage;

var featureDisabledGlobalMessage = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            result = "<u><b>This feature has been disabled</b></u>\n\n<pre>".concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context2.abrupt("return", result);

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function featureDisabledGlobalMessage() {
    return _ref2.apply(this, arguments);
  };
}();

exports.featureDisabledGlobalMessage = featureDisabledGlobalMessage;

var telegramDepositConfirmedMessage = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(amount, trans) {
    var result;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            result = "<b><u>Deposit #".concat(trans.id, "</u></b>\n\nDeposit Confirmed\n<b>").concat(trans.amount / 1e8, " ").concat(settings.coin.ticker, "</b> has been credited to your wallet\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context3.abrupt("return", result);

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function telegramDepositConfirmedMessage(_x, _x2) {
    return _ref3.apply(this, arguments);
  };
}();

exports.telegramDepositConfirmedMessage = telegramDepositConfirmedMessage;

var telegramIncomingDepositMessage = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(detail) {
    var result;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log(detail);
            result = "<b><u>Deposit #".concat(detail.transaction[0].id, "</u></b>\n\nincoming deposit detected for <b>").concat(detail.amount, " ").concat(settings.coin.ticker, "</b>\nBalance will be reflected in your wallet in <b>~").concat(settings.min.confirmations, "+ confirmations</b>\n").concat(settings.coin.explorer, "/tx/").concat(detail.transaction[0].txid, "\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context4.abrupt("return", result);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function telegramIncomingDepositMessage(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

exports.telegramIncomingDepositMessage = telegramIncomingDepositMessage;

var withdrawalAcceptedAdminMessage = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(updatedTrans) {
    var amount, fee, total, result;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            amount = (updatedTrans.amount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
            fee = (updatedTrans.feeAmount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
            total = ((updatedTrans.amount - updatedTrans.feeAmount) / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
            result = "<b><u>Admin withdraw message</u></b>\nWithdrawal #".concat(updatedTrans.id, " Accepted\n\namount: <b>").concat(amount, " ").concat(settings.coin.ticker, "</b>\nfee: <b>").concat(fee, " ").concat(settings.coin.ticker, "</b>\ntotal: <b>").concat(total, " ").concat(settings.coin.ticker, "</b>\n\n").concat(settings.coin.explorer, "/tx/").concat(updatedTrans.txid, "\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context5.abrupt("return", result);

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function withdrawalAcceptedAdminMessage(_x4) {
    return _ref5.apply(this, arguments);
  };
}();

exports.withdrawalAcceptedAdminMessage = withdrawalAcceptedAdminMessage;

var withdrawalAcceptedMessage = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(transaction, updatedTrans) {
    var amount, fee, total, result;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            amount = (updatedTrans.amount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
            fee = (updatedTrans.feeAmount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
            total = ((updatedTrans.amount - updatedTrans.feeAmount) / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
            result = "<b><u>Withdraw #".concat(updatedTrans.id, "</u></b>\n\n").concat(transaction.address.wallet.user.username, "'s withdrawal has been accepted\n\namount: <b>").concat(amount, " ").concat(settings.coin.ticker, "</b>\nfee: <b>").concat(fee, " ").concat(settings.coin.ticker, "</b>\ntotal: <b>").concat(total, " ").concat(settings.coin.ticker, "</b>\n\n").concat(settings.coin.explorer, "/tx/").concat(updatedTrans.txid, "\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context6.abrupt("return", result);

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function withdrawalAcceptedMessage(_x5, _x6) {
    return _ref6.apply(this, arguments);
  };
}();

exports.withdrawalAcceptedMessage = withdrawalAcceptedMessage;

var telegramWithdrawalConfirmedMessage = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(user, trans) {
    var _yield$getUserToMenti, _yield$getUserToMenti2, userToMention, userId, result;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return (0, _userToMention.getUserToMentionFromDatabaseRecord)(user);

          case 2:
            _yield$getUserToMenti = _context7.sent;
            _yield$getUserToMenti2 = (0, _slicedToArray2["default"])(_yield$getUserToMenti, 2);
            userToMention = _yield$getUserToMenti2[0];
            userId = _yield$getUserToMenti2[1];
            result = "<b><u>Withdraw #".concat(trans.id, "</u></b>\n\n<b><a href=\"tg://user?id=").concat(userId, "\">").concat(userToMention, "</a></b>'s withdrawal has been complete\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context7.abrupt("return", result);

          case 8:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function telegramWithdrawalConfirmedMessage(_x7, _x8) {
    return _ref7.apply(this, arguments);
  };
}();

exports.telegramWithdrawalConfirmedMessage = telegramWithdrawalConfirmedMessage;

var balanceMessage = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(user, priceInfo) {
    var _yield$getUserToMenti3, _yield$getUserToMenti4, userToMention, userId, result;

    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return (0, _userToMention.getUserToMentionFromDatabaseRecord)(user);

          case 2:
            _yield$getUserToMenti3 = _context8.sent;
            _yield$getUserToMenti4 = (0, _slicedToArray2["default"])(_yield$getUserToMenti3, 2);
            userToMention = _yield$getUserToMenti4[0];
            userId = _yield$getUserToMenti4[1];
            result = "<b><u><a href=\"tg://user?id=".concat(userId, "\">").concat(userToMention, "'s Balance</a></u></b>\n\ncurrent available balance: <b>").concat(user.wallet.available / 1e8, " ").concat(settings.coin.ticker, "</b>\ncurrent locked balance: <b>").concat(user.wallet.locked / 1e8, " ").concat(settings.coin.ticker, "</b>\nEstimated value: <b>$").concat(((user.wallet.available + user.wallet.locked) / 1e8 * priceInfo.price).toFixed(2), "</b>\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context8.abrupt("return", result);

          case 8:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function balanceMessage(_x9, _x10) {
    return _ref8.apply(this, arguments);
  };
}();

exports.balanceMessage = balanceMessage;

var telegramBotDisabledMessage = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    var result;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            result = "<b><u>Telegram tipbot disabled</u></b>\n\n<pre>".concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context9.abrupt("return", result);

          case 2:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function telegramBotDisabledMessage() {
    return _ref9.apply(this, arguments);
  };
}();

exports.telegramBotDisabledMessage = telegramBotDisabledMessage;

var telegramBotMaintenanceMessage = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
    var result;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            result = "<b><u>Telegram tipbot maintenance</u></b>\n\n<pre>".concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context10.abrupt("return", result);

          case 2:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function telegramBotMaintenanceMessage() {
    return _ref10.apply(this, arguments);
  };
}();

exports.telegramBotMaintenanceMessage = telegramBotMaintenanceMessage;

var depositAddressNotFoundMessage = function depositAddressNotFoundMessage() {
  var result = "Deposit Address not found";
  return result;
};

exports.depositAddressNotFoundMessage = depositAddressNotFoundMessage;

var reviewMessage = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(user, transaction) {
    var amount, fee, total, _yield$getUserToMenti5, _yield$getUserToMenti6, userToMention, userId, result;

    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            amount = (transaction.amount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
            fee = (transaction.feeAmount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
            total = ((transaction.amount - transaction.feeAmount) / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
            _context11.next = 5;
            return (0, _userToMention.getUserToMentionFromDatabaseRecord)(user);

          case 5:
            _yield$getUserToMenti5 = _context11.sent;
            _yield$getUserToMenti6 = (0, _slicedToArray2["default"])(_yield$getUserToMenti5, 2);
            userToMention = _yield$getUserToMenti6[0];
            userId = _yield$getUserToMenti6[1];
            result = "<u><b>Withdrawal #".concat(transaction.id, "</b></u>\n\n<b><a href=\"tg://user?id=").concat(userId, "\">").concat(userToMention, "</a></b>, your withdrawal is being reviewed.\n\namount: <b>").concat(amount, " ").concat(settings.coin.ticker, "</b>\nfee: <b>").concat(fee, " ").concat(settings.coin.ticker, "</b>\ntotal: <b>").concat(total, " ").concat(settings.coin.ticker, "</b>\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context11.abrupt("return", result);

          case 11:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function reviewMessage(_x11, _x12) {
    return _ref11.apply(this, arguments);
  };
}();

exports.reviewMessage = reviewMessage;

var telegramWithdrawalRejectedMessage = function telegramWithdrawalRejectedMessage() {
  var result = "Withdrawal has been rejected";
  return result;
};

exports.telegramWithdrawalRejectedMessage = telegramWithdrawalRejectedMessage;

var tipSuccessMessage = function tipSuccessMessage(user, amount, findUserToTip) {
  var result = "@".concat(user.username, " tipped ").concat(amount / 1e8, " ").concat(settings.coin.ticker, " to @").concat(findUserToTip.username);
  return result;
};

exports.tipSuccessMessage = tipSuccessMessage;

var minimumMessage = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(setting, title) {
    var result;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            result = "<u><b>".concat((0, _utils.capitalize)(title), "</b></u>\n\nMinimum ").concat(title, " is <b>").concat(Number(setting.min) / 1e8, " ").concat(settings.coin.ticker, "</b>\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context12.abrupt("return", result);

          case 2:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function minimumMessage(_x13, _x14) {
    return _ref12.apply(this, arguments);
  };
}();

exports.minimumMessage = minimumMessage;

var claimTooFastFaucetMessage = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(user, distance) {
    var _yield$getUserToMenti7, _yield$getUserToMenti8, userToMention, userId, hours, minutes, seconds, result;

    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return (0, _userToMention.getUserToMentionFromDatabaseRecord)(user);

          case 2:
            _yield$getUserToMenti7 = _context13.sent;
            _yield$getUserToMenti8 = (0, _slicedToArray2["default"])(_yield$getUserToMenti7, 2);
            userToMention = _yield$getUserToMenti8[0];
            userId = _yield$getUserToMenti8[1];
            hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
            minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
            seconds = Math.floor(distance % (1000 * 60) / 1000);
            result = "<u><b>Faucet</b></u>\n\n<b><a href=\"tg://user?id=".concat(userId, "\">").concat(userToMention, "</a></b>, you have to wait ").concat(hours === 1 ? "".concat(hours, " hour, ") : '').concat(hours > 1 ? "".concat(hours, " hours, ") : '').concat(minutes === 1 ? "".concat(minutes, " minute and ") : '').concat(minutes > 1 ? "".concat(minutes, " minutes and ") : '').concat(seconds === 1 ? "".concat(seconds, " second ") : '', " ").concat(seconds > 1 ? "".concat(seconds, " seconds ") : '', "before claiming the faucet again.\n(the faucet can be claimed every 4 hours)\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context13.abrupt("return", result);

          case 11:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function claimTooFastFaucetMessage(_x15, _x16) {
    return _ref13.apply(this, arguments);
  };
}();

exports.claimTooFastFaucetMessage = claimTooFastFaucetMessage;

var faucetClaimedMessage = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(id, user, amount) {
    var _yield$getUserToMenti9, _yield$getUserToMenti10, userToMention, userId, result;

    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return (0, _userToMention.getUserToMentionFromDatabaseRecord)(user);

          case 2:
            _yield$getUserToMenti9 = _context14.sent;
            _yield$getUserToMenti10 = (0, _slicedToArray2["default"])(_yield$getUserToMenti9, 2);
            userToMention = _yield$getUserToMenti10[0];
            userId = _yield$getUserToMenti10[1];
            result = "<u><b>Faucet #".concat(id, "</b></u>\n\n<b><a href=\"tg://user?id=").concat(userId, "\">").concat(userToMention, "</a></b>, you have been tipped ").concat(amount / 1e8, " ").concat(settings.coin.ticker, " from the faucet.\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context14.abrupt("return", result);

          case 8:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function faucetClaimedMessage(_x17, _x18, _x19) {
    return _ref14.apply(this, arguments);
  };
}();

exports.faucetClaimedMessage = faucetClaimedMessage;

var groupNotFoundMessage = function groupNotFoundMessage() {
  var result = "Group not found";
  return result;
};

exports.groupNotFoundMessage = groupNotFoundMessage;

var rainErrorMessage = function rainErrorMessage() {
  var result = "Something went wrong with raining";
  return result;
};

exports.rainErrorMessage = rainErrorMessage;

var rainSuccessMessage = function rainSuccessMessage(amount, usersToRain, amountPerUser) {
  var result = "Raining ".concat(amount / 1e8, " ").concat(settings.coin.ticker, " on ").concat(usersToRain.length, " active users -- ").concat(amountPerUser / 1e8, " ").concat(settings.coin.ticker, " each");
  return result;
};

exports.rainSuccessMessage = rainSuccessMessage;

var notEnoughActiveUsersMessage = function notEnoughActiveUsersMessage() {
  var result = "not enough active users";
  return result;
};

exports.notEnoughActiveUsersMessage = notEnoughActiveUsersMessage;

var insufficientBalanceMessage = /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(title) {
    var result;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            result = "<b><u>".concat((0, _utils.capitalize)(title), "</u></b>\n\nInsufficient Balance\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context15.abrupt("return", result);

          case 2:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function insufficientBalanceMessage(_x20) {
    return _ref15.apply(this, arguments);
  };
}();

exports.insufficientBalanceMessage = insufficientBalanceMessage;

var unableToFindUserMessage = function unableToFindUserMessage() {
  var result = "Unable to find user";
  return result;
};

exports.unableToFindUserMessage = unableToFindUserMessage;

var unableToWithdrawToSelfMessage = /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(ctx) {
    var _yield$getUserToMenti11, _yield$getUserToMenti12, userToMention, userId, result;

    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return (0, _userToMention.getUserToMentionCtx)(ctx);

          case 2:
            _yield$getUserToMenti11 = _context16.sent;
            _yield$getUserToMenti12 = (0, _slicedToArray2["default"])(_yield$getUserToMenti11, 2);
            userToMention = _yield$getUserToMenti12[0];
            userId = _yield$getUserToMenti12[1];
            result = "<b><u>Withdraw</u></b>\n\n<b><a href=\"tg://user?id=".concat(userId, "\">").concat(userToMention, "</a></b>, unable to withdraw to your own deposit address\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context16.abrupt("return", result);

          case 8:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function unableToWithdrawToSelfMessage(_x21) {
    return _ref16.apply(this, arguments);
  };
}();

exports.unableToWithdrawToSelfMessage = unableToWithdrawToSelfMessage;

var userNotFoundMessage = /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(ctx, title) {
    var _yield$getUserToMenti13, _yield$getUserToMenti14, userToMention, userId, result;

    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return (0, _userToMention.getUserToMentionCtx)(ctx);

          case 2:
            _yield$getUserToMenti13 = _context17.sent;
            _yield$getUserToMenti14 = (0, _slicedToArray2["default"])(_yield$getUserToMenti13, 2);
            userToMention = _yield$getUserToMenti14[0];
            userId = _yield$getUserToMenti14[1];
            result = "<b><u>".concat((0, _utils.capitalize)(title), "</u></b>\n\n<b><a href=\"tg://user?id=").concat(userId, "\">").concat(userToMention, "</a></b>'s wallet was not found\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context17.abrupt("return", result);

          case 8:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function userNotFoundMessage(_x22, _x23) {
    return _ref17.apply(this, arguments);
  };
}();

exports.userNotFoundMessage = userNotFoundMessage;

var telegramServerBannedMessage = /*#__PURE__*/function () {
  var _ref18 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(server) {
    var result;
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            result = "\uD83D\uDEAB     <b><u>Server Banned</u></b>     \uD83D\uDEAB\n\nReason:\n<b>".concat(server.banMessage, "</b>\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context18.abrupt("return", result);

          case 2:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));

  return function telegramServerBannedMessage(_x24) {
    return _ref18.apply(this, arguments);
  };
}();

exports.telegramServerBannedMessage = telegramServerBannedMessage;

var telegramUserBannedMessage = /*#__PURE__*/function () {
  var _ref19 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(user) {
    var _yield$getUserToMenti15, _yield$getUserToMenti16, userToMention, userId, result;

    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.next = 2;
            return (0, _userToMention.getUserToMentionFromDatabaseRecord)(user);

          case 2:
            _yield$getUserToMenti15 = _context19.sent;
            _yield$getUserToMenti16 = (0, _slicedToArray2["default"])(_yield$getUserToMenti15, 2);
            userToMention = _yield$getUserToMenti16[0];
            userId = _yield$getUserToMenti16[1];
            result = "\uD83D\uDEAB     <b><u><a href=\"tg://user?id=".concat(userId, "\">").concat(userToMention, " Banned</a></u></b>     \uD83D\uDEAB\n\nReason:\n<b>").concat(user.banMessage, "</b>\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context19.abrupt("return", result);

          case 8:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  }));

  return function telegramUserBannedMessage(_x25) {
    return _ref19.apply(this, arguments);
  };
}();

exports.telegramUserBannedMessage = telegramUserBannedMessage;

var nodeIsOfflineMessage = function nodeIsOfflineMessage() {
  var result = "<b><u>Withdraw</u></b>\n\n".concat(settings.coin.name, " node is offline\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
  return result;
};

exports.nodeIsOfflineMessage = nodeIsOfflineMessage;

var invalidAddressMessage = function invalidAddressMessage() {
  var result = "<b><u>Withdraw</u></b>\n\nInvalid ".concat(settings.coin.name, " Address\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
  return result;
};

exports.invalidAddressMessage = invalidAddressMessage;

var invalidAmountMessage = function invalidAmountMessage(title) {
  var result = "<b><u>".concat((0, _utils.capitalize)(title), "</u></b>\n\nInvalid amount\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
  return result;
};

exports.invalidAmountMessage = invalidAmountMessage;

var telegramLimitSpamMessage = /*#__PURE__*/function () {
  var _ref20 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(ctx, myFunctionName) {
    var _yield$getUserToMenti17, _yield$getUserToMenti18, userToMention, userId, result;

    return _regenerator["default"].wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.next = 2;
            return (0, _userToMention.getUserToMentionCtx)(ctx);

          case 2:
            _yield$getUserToMenti17 = _context20.sent;
            _yield$getUserToMenti18 = (0, _slicedToArray2["default"])(_yield$getUserToMenti17, 2);
            userToMention = _yield$getUserToMenti18[0];
            userId = _yield$getUserToMenti18[1];
            result = "<b><u>".concat(myFunctionName, "</u></b>\n\n\uD83D\uDEAB Slow down! \uD83D\uDEAB\n\n<a href=\"tg://user?id=").concat(userId, "\">").concat(userToMention, "</a>, you're using this command too fast, wait a while before using it again.\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context20.abrupt("return", result);

          case 8:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20);
  }));

  return function telegramLimitSpamMessage(_x26, _x27) {
    return _ref20.apply(this, arguments);
  };
}();

exports.telegramLimitSpamMessage = telegramLimitSpamMessage;

var depositAddressMessage = /*#__PURE__*/function () {
  var _ref21 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21(user) {
    var _yield$getUserToMenti19, _yield$getUserToMenti20, userToMention, userId, result;

    return _regenerator["default"].wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _context21.next = 2;
            return (0, _userToMention.getUserToMentionFromDatabaseRecord)(user);

          case 2:
            _yield$getUserToMenti19 = _context21.sent;
            _yield$getUserToMenti20 = (0, _slicedToArray2["default"])(_yield$getUserToMenti19, 2);
            userToMention = _yield$getUserToMenti20[0];
            userId = _yield$getUserToMenti20[1];
            result = "<b><u>Deposit Address</u></b>\n\n<a href=\"tg://user?id=".concat(userId, "\">").concat(userToMention, "</a>'s deposit address:\n<b>").concat(user.wallet.addresses[0].address, "</b>\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context21.abrupt("return", result);

          case 8:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21);
  }));

  return function depositAddressMessage(_x28) {
    return _ref21.apply(this, arguments);
  };
}();

exports.depositAddressMessage = depositAddressMessage;

var helpMessage = function helpMessage(withdraw) {
  var result = "<b>Tipbot Help</b>\n\n<code>".concat(settings.bot.command.telegram, "</code>\nDisplay this message\n\n<code>").concat(settings.bot.command.telegram, " help</code>\n/help\nDisplay this message\n\n<code>").concat(settings.bot.command.telegram, " price</code>\n/price\nDisplay current ").concat(settings.coin.ticker, " price\n\n<code>").concat(settings.bot.command.telegram, " info</code>\n/info\nDisplays coin info\n\n<code>").concat(settings.bot.command.telegram, " balance</code>\n/balance\nDisplay wallet balance\n\n<code>").concat(settings.bot.command.telegram, " deposit</code>\n/deposit\nDisplays your deposit address\n\n<code>").concat(settings.bot.command.telegram, " faucet</code>\n/faucet\nClaim faucet\n\n<code>").concat(settings.bot.command.telegram, " tip &lt;@user&gt; &lt;amount&gt;</code>\nTips the @ mentioned user with the desired amount, e.g.\nexample: <code>").concat(settings.bot.command.telegram, " tip @Bagosan 1.00</code>\n\n<code>").concat(settings.bot.command.discord, " &lt;@user&gt; &lt;@user&gt; &lt;@user&gt; &lt;amount|all&gt; [split|each]</code>\nTips the @ mentioned users with the desired amount\nexample: <code>").concat(settings.bot.command.discord, " @test123456 @test123457 1.00 each</code>\n\n<code>").concat(settings.bot.command.discord, " rain &lt;amount|all&gt;</code>\nRains the desired amount onto all recently online users\nexample: <code>").concat(settings.bot.command.discord, " rain 10</code>\n\n<code>").concat(settings.bot.command.telegram, " flood &lt;amount|all&gt;</code>\nFloods the desired amount onto all users (including offline users)\nexample: <code>").concat(settings.bot.command.telegram, " flood 5.00</code>\n\n<code>").concat(settings.bot.command.telegram, " sleet &lt;amount&gt;</code>\nSleets the desired amount onto all active users (default time is 15min), e.g.\n<code>").concat(settings.bot.command.telegram, " sleet 1.00</code>\n\n<code>").concat(settings.bot.command.telegram, " withdraw &lt;address&gt; &lt;amount&gt;</code>\nWithdraws the entered amount to a ").concat(settings.coin.ticker, " address of your choice, e.g.\n<code>").concat(settings.bot.command.telegram, " withdraw ReU2nhYXamYRd2VBk4auwresov6jwLEuSg 5.20</code>\nNote: Minimal amount to withdraw: ").concat(withdraw.min / 1e8, " ").concat(settings.coin.ticker, ". A withdrawal fee of ").concat(withdraw.fee / 1e2, "% ").concat(settings.coin.ticker, " will be automatically deducted from the amount. portion of the fee is donated to common faucet pot.\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
  return result;
}; // ${settings.coin.name === 'Runebase'
//     && `${settings.bot.command.telegram} referral
// /referral
// <code>Displays your referral count</code>
// <code>Note: We reward members for every 10 new members they add. current reward = 20 ${settings.coin.ticker}</code>
// ${settings.bot.command.telegram} referral top
// /top
// <code>Displays referral top 10</code>`}


exports.helpMessage = helpMessage;

var InfoMessage = function InfoMessage(blockHeight, priceInfo) {
  var result = "<b><u>Coin Info</u></b>\n".concat(settings.coin.description, "\n\n<b><u>Coin Name</u></b>\n").concat(settings.coin.name, "\n\n<b><u>Coin Ticker</u></b>\n").concat(settings.coin.ticker, "\n\n<b><u>Current block height</u></b>\n").concat(blockHeight, "\n\n<b><u>Website</u></b>\n").concat(settings.coin.website, "\n\n<b><u>Github</u></b>\n").concat(settings.coin.github, "\n\n<b><u>Block Explorer</u></b>\n").concat(settings.coin.explorer, "\n\n<b><u>Discord Server</u></b>\n").concat(settings.coin.discord, "\n\n<b><u>Telegram Group</u></b>\n").concat(settings.coin.telegram, "\n\n<b><u>Exchanges</u></b>\n").concat(settings.coin.exchanges.join('\n'), "\n\n<b><u>Current price</u></b>\n$").concat(priceInfo.price, " (source: coinpaprika)\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
  return result;
};

exports.InfoMessage = InfoMessage;

var confirmAllAmoutMessage = function confirmAllAmoutMessage(ctx, operationName, userBeingTipped) {
  var result = "<b>@".concat(ctx.update.message.from.username, ", are you sure that you want to ").concat(operationName, " ").concat(userBeingTipped ? "".concat(userBeingTipped, " ") : "", "all your ").concat(settings.coin.ticker, "?\nAccepted answers: <u>yes/no/y/n</u>;\nAuto-cancel in 30 seconds.</b>\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
  return result;
};

exports.confirmAllAmoutMessage = confirmAllAmoutMessage;

var timeOutAllAmoutMessage = function timeOutAllAmoutMessage(ctx, operationName, userBeingTipped) {
  var result = "<b>@".concat(ctx.update.message.from.username, ", the request to ").concat(operationName, " ").concat(userBeingTipped ? "".concat(userBeingTipped, " ") : "", "all your ").concat(settings.coin.ticker, " has expired</b>\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
  return result;
};

exports.timeOutAllAmoutMessage = timeOutAllAmoutMessage;

var canceledAllAmoutMessage = function canceledAllAmoutMessage(ctx, operationName, userBeingTipped) {
  var result = "<b>@".concat(ctx.update.message.from.username, ", you canceled the request to ").concat(operationName, " ").concat(userBeingTipped ? "".concat(userBeingTipped, " ") : "", "all your ").concat(settings.coin.ticker, "</b>\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
  return result;
};

exports.canceledAllAmoutMessage = canceledAllAmoutMessage;

var welcomeMessage = /*#__PURE__*/function () {
  var _ref22 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22(user) {
    var _yield$getUserToMenti21, _yield$getUserToMenti22, userToMention, userId, result;

    return _regenerator["default"].wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _context22.next = 2;
            return (0, _userToMention.getUserToMentionFromDatabaseRecord)(user);

          case 2:
            _yield$getUserToMenti21 = _context22.sent;
            _yield$getUserToMenti22 = (0, _slicedToArray2["default"])(_yield$getUserToMenti21, 2);
            userToMention = _yield$getUserToMenti22[0];
            userId = _yield$getUserToMenti22[1];
            result = "Welcome <a href=\"tg://user?id=".concat(userId, "\">").concat(userToMention, "</a>, we created a wallet for you.\nType \"").concat(settings.bot.command.telegram, " help\" for usage info\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context22.abrupt("return", result);

          case 8:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22);
  }));

  return function welcomeMessage(_x29) {
    return _ref22.apply(this, arguments);
  };
}();

exports.welcomeMessage = welcomeMessage;

var warnDirectMessage = /*#__PURE__*/function () {
  var _ref23 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23(user) {
    var _yield$getUserToMenti23, _yield$getUserToMenti24, userToMention, userId, result;

    return _regenerator["default"].wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            _context23.next = 2;
            return (0, _userToMention.getUserToMentionFromDatabaseRecord)(user);

          case 2:
            _yield$getUserToMenti23 = _context23.sent;
            _yield$getUserToMenti24 = (0, _slicedToArray2["default"])(_yield$getUserToMenti23, 2);
            userToMention = _yield$getUserToMenti24[0];
            userId = _yield$getUserToMenti24[1];
            result = "\n<b><a href=\"tg://user?id=".concat(userId, "\">").concat(userToMention, "</a>, i've sent you a direct message.</b>\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context23.abrupt("return", result);

          case 8:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23);
  }));

  return function warnDirectMessage(_x30) {
    return _ref23.apply(this, arguments);
  };
}();

exports.warnDirectMessage = warnDirectMessage;

var disallowDirectMessageMessage = /*#__PURE__*/function () {
  var _ref24 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24(user) {
    var _yield$getUserToMenti25, _yield$getUserToMenti26, userToMention, userId, result;

    return _regenerator["default"].wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            _context24.next = 2;
            return (0, _userToMention.getUserToMentionFromDatabaseRecord)(user);

          case 2:
            _yield$getUserToMenti25 = _context24.sent;
            _yield$getUserToMenti26 = (0, _slicedToArray2["default"])(_yield$getUserToMenti25, 2);
            userToMention = _yield$getUserToMenti26[0];
            userId = _yield$getUserToMenti26[1];
            result = "<a href=\"tg://user?id=".concat(userId, "\">").concat(userToMention, "</a>, this function is not allowed in direct message.\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context24.abrupt("return", result);

          case 8:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24);
  }));

  return function disallowDirectMessageMessage(_x31) {
    return _ref24.apply(this, arguments);
  };
}();

exports.disallowDirectMessageMessage = disallowDirectMessageMessage;

var priceMessage = /*#__PURE__*/function () {
  var _ref25 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25(priceRecord) {
    var replyString, result;
    return _regenerator["default"].wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            replyString = "<b><u>".concat(settings.coin.ticker, " PRICE</u></b>\n");
            replyString += priceRecord.map(function (a) {
              return "".concat(a.iso, ": ").concat(a.price);
            }).join('\n');
            result = "".concat(replyString, "\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context25.abrupt("return", result);

          case 4:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25);
  }));

  return function priceMessage(_x32) {
    return _ref25.apply(this, arguments);
  };
}();

exports.priceMessage = priceMessage;

var errorMessage = /*#__PURE__*/function () {
  var _ref26 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee26(title) {
    var result;
    return _regenerator["default"].wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            result = "<u><b>".concat(title, "</b></u>\n\n<b>Something went wrong.</b>\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context26.abrupt("return", result);

          case 2:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee26);
  }));

  return function errorMessage(_x33) {
    return _ref26.apply(this, arguments);
  };
}();

exports.errorMessage = errorMessage;

var notEnoughUsers = function notEnoughUsers(title) {
  var result = "<u><b>".concat(title, "</b></u>\n\n<b>Not enough users found.</b>\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
  return result;
};

exports.notEnoughUsers = notEnoughUsers;

var invalidTimeMessage = /*#__PURE__*/function () {
  var _ref27 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee27(ctx, title) {
    var _yield$getUserToMenti27, _yield$getUserToMenti28, userToMention, userId, result;

    return _regenerator["default"].wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            _context27.next = 2;
            return (0, _userToMention.getUserToMentionCtx)(ctx);

          case 2:
            _yield$getUserToMenti27 = _context27.sent;
            _yield$getUserToMenti28 = (0, _slicedToArray2["default"])(_yield$getUserToMenti27, 2);
            userToMention = _yield$getUserToMenti28[0];
            userId = _yield$getUserToMenti28[1];
            result = "<u><b>".concat(title, "</b></u>\n\n<a href=\"tg://user?id=").concat(userId, "\">").concat(userToMention, "</a>, Invalid time.\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context27.abrupt("return", result);

          case 8:
          case "end":
            return _context27.stop();
        }
      }
    }, _callee27);
  }));

  return function invalidTimeMessage(_x34, _x35) {
    return _ref27.apply(this, arguments);
  };
}();

exports.invalidTimeMessage = invalidTimeMessage;

var userListMessage = /*#__PURE__*/function () {
  var _ref28 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee28(list) {
    var result;
    return _regenerator["default"].wrap(function _callee28$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            result = "<b>".concat(list, "</b>");
            return _context28.abrupt("return", result);

          case 2:
          case "end":
            return _context28.stop();
        }
      }
    }, _callee28);
  }));

  return function userListMessage(_x36) {
    return _ref28.apply(this, arguments);
  };
}();

exports.userListMessage = userListMessage;

var tipSingleSuccessMessage = /*#__PURE__*/function () {
  var _ref29 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee29(ctx, id, listOfUsersRained, amount) {
    var _yield$getUserToMenti29, _yield$getUserToMenti30, userToMention, userId, result;

    return _regenerator["default"].wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            _context29.next = 2;
            return (0, _userToMention.getUserToMentionCtx)(ctx);

          case 2:
            _yield$getUserToMenti29 = _context29.sent;
            _yield$getUserToMenti30 = (0, _slicedToArray2["default"])(_yield$getUserToMenti29, 2);
            userToMention = _yield$getUserToMenti30[0];
            userId = _yield$getUserToMenti30[1];
            result = "<u><b>Tip #".concat(id, "</b></u>\n\n<a href=\"tg://user?id=").concat(userId, "\">").concat(userToMention, "</a> tipped <b>").concat(amount / 1e8, " ").concat(settings.coin.ticker, "</b> to ").concat(listOfUsersRained[0], "\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context29.abrupt("return", result);

          case 8:
          case "end":
            return _context29.stop();
        }
      }
    }, _callee29);
  }));

  return function tipSingleSuccessMessage(_x37, _x38, _x39, _x40) {
    return _ref29.apply(this, arguments);
  };
}();

exports.tipSingleSuccessMessage = tipSingleSuccessMessage;

var tipMultipleSuccessMessage = /*#__PURE__*/function () {
  var _ref30 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee30(ctx, id, listOfUsersRained, amount, type) {
    var _yield$getUserToMenti31, _yield$getUserToMenti32, userToMention, userId, result;

    return _regenerator["default"].wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            _context30.next = 2;
            return (0, _userToMention.getUserToMentionCtx)(ctx);

          case 2:
            _yield$getUserToMenti31 = _context30.sent;
            _yield$getUserToMenti32 = (0, _slicedToArray2["default"])(_yield$getUserToMenti31, 2);
            userToMention = _yield$getUserToMenti32[0];
            userId = _yield$getUserToMenti32[1];
            result = "<u><b>Tip #".concat(id, "</b></u>\n\n<a href=\"tg://user?id=").concat(userId, "\">").concat(userToMention, "</a> tipped <b>").concat(amount * listOfUsersRained.length / 1e8, " ").concat(settings.coin.ticker, "</b> to ").concat(listOfUsersRained.length, " users\n\nType: <b>").concat((0, _utils.capitalize)(type), "</b>\n\n\uD83D\uDCB8 <b>").concat(amount / 1e8, " ").concat(settings.coin.ticker, "</b> each \uD83D\uDCB8\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context30.abrupt("return", result);

          case 8:
          case "end":
            return _context30.stop();
        }
      }
    }, _callee30);
  }));

  return function tipMultipleSuccessMessage(_x41, _x42, _x43, _x44, _x45) {
    return _ref30.apply(this, arguments);
  };
}();

exports.tipMultipleSuccessMessage = tipMultipleSuccessMessage;

var afterSuccessMessage = /*#__PURE__*/function () {
  var _ref31 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee31(ctx, id, amount, userLength, amountPerUser, type, typeH) {
    var _yield$getUserToMenti33, _yield$getUserToMenti34, userToMention, userId, result;

    return _regenerator["default"].wrap(function _callee31$(_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            _context31.next = 2;
            return (0, _userToMention.getUserToMentionCtx)(ctx);

          case 2:
            _yield$getUserToMenti33 = _context31.sent;
            _yield$getUserToMenti34 = (0, _slicedToArray2["default"])(_yield$getUserToMenti33, 2);
            userToMention = _yield$getUserToMenti34[0];
            userId = _yield$getUserToMenti34[1];
            result = "<b><u>".concat(type, " #").concat(id, "</u></b>\n\n<b><a href=\"tg://user?id=").concat(userId, "\">").concat(userToMention, "</a></b> ").concat(typeH, " <u><b>").concat(amount / 1e8, " ").concat(settings.coin.ticker, "</b></u> on ").concat(userLength, " users\n\uD83D\uDCB8 <u><b>").concat(amountPerUser / 1e8, " ").concat(settings.coin.ticker, "</b></u> each \uD83D\uDCB8\n\n<pre>").concat(settings.bot.name, " v").concat(_package["default"].version, "</pre>");
            return _context31.abrupt("return", result);

          case 8:
          case "end":
            return _context31.stop();
        }
      }
    }, _callee31);
  }));

  return function afterSuccessMessage(_x46, _x47, _x48, _x49, _x50, _x51, _x52) {
    return _ref31.apply(this, arguments);
  };
}();

exports.afterSuccessMessage = afterSuccessMessage;