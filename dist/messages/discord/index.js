"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.warnDirectMessage = exports.walletNotFoundMessage = exports.voiceChannelNotFound = exports.userNotFoundMessage = exports.unableToFindUserTipMessage = exports.unIngoreMeMessage = exports.triviaReturnInitiatorMessage = exports.triviaMessageDiscord = exports.transactionNotFoundMessage = exports.tipSingleSuccessMessage = exports.tipMultipleSuccessMessage = exports.tipFaucetSuccessMessage = exports.timeOutAllAmoutMessageDiscord = exports.thunderstormUserZeroAmountMessage = exports.thunderstormMaxUserAmountMessage = exports.thunderstormInvalidUserAmount = exports.statsMessage = exports.reviewMessage = exports.reactDropMessage = exports.priceMessage = exports.notEnoughUsersToTip = exports.notEnoughActiveUsersMessage = exports.notAVoiceChannel = exports.noTriviaQuestionFoundMessage = exports.minimumWithdrawalMessage = exports.minimumTimeReactDropMessage = exports.minimumMessage = exports.maxTimeTriviaMessage = exports.maxTimeReactdropMessage = exports.listTransactionsMessage = exports.invalidTimeMessage = exports.invalidPeopleAmountMessage = exports.invalidEmojiMessage = exports.invalidAmountMessage = exports.invalidAddressMessage = exports.insufficientBalanceMessage = exports.ignoreMeMessage = exports.hurricaneUserZeroAmountMessage = exports.hurricaneMaxUserAmountMessage = exports.hurricaneInvalidUserAmount = exports.helpMessageTwo = exports.helpMessageOne = exports.featureDisabledServerMessage = exports.featureDisabledGlobalMessage = exports.featureDisabledChannelMessage = exports.faucetClaimedMessage = exports.enablePublicStatsMeMessage = exports.dryFaucetMessage = exports.discordWithdrawalRejectedMessage = exports.discordWithdrawalConfirmedMessage = exports.discordWithdrawalAcceptedMessage = exports.discordWelcomeMessage = exports.discordUserWithdrawalRejectMessage = exports.discordUserBannedMessage = exports.discordServerBannedMessage = exports.discordLimitSpamMessage = exports.discordIncomingDepositMessage = exports.discordErrorMessage = exports.discordDepositConfirmedMessage = exports.discordChannelBannedMessage = exports.discordBotMaintenanceMessage = exports.discordBotDisabledMessage = exports.disablePublicStatsMessage = exports.depositAddressMessage = exports.confirmAllAmoutMessageDiscord = exports.coinInfoMessage = exports.claimTooFactFaucetMessage = exports.cannotSendMessageUser = exports.canceledAllAmoutMessageDiscord = exports.balanceMessage = exports.ReactdropCaptchaMessage = exports.ReactDropReturnInitiatorMessage = exports.NotInDirectMessage = exports.DiscordFeeMessage = exports.AfterTriviaSuccessMessage = exports.AfterThunderSuccess = exports.AfterSuccessMessage = exports.AfterReactDropSuccessMessage = void 0;

