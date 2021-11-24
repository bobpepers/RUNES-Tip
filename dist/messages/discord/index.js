"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.warnDirectMessage = exports.walletNotFoundMessage = exports.userNotFoundMessage = exports.unableToFindUserTipMessage = exports.unIngoreMeMessage = exports.transactionNotFoundMessage = exports.tipSuccessMessage = exports.thunderstormUserZeroAmountMessage = exports.thunderstormMaxUserAmountMessage = exports.thunderstormInvalidUserAmount = exports.reviewMessage = exports.reactDropMessage = exports.notEnoughActiveUsersMessage = exports.minimumWithdrawalMessage = exports.minimumTimeReactDropMessage = exports.minimumMessage = exports.invalidTimeMessage = exports.invalidEmojiMessage = exports.invalidAmountMessage = exports.invalidAddressMessage = exports.insufficientBalanceMessage = exports.ignoreMeMessage = exports.hurricaneUserZeroAmountMessage = exports.hurricaneMaxUserAmountMessage = exports.hurricaneInvalidUserAmount = exports.helpMessage = exports.faucetClaimedMessage = exports.dryFaucetMessage = exports.discordWithdrawalAcceptedMessage = exports.discordUserWithdrawalRejectMessage = exports.discordUserBannedMessage = exports.discordServerBannedMessage = exports.discordIncomingDepositMessage = exports.discordDepositConfirmedMessage = exports.discordChannelBannedMessage = exports.depositAddressMessage = exports.coinInfoMessage = exports.claimTooFactFaucetMessage = exports.balanceMessage = exports.ReactdropCaptchaMessage = exports.AfterThunderSuccess = exports.AfterThunderStormSuccess = exports.AfterSuccessMessage = exports.AfterReactDropSuccessMessage = exports.AfterHurricaneSuccess = void 0;

var _discord = require("discord.js");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _package = _interopRequireDefault(require("../../../package.json"));

var discordUserBannedMessage = function discordUserBannedMessage(user) {
  var result = new _discord.MessageEmbed().setColor("#C70039").setTitle('🚫     User Banned     🚫').setDescription("Reason:\n".concat(user.banMessage)).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.discordUserBannedMessage = discordUserBannedMessage;

var discordServerBannedMessage = function discordServerBannedMessage(server) {
  var result = new _discord.MessageEmbed().setColor("#C70039").setTitle('🚫     Server Banned     🚫').setDescription("Reason:\n".concat(server.banMessage)).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.discordServerBannedMessage = discordServerBannedMessage;

var discordChannelBannedMessage = function discordChannelBannedMessage(channel) {
  var result = new _discord.MessageEmbed().setColor('#FF7900').setTitle('❗     Channel Restricted     ❗').setDescription("Reason:\n".concat(channel.banMessage)).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.discordChannelBannedMessage = discordChannelBannedMessage;

var coinInfoMessage = function coinInfoMessage(blockHeight, priceInfo) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Tipbot').addField("Coin Info", _settings["default"].coin.description).addField("\u200B", "\u200B").addFields({
    name: "Coin Name",
    value: _settings["default"].coin.name,
    inline: true
  }, {
    name: "Ticker",
    value: _settings["default"].coin.ticker,
    inline: true
  }).addField("\u200B", "\u200B").addFields({
    name: "Current block height",
    value: "".concat(blockHeight),
    inline: true
  }, {
    name: "Wallet version",
    value: "0",
    inline: true
  }).addField("\u200B", "\u200B").addField("Website", _settings["default"].coin.website).addField("Github", _settings["default"].coin.github).addField("Block Explorer", _settings["default"].coin.explorer).addField("Discord Server", _settings["default"].coin.discord).addField("Telegram Group", _settings["default"].coin.telegram).addField("Exchanges", _settings["default"].coin.exchanges.join('\n')).addField("Current price", "$".concat(priceInfo.price, " (source: coinpaprika)")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.coinInfoMessage = coinInfoMessage;

var reactDropMessage = function reactDropMessage(distance, author, emoji, amount) {
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance % (1000 * 60 * 60 * 24 * 60) / (1000 * 60 * 60 * 24));
  var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
  var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
  var seconds = Math.floor(distance % (1000 * 60) / 1000);
  var ended = days < 1 && hours < 1 && minutes < 1 && seconds < 1;
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Reactdrop').setDescription(":tada: <@".concat(author, "> has started a react airdrop! :tada:\n\n:information_source: React to this message ONLY with ").concat(emoji, " to win a share in ").concat(amount / 1e8, " ").concat(_settings["default"].coin.ticker, "! You will also be presented with a simple math question in your direct messages which you need to solve to be eligible.\n\n").concat(!ended ? ":clock9: Time remaining ".concat(days > 0 ? "".concat(days, " days") : '', "  ").concat(hours > 0 ? "".concat(hours, " hours") : '', " ").concat(minutes > 0 ? "".concat(minutes, " minutes") : '', " ").concat(seconds > 0 ? "".concat(seconds, " seconds") : '') : "Ended", "\n")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.reactDropMessage = reactDropMessage;

var AfterReactDropSuccessMessage = function AfterReactDropSuccessMessage(endReactDrop, amountEach, initiator) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Reactdrop').setDescription(":tada:React airdrop started by <@".concat(initiator, "> has finished!:tada:\n    \n:money_with_wings:").concat(endReactDrop.reactdroptips.length, " user(s) will share ").concat(endReactDrop.amount / 1e8, " ").concat(_settings["default"].coin.ticker, " (").concat(amountEach / 1e8, " each)!:money_with_wings:")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.AfterReactDropSuccessMessage = AfterReactDropSuccessMessage;

var minimumTimeReactDropMessage = function minimumTimeReactDropMessage(message) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Reactdrop').setDescription("Minimum time for reactdrop is 60 seconds (60s)").setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.minimumTimeReactDropMessage = minimumTimeReactDropMessage;

var ignoreMeMessage = function ignoreMeMessage(message) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Ignore me').setDescription("<@".concat(message.author.id, ">, you will no longer be @mentioned while receiving rains, soaks and other mass operations, but will continue to receive coins from them.\nIf you wish to be @mentioned, please issue this command again.")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.ignoreMeMessage = ignoreMeMessage;

var unIngoreMeMessage = function unIngoreMeMessage(message) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Ignore me').setDescription("<@".concat(message.author.id, ">, you will again be @mentioned while receiving rains, soaks and other mass operations.\nIf you do not wish to be @mentioned, please issue this command again.")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.unIngoreMeMessage = unIngoreMeMessage;

var discordDepositConfirmedMessage = function discordDepositConfirmedMessage(amount) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Deposit').setDescription("Deposit Confirmed \n".concat(amount, " ").concat(_settings["default"].coin.ticker, " has been credited to your wallet")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.discordDepositConfirmedMessage = discordDepositConfirmedMessage;

var discordIncomingDepositMessage = function discordIncomingDepositMessage(res) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Deposit').setDescription("incoming deposit detected for ".concat(res.locals.amount, " ").concat(_settings["default"].coin.ticker, "\nBalance will be reflected in your wallet in ~").concat(_settings["default"].min.confirmations, "+ confirmations\n").concat(_settings["default"].coin.explorer, "/tx/").concat(res.locals.transaction[0].txid)).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.discordIncomingDepositMessage = discordIncomingDepositMessage;

var discordUserWithdrawalRejectMessage = function discordUserWithdrawalRejectMessage(title) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Withdraw').setDescription("Your withdrawal has been rejected").setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
}; // transactionNotFoundMessage


exports.discordUserWithdrawalRejectMessage = discordUserWithdrawalRejectMessage;

var transactionNotFoundMessage = function transactionNotFoundMessage(title) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle(title).setDescription("Transaction not found").setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.transactionNotFoundMessage = transactionNotFoundMessage;

var discordWithdrawalAcceptedMessage = function discordWithdrawalAcceptedMessage(updatedTrans) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Withdraw').setDescription("Your withdrawal has been accepted\n".concat(_settings["default"].coin.explorer, "/tx/").concat(updatedTrans.txid)).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.discordWithdrawalAcceptedMessage = discordWithdrawalAcceptedMessage;

var balanceMessage = function balanceMessage(userId, user, priceInfo) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Balance').setDescription("<@".concat(userId, ">'s current available balance: ").concat(user.wallet.available / 1e8, " ").concat(_settings["default"].coin.ticker, "\n<@").concat(userId, ">'s current locked balance: ").concat(user.wallet.locked / 1e8, " ").concat(_settings["default"].coin.ticker, "\nEstimated value of <@").concat(userId, ">'s balance: $").concat(((user.wallet.available + user.wallet.locked) / 1e8 * priceInfo.price).toFixed(2))).setThumbnail(_settings["default"].coin.logo).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.balanceMessage = balanceMessage;

var ReactdropCaptchaMessage = function ReactdropCaptchaMessage(userId) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Reactdrop').setDescription("<@".concat(userId, ">'s you have 1 minute to guess")).setImage("attachment://captcha.png").setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.ReactdropCaptchaMessage = ReactdropCaptchaMessage;

var depositAddressMessage = function depositAddressMessage(userId, user) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Deposit').setDescription("<@".concat(userId, ">'s deposit address:\n*").concat(user.wallet.addresses[0].address, "*")).setImage("attachment://qr.png").setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.depositAddressMessage = depositAddressMessage;

var tipSuccessMessage = function tipSuccessMessage(userId, tempUsername, amount) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Tip').setDescription("<@".concat(userId, "> tipped ").concat(amount / 1e8, " ").concat(_settings["default"].coin.ticker, " to ").concat(tempUsername)).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.tipSuccessMessage = tipSuccessMessage;

var unableToFindUserTipMessage = function unableToFindUserTipMessage(message, amount) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Tip').setDescription("Unable to find user to tip.").setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.unableToFindUserTipMessage = unableToFindUserTipMessage;

var AfterSuccessMessage = function AfterSuccessMessage(message, amount, withoutBots, amountPerUser, type, typeH) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle(type).setDescription("<@".concat(message.author.id, "> ").concat(typeH, " ").concat(amount / 1e8, " ").concat(_settings["default"].coin.ticker, " on ").concat(withoutBots.length, " users -- ").concat(amountPerUser / 1e8, " ").concat(_settings["default"].coin.ticker, " each")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.AfterSuccessMessage = AfterSuccessMessage;

var notEnoughActiveUsersMessage = function notEnoughActiveUsersMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, not enough active users")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.notEnoughActiveUsersMessage = notEnoughActiveUsersMessage;

var walletNotFoundMessage = function walletNotFoundMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Wallet not found")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.walletNotFoundMessage = walletNotFoundMessage;

var minimumMessage = function minimumMessage(message, type) {
  var minAmount;

  if (type === 'Sleet') {
    minAmount = _settings["default"].min.discord.sleet;
  }

  if (type === 'Rain') {
    minAmount = _settings["default"].min.discord.rain;
  }

  if (type === 'Flood') {
    minAmount = _settings["default"].min.discord.flood;
  }

  if (type === 'Tip') {
    minAmount = _settings["default"].min.discord.tip;
  }

  if (type === 'Soak') {
    minAmount = _settings["default"].min.discord.soak;
  }

  if (type === 'ReactDrop') {
    minAmount = _settings["default"].min.discord.reactdrop;
  }

  if (type === 'Thunder') {
    minAmount = _settings["default"].min.discord.thunder;
  }

  if (type === 'ThunderStorm') {
    minAmount = _settings["default"].min.discord.thunderstorm;
  }

  if (type === 'Hurricane') {
    minAmount = _settings["default"].min.discord.hurricane;
  }

  if (type === 'VoiceRain') {
    minAmount = _settings["default"].min.discord.voicerain;
  }

  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle(type).setDescription("<@".concat(message.author.id, ">, Minimum ").concat(type, " is ").concat(Number(minAmount) / 1e8, " ").concat(_settings["default"].coin.ticker)).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.minimumMessage = minimumMessage;

var claimTooFactFaucetMessage = function claimTooFactFaucetMessage(message, username, distance) {
  var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
  var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
  var seconds = Math.floor(distance % (1000 * 60) / 1000);
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Faucet').setDescription("".concat(username, ", you have to wait ").concat(hours === 1 ? "".concat(hours, " hour") : '', " ").concat(hours > 1 ? "".concat(hours, " hours") : '', ", ").concat(minutes === 1 ? "".concat(minutes, " minute") : '', " ").concat(minutes > 1 ? "".concat(minutes, " minutes") : '', " and ").concat(seconds === 1 ? "".concat(seconds, " second") : '', " ").concat(seconds > 1 ? "".concat(seconds, " seconds") : '', " before claiming the faucet again (the faucet can be claimed every 4 hours).")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.claimTooFactFaucetMessage = claimTooFactFaucetMessage;

var faucetClaimedMessage = function faucetClaimedMessage(message, username, amount) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Faucet').setDescription("".concat(username, ", you have been tipped ").concat(amount / 1e8, " ").concat(_settings["default"].coin.ticker, " from the faucet.")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.faucetClaimedMessage = faucetClaimedMessage;

var dryFaucetMessage = function dryFaucetMessage(message) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Faucet').setDescription("Faucet is dry").setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.dryFaucetMessage = dryFaucetMessage;

var hurricaneMaxUserAmountMessage = function hurricaneMaxUserAmountMessage(message) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Hurricane').setDescription("<@".concat(message.author.id, ">, Maximum user amount is 50")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.hurricaneMaxUserAmountMessage = hurricaneMaxUserAmountMessage;

var hurricaneInvalidUserAmount = function hurricaneInvalidUserAmount(message) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Hurricane').setDescription("<@".concat(message.author.id, ">, Invalid amount of users")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.hurricaneInvalidUserAmount = hurricaneInvalidUserAmount;

var thunderstormMaxUserAmountMessage = function thunderstormMaxUserAmountMessage(message) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('ThunderStorm').setDescription("<@".concat(message.author.id, ">, Maximum user amount is 50")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.thunderstormMaxUserAmountMessage = thunderstormMaxUserAmountMessage;

var thunderstormInvalidUserAmount = function thunderstormInvalidUserAmount(message) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('ThunderStorm').setDescription("<@".concat(message.author.id, ">, Invalid amount of users")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.thunderstormInvalidUserAmount = thunderstormInvalidUserAmount;

var hurricaneUserZeroAmountMessage = function hurricaneUserZeroAmountMessage(message) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Hurricane').setDescription("<@".concat(message.author.id, ">, minimum amount of users to thunderstorm is 1")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.hurricaneUserZeroAmountMessage = hurricaneUserZeroAmountMessage;

var thunderstormUserZeroAmountMessage = function thunderstormUserZeroAmountMessage(message) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('ThunderStorm').setDescription("<@".concat(message.author.id, ">, minimum amount of users to thunderstorm is 1")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.thunderstormUserZeroAmountMessage = thunderstormUserZeroAmountMessage;

var AfterHurricaneSuccess = function AfterHurricaneSuccess(message, amount, amountPerUser, listOfUsersRained) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Hurricane').setDescription("".concat(listOfUsersRained.map(function (user) {
    return "\u26C8 ".concat(user, " has been hit by hurricane with ").concat(amountPerUser / 1e8, " ").concat(_settings["default"].coin.ticker, " \u26C8");
  }).join("\n"))) // .setDescription(`⛈ ${userThunder} has been thunderstruck with ${amount / 1e8} ${settings.coin.ticker} ⛈`)
  .setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.AfterHurricaneSuccess = AfterHurricaneSuccess;

var AfterThunderStormSuccess = function AfterThunderStormSuccess(message, amount, amountPerUser, listOfUsersRained) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('ThunderStorm').setDescription("".concat(listOfUsersRained.map(function (user) {
    console.log('user');
    console.log(user);
    return "\u26C8 ".concat(user, " has been thunderstruck with ").concat(amountPerUser / 1e8, " ").concat(_settings["default"].coin.ticker, " \u26C8");
  }).join("\n"))) // .setDescription(`⛈ ${userThunder} has been thunderstruck with ${amount / 1e8} ${settings.coin.ticker} ⛈`)
  .setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.AfterThunderStormSuccess = AfterThunderStormSuccess;

var AfterThunderSuccess = function AfterThunderSuccess(message, amount, userThunder) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Thunder').setDescription("\u26C8 ".concat(userThunder, " has been thunderstruck with ").concat(amount / 1e8, " ").concat(_settings["default"].coin.ticker, " \u26C8")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.AfterThunderSuccess = AfterThunderSuccess;

var reviewMessage = function reviewMessage(message) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Withdraw').setDescription("<@".concat(message.author.id, ">, Your withdrawal is being reviewed")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.reviewMessage = reviewMessage;

var invalidTimeMessage = function invalidTimeMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Invalid time")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.invalidTimeMessage = invalidTimeMessage;

var invalidEmojiMessage = function invalidEmojiMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, You used an invalid emoji")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.invalidEmojiMessage = invalidEmojiMessage;

var insufficientBalanceMessage = function insufficientBalanceMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Insufficient balance")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.insufficientBalanceMessage = insufficientBalanceMessage;

var userNotFoundMessage = function userNotFoundMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, User not found")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.userNotFoundMessage = userNotFoundMessage;

var invalidAddressMessage = function invalidAddressMessage(message) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Withdraw').setDescription("<@".concat(message.author.id, ">, Invalid Runebase Address")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.invalidAddressMessage = invalidAddressMessage;

var invalidAmountMessage = function invalidAmountMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Invalid Amount")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.invalidAmountMessage = invalidAmountMessage;

var minimumWithdrawalMessage = function minimumWithdrawalMessage(message) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle('Withdraw').setDescription("<@".concat(message.author.id, ">, Minimum Withdrawal is ").concat(Number(_settings["default"].min.withdrawal) / 1e8, " ").concat(_settings["default"].coin.ticker)).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.minimumWithdrawalMessage = minimumWithdrawalMessage;

var warnDirectMessage = function warnDirectMessage(userId, title) {
  var result = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle(title).setDescription("<@".concat(userId, ">, I've sent you a direct message.")).setThumbnail(_settings["default"].coin.logo).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
  return result;
};

exports.warnDirectMessage = warnDirectMessage;
var helpMessage = new _discord.MessageEmbed().setColor(_settings["default"].bot.color).setTitle("".concat("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), " Help")).setDescription("`".concat(_settings["default"].bot.command.discord, "`\nDisplays this message\n\n`").concat(_settings["default"].bot.command.discord, " help`\nDisplays this message\n\n`").concat(_settings["default"].bot.command.discord, " info`\nDisplays coin info\n\n`").concat(_settings["default"].bot.command.discord, " balance`\nDisplays your balance\n\n`").concat(_settings["default"].bot.command.discord, " deposit`\nDisplays your deposit address\n\n`").concat(_settings["default"].bot.command.discord, " withdraw <address> <amount|all> `\nWithdraws the entered amount to a ").concat(_settings["default"].coin.name, " address of your choice\nexample: `").concat(_settings["default"].bot.command.discord, " withdraw ").concat(_settings["default"].coin.exampleAddress, " 5.20 `\nNote: Minimal amount to withdraw: ").concat(_settings["default"].min.withdrawal / 1e8, " ").concat(_settings["default"].coin.ticker, ". A withdrawal fee of ").concat(_settings["default"].fee.withdrawal / 1e8, " ").concat(_settings["default"].coin.ticker, " will be automatically deducted from the amount and will be donated to the common faucet pot.\n\n`").concat(_settings["default"].bot.command.discord, " <@user> <amount|all>`\nTips the @ mentioned user with the desired amount\nexample: `").concat(_settings["default"].bot.command.discord, " @test123456#7890 1.00`\n\n`").concat(_settings["default"].bot.command.discord, " rain <amount|all>`\nRains the desired amount onto all online users (optionally, within specified role)\nexample: `").concat(_settings["default"].bot.command.discord, " rain 10`\n\n`").concat(_settings["default"].bot.command.discord, " soak <amount|all>`\nSoaks the desired amount onto all online and idle users (optionally, within specified role)\nexample: `").concat(_settings["default"].bot.command.discord, " soak 3.00`\n\n`").concat(_settings["default"].bot.command.discord, " flood <amount|all>`\nFloods the desired amount onto all users (including offline users) (optionally, within specified role)\nexample: `").concat(_settings["default"].bot.command.discord, " flood 5.00`\n\n`").concat(_settings["default"].bot.command.discord, " sleet <amount|all>`\nMakes a sleet storm with the desired amount onto all users that have been active in the channel in the last 15 minutes (optionally, within specified role\n\n`").concat(_settings["default"].bot.command.discord, " voicerain <amount|all> <@voiceChannel>`\nRains the desired amount onto all listening users in the mentioned voice channel.\nexample: `").concat(_settings["default"].bot.command.discord, " voicerain 5.00 #General`\nNOTE: To mention a voice channel, get the channel ID ([read here how](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)) and enclose it with <# and >\n\n`").concat(_settings["default"].bot.command.discord, " thunder <amount|all>`\nTips a random lucky online user with the amount (optionally, within specified role)\nexample: `").concat(_settings["default"].bot.command.discord, " thunder 5`\n\n`").concat(_settings["default"].bot.command.discord, " thunderstorm <numberOfUsers> <amount|all>`\nTips a specified number (max: 50) random lucky online users with part of the amount (optionally, within specified role)\nexample: `").concat(_settings["default"].bot.command.discord, " thunderstorm 10 5.00`\n\n`").concat(_settings["default"].bot.command.discord, " hurricane <numberOfUsers> <amount|all>`\nTips a specified number (max: 50) random lucky online and idle users with part of the amount (optionally, within specified role)\nexample: `").concat(_settings["default"].bot.command.discord, " hurricane 10 5.00`\n\n`").concat(_settings["default"].bot.command.discord, " faucet`\nGets an amount from the faucet (applicable every 4 hours)\n\n`").concat(_settings["default"].bot.command.discord, " reactdrop <amount> [<time>] [<emoji>]`\nPerforms a react airdrop with the amount, optionally within custom time, optionally using a custom-supplied emoji. <time> parameter accepts time interval expressions in the form of:`60s`, `5m`, `1h`. Default time interval is `5m`(5minutes), e.g. `!arrrtip reactdrop 10 20m`, `!arrrtip reactdrop 10 3h \uD83D\uDE03`\n\n`").concat(_settings["default"].bot.command.discord, " ignoreme`\nTurns @mentioning you during mass operations on/off\n\n**Like the bot?**\n[Invite it to your server](").concat(_settings["default"].bot.url.discord, ")")).setTimestamp().setFooter("".concat(_settings["default"].bot.name, " v").concat(_package["default"].version), _settings["default"].coin.logo);
exports.helpMessage = helpMessage;