var _discord = require("discord.js");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _package = _interopRequireDefault(require("../../../package.json"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var settings = (0, _settings["default"])();

var capitalize = function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
};

var discordUserBannedMessage = function discordUserBannedMessage(user) {
  var result = new _discord.MessageEmbed().setColor("#C70039").setTitle("\uD83D\uDEAB     User: ".concat(user.username, " Banned     \uD83D\uDEAB")).setDescription("Reason:\n".concat(user.banMessage)).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.discordUserBannedMessage = discordUserBannedMessage;

var discordServerBannedMessage = function discordServerBannedMessage(server) {
  var result = new _discord.MessageEmbed().setColor("#C70039").setTitle('🚫     Server Banned     🚫').setDescription("Reason:\n".concat(server.banMessage)).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.discordServerBannedMessage = discordServerBannedMessage;

var priceMessage = function priceMessage(replyString) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Price').setThumbnail(settings.coin.logo).setDescription(replyString).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.priceMessage = priceMessage;

var discordChannelBannedMessage = function discordChannelBannedMessage(channel) {
  var result = new _discord.MessageEmbed().setColor('#FF7900').setTitle('❗     Channel Restricted     ❗').setDescription("Reason:\n".concat(channel.banMessage)).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.discordChannelBannedMessage = discordChannelBannedMessage;

var coinInfoMessage = function coinInfoMessage(blockHeight, priceInfo) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Tipbot').addField("Coin Info", settings.coin.description).addField("\u200B", "\u200B").addFields({
    name: "Coin Name",
    value: settings.coin.name,
    inline: true
  }, {
    name: "Ticker",
    value: settings.coin.ticker,
    inline: true
  }).addField("\u200B", "\u200B").addFields({
    name: "Current block height",
    value: "".concat(blockHeight),
    inline: true
  }, {
    name: "Wallet version",
    value: "0",
    inline: true
  }).addField("\u200B", "\u200B").addField("Website", settings.coin.website).addField("Github", settings.coin.github).addField("Block Explorer", settings.coin.explorer).addField("Discord Server", settings.coin.discord).addField("Telegram Group", settings.coin.telegram).addField("Exchanges", settings.coin.exchanges.join('\n')).addField("Current price", "$".concat(priceInfo.price, " (source: coinpaprika)")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.coinInfoMessage = coinInfoMessage;

var triviaMessageDiscord = function triviaMessageDiscord(id, distance, author, question, answers, amount, totalPeople) {
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance % (1000 * 60 * 60 * 24 * 60) / (1000 * 60 * 60 * 24));
  var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
  var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
  var seconds = Math.floor(distance % (1000 * 60) / 1000);
  var ended = days < 1 && hours < 1 && minutes < 1 && seconds < 1;
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Trivia #".concat(id)).setDescription("\uD83D\uDC68\u200D\uD83C\uDFEB <@".concat(author, "> has started a trivia question for ").concat(totalPeople, " ").concat(Number(totalPeople) === 1 ? 'person' : 'people', "! \uD83D\uDC68\u200D\uD83C\uDFEB\n\n:information_source: Click the correct answer for a chance to win a share in ").concat(amount / 1e8, " ").concat(settings.coin.ticker, "!\n\nQuestion: ").concat(question, "\n\n").concat(answers, "\n\n").concat(!ended ? ":clock9: Time remaining ".concat(days > 0 ? "".concat(days, " days") : '', "  ").concat(hours > 0 ? "".concat(hours, " hours") : '', " ").concat(minutes > 0 ? "".concat(minutes, " minutes") : '', " ").concat(seconds > 0 ? "".concat(seconds, " seconds") : '') : "Ended", "\n")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.triviaMessageDiscord = triviaMessageDiscord;

var reactDropMessage = function reactDropMessage(id, distance, author, emoji, amount) {
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance % (1000 * 60 * 60 * 24 * 60) / (1000 * 60 * 60 * 24));
  var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
  var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
  var seconds = Math.floor(distance % (1000 * 60) / 1000);
  var ended = days < 1 && hours < 1 && minutes < 1 && seconds < 1;
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Reactdrop #".concat(id)).setDescription(":tada: <@".concat(author, "> has started a react airdrop! :tada:\n\n:information_source: React to this message ONLY with ").concat(emoji, " to win a share in ").concat(amount / 1e8, " ").concat(settings.coin.ticker, "! You will also be presented with a simple math question in your direct messages which you need to solve to be eligible.\n\n").concat(!ended ? ":clock9: Time remaining ".concat(days > 0 ? "".concat(days, " days") : '', "  ").concat(hours > 0 ? "".concat(hours, " hours") : '', " ").concat(minutes > 0 ? "".concat(minutes, " minutes") : '', " ").concat(seconds > 0 ? "".concat(seconds, " seconds") : '') : "Ended", "\n")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.reactDropMessage = reactDropMessage;

var AfterTriviaSuccessMessage = function AfterTriviaSuccessMessage(endTrivia, amountEach, initiator) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Trivia #".concat(endTrivia.id)).setDescription(":tada:[Trivia](https://discord.com/channels/".concat(endTrivia.group.groupId.replace("discord-", ""), "/").concat(endTrivia.channel.channelId.replace("discord-", ""), "/").concat(endTrivia.discordMessageId, ") started by <@").concat(initiator, "> has finished!:tada:\n    \n:money_with_wings:").concat(endTrivia.triviatips.length, " ").concat(endTrivia.triviatips.length === 1 ? 'user' : 'users', " will share ").concat(endTrivia.amount / 1e8, " ").concat(settings.coin.ticker, " (").concat(amountEach / 1e8, " each)!:money_with_wings:")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.AfterTriviaSuccessMessage = AfterTriviaSuccessMessage;

var AfterReactDropSuccessMessage = function AfterReactDropSuccessMessage(endReactDrop, amountEach, initiator) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Reactdrop #".concat(endReactDrop.id)).setDescription(":tada:[React airdrop](https://discord.com/channels/".concat(endReactDrop.group.groupId.replace("discord-", ""), "/").concat(endReactDrop.channel.channelId.replace("discord-", ""), "/").concat(endReactDrop.discordMessageId, ") started by <@").concat(initiator, "> has finished!:tada:\n    \n:money_with_wings:").concat(endReactDrop.reactdroptips.length, " user(s) will share ").concat(endReactDrop.amount / 1e8, " ").concat(settings.coin.ticker, " (").concat(amountEach / 1e8, " each)!:money_with_wings:")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.AfterReactDropSuccessMessage = AfterReactDropSuccessMessage;

var discordLimitSpamMessage = function discordLimitSpamMessage(message, myFunctionName) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(myFunctionName).setDescription("\uD83D\uDEAB Slow down! \uD83D\uDEAB\n<@".concat(message.author.id, ">, you're using this command too fast, wait a while before using it again.")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.discordLimitSpamMessage = discordLimitSpamMessage;

var minimumTimeReactDropMessage = function minimumTimeReactDropMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Reactdrop').setDescription("Minimum time for reactdrop is 60 seconds (60s)").setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.minimumTimeReactDropMessage = minimumTimeReactDropMessage;

var maxTimeTriviaMessage = function maxTimeTriviaMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Trivia').setDescription("Maximum time is 2 days").setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.maxTimeTriviaMessage = maxTimeTriviaMessage;

var maxTimeReactdropMessage = function maxTimeReactdropMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Reactdrop').setDescription("Maximum time is 2 days").setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.maxTimeReactdropMessage = maxTimeReactdropMessage;

var ignoreMeMessage = function ignoreMeMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Ignore me').setDescription("<@".concat(message.author.id, ">, you will no longer be @mentioned while receiving rains, soaks and other mass operations, but will continue to receive coins from them.\nIf you wish to be @mentioned, please issue this command again.")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.ignoreMeMessage = ignoreMeMessage;

var unIngoreMeMessage = function unIngoreMeMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Ignore me').setDescription("<@".concat(message.author.id, ">, you will again be @mentioned while receiving rains, soaks and other mass operations.\nIf you do not wish to be @mentioned, please issue this command again.")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.unIngoreMeMessage = unIngoreMeMessage;

var notAVoiceChannel = function notAVoiceChannel(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Voice Rain').setDescription("<@".concat(message.author.id, ">, Incorrect voice channel defined")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.notAVoiceChannel = notAVoiceChannel;

var voiceChannelNotFound = function voiceChannelNotFound(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Voice Rain').setDescription("<@".concat(message.author.id, ">, Voice channel not found")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.voiceChannelNotFound = voiceChannelNotFound;

var cannotSendMessageUser = function cannotSendMessageUser(title, message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, ").concat(settings.bot.name, " was unable to send you a direct message.\nPlease check your discord privacy settings.")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.cannotSendMessageUser = cannotSendMessageUser;

var discordErrorMessage = function discordErrorMessage(title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("Something went wrong.").setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.discordErrorMessage = discordErrorMessage;

var discordDepositConfirmedMessage = function discordDepositConfirmedMessage(amount, trans) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Deposit #".concat(trans.id)).setDescription("Deposit Confirmed \n".concat(amount, " ").concat(settings.coin.ticker, " has been credited to your wallet")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.discordDepositConfirmedMessage = discordDepositConfirmedMessage;

var discordIncomingDepositMessage = function discordIncomingDepositMessage(res) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Deposit #".concat(res.locals.transaction[0].id)).setDescription("incoming deposit detected for ".concat(res.locals.amount, " ").concat(settings.coin.ticker, "\nBalance will be reflected in your wallet in ~").concat(settings.min.confirmations, "+ confirmations\n").concat(settings.coin.explorer, "/tx/").concat(res.locals.transaction[0].txid)).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.discordIncomingDepositMessage = discordIncomingDepositMessage;

var discordUserWithdrawalRejectMessage = function discordUserWithdrawalRejectMessage(title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Withdraw').setDescription("Your withdrawal has been rejected").setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
}; // transactionNotFoundMessage


exports.discordUserWithdrawalRejectMessage = discordUserWithdrawalRejectMessage;

var transactionNotFoundMessage = function transactionNotFoundMessage(title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("Transaction not found").setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.transactionNotFoundMessage = transactionNotFoundMessage;

var reviewMessage = function reviewMessage(message, transaction) {
  var amount = (transaction.amount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var fee = (transaction.feeAmount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var total = ((transaction.amount - transaction.feeAmount) / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Withdraw #".concat(transaction.id)).setDescription("<@".concat(message.author.id, ">, Your withdrawal is being reviewed\n    \namount: ").concat(amount, "\nfee: ").concat(fee, "\ntotal: ").concat(total)).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.reviewMessage = reviewMessage;

var discordWithdrawalAcceptedMessage = function discordWithdrawalAcceptedMessage(updatedTrans) {
  var amount = (updatedTrans.amount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var fee = (updatedTrans.feeAmount / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var total = ((updatedTrans.amount - updatedTrans.feeAmount) / 1e8).toFixed(8).replace(/(\.0+|0+)$/, '');
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Withdraw #".concat(updatedTrans.id)).setDescription("Your withdrawal has been accepted\n\namount: ".concat(amount, "\nfee: ").concat(fee, "\ntotal: ").concat(total, "\n\n").concat(settings.coin.explorer, "/tx/").concat(updatedTrans.txid)).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.discordWithdrawalAcceptedMessage = discordWithdrawalAcceptedMessage;

var discordWithdrawalConfirmedMessage = function discordWithdrawalConfirmedMessage(userId, trans) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Withdraw #".concat(trans.id)).setDescription("<@".concat(userId, ">, Your withdrawal has been complete")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.discordWithdrawalConfirmedMessage = discordWithdrawalConfirmedMessage;

var listTransactionsMessage = function listTransactionsMessage(userId, user, transactions) {
  var myString = ''; // const confirmations = '';
  // eslint-disable-next-line no-restricted-syntax

  var _iterator = _createForOfIteratorHelper(transactions),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var transaction = _step.value;
      console.log(transaction);
      myString = myString.concat("__#".concat(transaction.id, " -- ").concat(transaction.type === 'receive' ? 'Deposit' : 'Withdrawal', " -- ").concat(capitalize(transaction.phase), "__\n__date:__ ").concat(transaction.createdAt.toLocaleDateString("en-US"), "\n__txId:__ ").concat(transaction.txid, "\n\n"));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('List Transactions').setDescription("<@".concat(userId, ">'s latest withdrawals and deposits\n\n").concat(myString)).setThumbnail(settings.coin.logo).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.listTransactionsMessage = listTransactionsMessage;

var balanceMessage = function balanceMessage(userId, user, priceInfo) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Balance').setDescription("<@".concat(userId, ">'s current available balance: ").concat(user.wallet.available / 1e8, " ").concat(settings.coin.ticker, "\n<@").concat(userId, ">'s current locked balance: ").concat(user.wallet.locked / 1e8, " ").concat(settings.coin.ticker, "\nEstimated value of <@").concat(userId, ">'s balance: $").concat(((user.wallet.available + user.wallet.locked) / 1e8 * priceInfo.price).toFixed(2))).setThumbnail(settings.coin.logo).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.balanceMessage = balanceMessage;

var DiscordFeeMessage = function DiscordFeeMessage(message, fee) {
  var feeString = ''; // eslint-disable-next-line no-restricted-syntax

  for (var key in fee) {
    if (Object.prototype.hasOwnProperty.call(fee, key)) {
      feeString += "".concat(key, ": ").concat(fee[key].fee / 1e2, "% (").concat(fee[key].type, ")\n");
    }
  }

  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Fee Schedule').setDescription("".concat(feeString)).setThumbnail(settings.coin.logo).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.DiscordFeeMessage = DiscordFeeMessage;

var ReactdropCaptchaMessage = function ReactdropCaptchaMessage(userId) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Reactdrop').setDescription("<@".concat(userId, ">'s you have 1 minute to guess")).setImage("attachment://captcha.png").setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.ReactdropCaptchaMessage = ReactdropCaptchaMessage;

var depositAddressMessage = function depositAddressMessage(userId, user) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Deposit').setDescription("<@".concat(userId, ">'s deposit address:\n*").concat(user.wallet.addresses[0].address, "*")).setImage("attachment://qr.png").setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.depositAddressMessage = depositAddressMessage;

var featureDisabledChannelMessage = function featureDisabledChannelMessage(name) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(name).setDescription("This Feature has been disabled for this channel").setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.featureDisabledChannelMessage = featureDisabledChannelMessage;

var featureDisabledServerMessage = function featureDisabledServerMessage(name) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(name).setDescription("This Feature has been disabled for this server").setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.featureDisabledServerMessage = featureDisabledServerMessage;

var featureDisabledGlobalMessage = function featureDisabledGlobalMessage(name) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(name).setDescription("This Feature has been disabled").setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.featureDisabledGlobalMessage = featureDisabledGlobalMessage;

var tipFaucetSuccessMessage = function tipFaucetSuccessMessage(message, amount) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Tip').setDescription("<@".concat(message.author.id, "> tipped ").concat(amount / 1e8, " ").concat(settings.coin.ticker, " to Faucet")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.tipFaucetSuccessMessage = tipFaucetSuccessMessage;

var tipSingleSuccessMessage = function tipSingleSuccessMessage(message, id, listOfUsersRained, amount) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Tip #".concat(id)).setDescription("<@".concat(message.author.id, "> tipped ").concat(amount / 1e8, " ").concat(settings.coin.ticker, " to ").concat(listOfUsersRained[0])).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.tipSingleSuccessMessage = tipSingleSuccessMessage;

var tipMultipleSuccessMessage = function tipMultipleSuccessMessage(message, id, listOfUsersRained, amount, type) {
  var userText = listOfUsersRained.join(", ");
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Tip #".concat(id)).setDescription("<@".concat(message.author.id, "> tipped **").concat(amount * listOfUsersRained.length / 1e8, " ").concat(settings.coin.ticker, "** to ").concat(listOfUsersRained.length, " users\n\nType: **").concat(capitalize(type), "**  \n\n\uD83D\uDCB8 **").concat(amount / 1e8, " ").concat(settings.coin.ticker, "** each \uD83D\uDCB8")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.tipMultipleSuccessMessage = tipMultipleSuccessMessage;

var unableToFindUserTipMessage = function unableToFindUserTipMessage(message, amount) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Tip').setDescription("Unable to find user to tip.").setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.unableToFindUserTipMessage = unableToFindUserTipMessage;

var AfterSuccessMessage = function AfterSuccessMessage(message, id, amount, withoutBots, amountPerUser, type, typeH) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("".concat(type, " #").concat(id)).setDescription("<@".concat(message.author.id, "> ").concat(typeH, " **").concat(amount / 1e8, " ").concat(settings.coin.ticker, "** on ").concat(withoutBots.length, " users\n\uD83D\uDCB8 **").concat(amountPerUser / 1e8, " ").concat(settings.coin.ticker, "** each \uD83D\uDCB8")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.AfterSuccessMessage = AfterSuccessMessage;

var notEnoughActiveUsersMessage = function notEnoughActiveUsersMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, not enough active users")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.notEnoughActiveUsersMessage = notEnoughActiveUsersMessage;

var discordWithdrawalRejectedMessage = function discordWithdrawalRejectedMessage() {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Withdraw").setDescription("Your withdrawal has been rejected").setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.discordWithdrawalRejectedMessage = discordWithdrawalRejectedMessage;

var walletNotFoundMessage = function walletNotFoundMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Wallet not found")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.walletNotFoundMessage = walletNotFoundMessage;

var minimumMessage = function minimumMessage(message, setting, type) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(type).setDescription("<@".concat(message.author.id, ">, Minimum ").concat(type, " is ").concat(setting.min / 1e8, " ").concat(settings.coin.ticker)).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.minimumMessage = minimumMessage;

var timeOutAllAmoutMessageDiscord = function timeOutAllAmoutMessageDiscord(message, operationName, userBeingTipped) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(capitalize(operationName)).setDescription("<@".concat(message.author.id, ">, the request to ").concat(operationName, " ").concat(userBeingTipped ? "".concat(userBeingTipped, " ") : "", "all your ").concat(settings.coin.ticker, " has expired")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.timeOutAllAmoutMessageDiscord = timeOutAllAmoutMessageDiscord;

var canceledAllAmoutMessageDiscord = function canceledAllAmoutMessageDiscord(message, operationName, userBeingTipped) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(capitalize(operationName)).setDescription("<@".concat(message.author.id, ">, you canceled the request to ").concat(operationName, " ").concat(userBeingTipped ? "".concat(userBeingTipped, " ") : "", "all your ").concat(settings.coin.ticker)).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.canceledAllAmoutMessageDiscord = canceledAllAmoutMessageDiscord;

var confirmAllAmoutMessageDiscord = function confirmAllAmoutMessageDiscord(message, operationName, userBeingTipped) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(capitalize(operationName)).setDescription("<@".concat(message.author.id, ">, are you sure that you want to ").concat(operationName, " ").concat(userBeingTipped ? "".concat(userBeingTipped, " ") : "", "all your ").concat(settings.coin.ticker, "?\nAccepted answers: **yes/no/y/n**; \nAuto-cancel in 30 seconds.")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.confirmAllAmoutMessageDiscord = confirmAllAmoutMessageDiscord;

var claimTooFactFaucetMessage = function claimTooFactFaucetMessage(username, distance) {
  var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
  var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
  var seconds = Math.floor(distance % (1000 * 60) / 1000);
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Faucet').setDescription("\u23F1\uFE0F ".concat(username, ", you have to wait ").concat(hours === 1 ? "".concat(hours, " hour") : '').concat(hours > 1 ? "".concat(hours, " hours,") : '', " ").concat(minutes === 1 ? "".concat(minutes, " minute") : '').concat(minutes > 1 ? "".concat(minutes, " minutes and") : '', " ").concat(seconds === 1 ? "".concat(seconds, " second") : '').concat(seconds > 1 ? "".concat(seconds, " seconds") : '', " before claiming the faucet again (the faucet can be claimed every 4 hours).")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.claimTooFactFaucetMessage = claimTooFactFaucetMessage;

var faucetClaimedMessage = function faucetClaimedMessage(id, username, amount) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Faucet #".concat(id)).setDescription("\uD83D\uDCA7 ".concat(username, ", you have been tipped **").concat(amount / 1e8, " ").concat(settings.coin.ticker, "** from the faucet.")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.faucetClaimedMessage = faucetClaimedMessage;

var dryFaucetMessage = function dryFaucetMessage() {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Faucet').setDescription("\uD83C\uDFDC\uFE0F Faucet is dry").setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.dryFaucetMessage = dryFaucetMessage;

var hurricaneMaxUserAmountMessage = function hurricaneMaxUserAmountMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Hurricane').setDescription("<@".concat(message.author.id, ">, Maximum user amount is 50")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.hurricaneMaxUserAmountMessage = hurricaneMaxUserAmountMessage;

var hurricaneInvalidUserAmount = function hurricaneInvalidUserAmount(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Hurricane').setDescription("<@".concat(message.author.id, ">, Invalid amount of users")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.hurricaneInvalidUserAmount = hurricaneInvalidUserAmount;

var thunderstormMaxUserAmountMessage = function thunderstormMaxUserAmountMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('ThunderStorm').setDescription("<@".concat(message.author.id, ">, Maximum user amount is 50")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.thunderstormMaxUserAmountMessage = thunderstormMaxUserAmountMessage;

var thunderstormInvalidUserAmount = function thunderstormInvalidUserAmount(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('ThunderStorm').setDescription("<@".concat(message.author.id, ">, Invalid amount of users")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.thunderstormInvalidUserAmount = thunderstormInvalidUserAmount;

var hurricaneUserZeroAmountMessage = function hurricaneUserZeroAmountMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Hurricane').setDescription("<@".concat(message.author.id, ">, minimum amount of users to thunderstorm is 1")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.hurricaneUserZeroAmountMessage = hurricaneUserZeroAmountMessage;

var thunderstormUserZeroAmountMessage = function thunderstormUserZeroAmountMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('ThunderStorm').setDescription("<@".concat(message.author.id, ">, minimum amount of users to thunderstorm is 1")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.thunderstormUserZeroAmountMessage = thunderstormUserZeroAmountMessage;

var AfterThunderSuccess = function AfterThunderSuccess(message, id, amount, userThunder) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Thunder #".concat(id)).setDescription("\u26C8 ".concat(userThunder, " has been hit with ").concat(amount / 1e8, " ").concat(settings.coin.ticker, " \u26C8")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.AfterThunderSuccess = AfterThunderSuccess;

var invalidPeopleAmountMessage = function invalidPeopleAmountMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Invalid amount of people to win ").concat(title)).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.invalidPeopleAmountMessage = invalidPeopleAmountMessage;

var invalidTimeMessage = function invalidTimeMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Invalid time")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.invalidTimeMessage = invalidTimeMessage;

var noTriviaQuestionFoundMessage = function noTriviaQuestionFoundMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, No trivia question found")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.noTriviaQuestionFoundMessage = noTriviaQuestionFoundMessage;

var invalidEmojiMessage = function invalidEmojiMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, You used an invalid emoji")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.invalidEmojiMessage = invalidEmojiMessage;

var insufficientBalanceMessage = function insufficientBalanceMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Insufficient balance")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.insufficientBalanceMessage = insufficientBalanceMessage;

var userNotFoundMessage = function userNotFoundMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, User not found")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.userNotFoundMessage = userNotFoundMessage;

var invalidAddressMessage = function invalidAddressMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Withdraw').setDescription("<@".concat(message.author.id, ">, Invalid ").concat(settings.coin.name, " Address")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.invalidAddressMessage = invalidAddressMessage;

var invalidAmountMessage = function invalidAmountMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Invalid Amount")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.invalidAmountMessage = invalidAmountMessage;

var minimumWithdrawalMessage = function minimumWithdrawalMessage(message, min) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Withdraw').setDescription("<@".concat(message.author.id, ">, Minimum Withdrawal is ").concat(min / 1e8, " ").concat(settings.coin.ticker)).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.minimumWithdrawalMessage = minimumWithdrawalMessage;

var disablePublicStatsMessage = function disablePublicStatsMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Statistics").setDescription("<@".concat(message.author.id, ">, Public Statistics has been disabled")).setThumbnail(settings.coin.logo).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.disablePublicStatsMessage = disablePublicStatsMessage;

var NotInDirectMessage = function NotInDirectMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Can't use this command in a direct message")).setThumbnail(settings.coin.logo).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.NotInDirectMessage = NotInDirectMessage;

var enablePublicStatsMeMessage = function enablePublicStatsMeMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Statistics").setDescription("<@".concat(message.author.id, ">, Public Statistic has been enabled")).setThumbnail(settings.coin.logo).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.enablePublicStatsMeMessage = enablePublicStatsMeMessage;

var notEnoughUsersToTip = function notEnoughUsersToTip(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Tip").setDescription("<@".concat(message.author.id, ">, Not enough users to tip")).setThumbnail(settings.coin.logo).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.notEnoughUsersToTip = notEnoughUsersToTip;

var statsMessage = function statsMessage(message, _statsMessage) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Statistics").setDescription("<@".concat(message.author.id, ">, ").concat(_statsMessage)).setThumbnail(settings.coin.logo).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.statsMessage = statsMessage;

var ReactDropReturnInitiatorMessage = function ReactDropReturnInitiatorMessage() {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Reactdrop").setDescription("Nobody claimed, returning funds to reactdrop initiator").setThumbnail(settings.coin.logo).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.ReactDropReturnInitiatorMessage = ReactDropReturnInitiatorMessage;

var discordWelcomeMessage = function discordWelcomeMessage(userInfo) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Bot").setDescription("Welcome <@".concat(userInfo.id, ">, we created a wallet for you.\nType \"").concat(settings.bot.command.discord, " help\" for usage info")).setThumbnail(settings.coin.logo).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.discordWelcomeMessage = discordWelcomeMessage;

var discordBotMaintenanceMessage = function discordBotMaintenanceMessage() {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Bot").setDescription("Discord tipbot maintenance").setThumbnail(settings.coin.logo).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.discordBotMaintenanceMessage = discordBotMaintenanceMessage;

var discordBotDisabledMessage = function discordBotDisabledMessage() {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Bot").setDescription("Discord tipbot disabled").setThumbnail(settings.coin.logo).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.discordBotDisabledMessage = discordBotDisabledMessage;

var triviaReturnInitiatorMessage = function triviaReturnInitiatorMessage() {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Trivia").setDescription("Nobody claimed, returning funds to trivia initiator").setThumbnail(settings.coin.logo).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.triviaReturnInitiatorMessage = triviaReturnInitiatorMessage;

var warnDirectMessage = function warnDirectMessage(userId, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(userId, ">, I've sent you a direct message.")).setThumbnail(settings.coin.logo).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.warnDirectMessage = warnDirectMessage;

var helpMessageOne = function helpMessageOne(withdraw) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("".concat("".concat(settings.bot.name, " v").concat(_package["default"].version), " Help")).setDescription("`".concat(settings.bot.command.discord, "`\nDisplays this message\n\n`").concat(settings.bot.command.discord, " help`\nDisplays this message\n\n`").concat(settings.bot.command.discord, " info`\nDisplays coin info\n\n`").concat(settings.bot.command.discord, " balance`\nDisplays your balance\n\n`").concat(settings.bot.command.discord, " price`\nDisplays ").concat(settings.coin.ticker, " price\n\n`").concat(settings.bot.command.discord, " stats`\nDisplays your tip statistics\n\n`").concat(settings.bot.command.discord, " deposit`\nDisplays your deposit address\n\n`").concat(settings.bot.command.discord, " fees`\nDisplays fee schedule\n\n`").concat(settings.bot.command.discord, " publicstats`\nEnable/Disable public statistics (determines if you want to be shown on the leaderboards) \ndefault: disabled\n\n`").concat(settings.bot.command.discord, " withdraw <address> <amount|all>`\nWithdraws the entered amount to a ").concat(settings.coin.name, " address of your choice\nexample: `").concat(settings.bot.command.discord, " withdraw ").concat(settings.coin.exampleAddress, " 5.20 `\nNote: Minimal amount to withdraw: ").concat(withdraw.min / 1e8, " ").concat(settings.coin.ticker, ". A withdrawal fee of ").concat(withdraw.fee / 1e2, "% ").concat(settings.coin.ticker, ". half of the withdrawal fee will be automatically deducted from the amount and will be donated to the common faucet pot.\n")); // .setTimestamp()
  // .setFooter({
  //  text: `${settings.bot.name} v${pjson.version}`,
  //  iconURL: settings.coin.logo,
  // });

  return result;
};

exports.helpMessageOne = helpMessageOne;

var helpMessageTwo = function helpMessageTwo(withdraw) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color) // .setTitle(`${`${settings.bot.name} v${pjson.version}`} Help`)
  .setDescription("`".concat(settings.bot.command.discord, " <@user> <amount|all>`\nTips the @ mentioned user with the desired amount\nexample: `").concat(settings.bot.command.discord, " @test123456#7890 1.00`\n\n`").concat(settings.bot.command.discord, " <@user> <@user> <@user> <amount|all> [split|each]`\nTips the @ mentioned users with the desired amount\nexample: `").concat(settings.bot.command.discord, " @test123456#7890 @test123457#7890 1.00 each`\n\n`").concat(settings.bot.command.discord, " rain <amount|all> [<@role>]`\nRains the desired amount onto all online users (optionally, within specified role)\nexample: `").concat(settings.bot.command.discord, " rain 10`, `").concat(settings.bot.command.discord, " rain 10 @supporters`\n\n`").concat(settings.bot.command.discord, " soak <amount|all> [<@role>]`\nSoaks the desired amount onto all online and idle users (optionally, within specified role)\nexample: `").concat(settings.bot.command.discord, " soak 3.00`\n\n`").concat(settings.bot.command.discord, " flood <amount|all> [<@role>]`\nFloods the desired amount onto all users (including offline users) (optionally, within specified role)\nexample: `").concat(settings.bot.command.discord, " flood 5.00`, `").concat(settings.bot.command.discord, " flood 5.00 @supporters`\n\n`").concat(settings.bot.command.discord, " sleet <amount|all> [<time>] [<@role>]`\nMakes a sleet storm with the desired amount onto all users that have been active in the channel in the last 15 minutes (optionally, within specified role\nexample: `").concat(settings.bot.command.discord, " sleet 5.00`, `").concat(settings.bot.command.discord, " sleet 5.00 @supporters`, `").concat(settings.bot.command.discord, " sleet 5.00 10m @supporters`\n\n`").concat(settings.bot.command.discord, " voicerain <amount|all> <@voiceChannel> [<@role>]`\nRains the desired amount onto all listening users in the mentioned voice channel.\nexample: `").concat(settings.bot.command.discord, " voicerain 5.00 #General`, `").concat(settings.bot.command.discord, " voicerain 5.00 #General @supporters`\nNOTE: To mention a voice channel, get the channel ID ([read here how](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)) and enclose it with <# and >\n\n`").concat(settings.bot.command.discord, " thunder <amount|all> [<@role>]`\nTips a random lucky online user with the amount (optionally, within specified role)\nexample: `").concat(settings.bot.command.discord, " thunder 5`, `").concat(settings.bot.command.discord, " thunder 5 @supporters`\n\n`").concat(settings.bot.command.discord, " thunderstorm <numberOfUsers> <amount|all> [<@role>]`\nTips a specified number (max: 50) random lucky online users with part of the amount (optionally, within specified role)\nexample: `").concat(settings.bot.command.discord, " thunderstorm 10 5.00`, `").concat(settings.bot.command.discord, " thunderstorm 10 5.00 @supporters`\n\n`").concat(settings.bot.command.discord, " hurricane <numberOfUsers> <amount|all> [<@role>]`\nTips a specified number (max: 50) random lucky online and idle users with part of the amount (optionally, within specified role)\nexample: `").concat(settings.bot.command.discord, " hurricane 10 5.00`, `").concat(settings.bot.command.discord, " hurricane 10 5.00 @supporters`\n\n`").concat(settings.bot.command.discord, " faucet`\nGets an amount from the faucet (applicable every 4 hours)\n\n`").concat(settings.bot.command.discord, " reactdrop <amount> [<time>] [<emoji>]`\nPerforms a react airdrop with the amount, optionally within custom time, optionally using a custom-supplied emoji. <time> parameter accepts time interval expressions in the form of:`60s`, `5m`, `1h`. Default time interval is `5m`(5minutes), e.g. `").concat(settings.bot.command.discord, " reactdrop 10 20m`, `").concat(settings.bot.command.discord, " reactdrop 10 3h \uD83D\uDE03`\n\n`").concat(settings.bot.command.discord, " trivia <amount> [<amountOfPeople>] [<time>]`\nPerforms a trivia with the amount, optionally with set amount of of people, optionally within custom time. <time> parameter accepts time interval expressions in the form of:`60s`, `5m`, `1h`. Default time interval is `5m`(5minutes), e.g. `").concat(settings.bot.command.discord, " trivia 5`, `").concat(settings.bot.command.discord, " trivia 5 3 40s`\n\n`").concat(settings.bot.command.discord, " ignoreme`\nTurns @mentioning you during mass operations on/off\n\n**Like the bot?**\n[Invite it to your server](").concat(settings.bot.url.discord, ")")).setTimestamp().setFooter({
    text: "".concat(settings.bot.name, " v").concat(_package["default"].version),
    iconURL: settings.coin.logo
  });
  return result;
};

exports.helpMessageTwo = helpMessageTwo;