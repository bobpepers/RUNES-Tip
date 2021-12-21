"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.warnDirectMessage = exports.walletNotFoundMessage = exports.userNotFoundMessage = exports.unableToFindUserTipMessage = exports.unIngoreMeMessage = exports.transactionNotFoundMessage = exports.tipSuccessMessage = exports.timeOutAllAmoutMessageDiscord = exports.thunderstormUserZeroAmountMessage = exports.thunderstormMaxUserAmountMessage = exports.thunderstormInvalidUserAmount = exports.statsMessage = exports.reviewMessage = exports.reactDropMessage = exports.notEnoughUsersToTip = exports.notEnoughActiveUsersMessage = exports.minimumWithdrawalMessage = exports.minimumTimeReactDropMessage = exports.minimumMessage = exports.maxTimeReactdropMessage = exports.invalidTimeMessage = exports.invalidEmojiMessage = exports.invalidAmountMessage = exports.invalidAddressMessage = exports.insufficientBalanceMessage = exports.ignoreMeMessage = exports.hurricaneUserZeroAmountMessage = exports.hurricaneMaxUserAmountMessage = exports.hurricaneInvalidUserAmount = exports.helpMessage = exports.featureDisabledServerMessage = exports.featureDisabledGlobalMessage = exports.featureDisabledChannelMessage = exports.faucetClaimedMessage = exports.enablePublicStatsMeMessage = exports.dryFaucetMessage = exports.discordWithdrawalRejectedMessage = exports.discordWithdrawalAcceptedMessage = exports.discordUserWithdrawalRejectMessage = exports.discordUserBannedMessage = exports.discordServerBannedMessage = exports.discordLimitSpamMessage = exports.discordIncomingDepositMessage = exports.discordDepositConfirmedMessage = exports.discordChannelBannedMessage = exports.disablePublicStatsMessage = exports.depositAddressMessage = exports.confirmAllAmoutMessageDiscord = exports.coinInfoMessage = exports.claimTooFactFaucetMessage = exports.canceledAllAmoutMessageDiscord = exports.balanceMessage = exports.ReactdropCaptchaMessage = exports.NotInDirectMessage = exports.DiscordFeeMessage = exports.AfterThunderSuccess = exports.AfterThunderStormSuccess = exports.AfterSuccessMessage = exports.AfterReactDropSuccessMessage = exports.AfterHurricaneSuccess = void 0;

var _discord = require("discord.js");

var _settings = _interopRequireDefault(require("../../config/settings"));

var _package = _interopRequireDefault(require("../../../package.json"));

var settings = (0, _settings["default"])();

var capitalize = function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
};

var discordUserBannedMessage = function discordUserBannedMessage(user) {
  var result = new _discord.MessageEmbed().setColor("#C70039").setTitle('🚫     User Banned     🚫').setDescription("Reason:\n".concat(user.banMessage)).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.discordUserBannedMessage = discordUserBannedMessage;

var discordServerBannedMessage = function discordServerBannedMessage(server) {
  var result = new _discord.MessageEmbed().setColor("#C70039").setTitle('🚫     Server Banned     🚫').setDescription("Reason:\n".concat(server.banMessage)).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.discordServerBannedMessage = discordServerBannedMessage;

var discordChannelBannedMessage = function discordChannelBannedMessage(channel) {
  var result = new _discord.MessageEmbed().setColor('#FF7900').setTitle('❗     Channel Restricted     ❗').setDescription("Reason:\n".concat(channel.banMessage)).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
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
  }).addField("\u200B", "\u200B").addField("Website", settings.coin.website).addField("Github", settings.coin.github).addField("Block Explorer", settings.coin.explorer).addField("Discord Server", settings.coin.discord).addField("Telegram Group", settings.coin.telegram).addField("Exchanges", settings.coin.exchanges.join('\n')).addField("Current price", "$".concat(priceInfo.price, " (source: coinpaprika)")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
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
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Reactdrop').setDescription(":tada: <@".concat(author, "> has started a react airdrop! :tada:\n\n:information_source: React to this message ONLY with ").concat(emoji, " to win a share in ").concat(amount / 1e8, " ").concat(settings.coin.ticker, "! You will also be presented with a simple math question in your direct messages which you need to solve to be eligible.\n\n").concat(!ended ? ":clock9: Time remaining ".concat(days > 0 ? "".concat(days, " days") : '', "  ").concat(hours > 0 ? "".concat(hours, " hours") : '', " ").concat(minutes > 0 ? "".concat(minutes, " minutes") : '', " ").concat(seconds > 0 ? "".concat(seconds, " seconds") : '') : "Ended", "\n")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.reactDropMessage = reactDropMessage;

var AfterReactDropSuccessMessage = function AfterReactDropSuccessMessage(endReactDrop, amountEach, initiator) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Reactdrop').setDescription(":tada:[React airdrop](https://discord.com/channels/".concat(endReactDrop.group.groupId.replace("discord-", ""), "/").concat(endReactDrop.channel.channelId.replace("discord-", ""), "/").concat(endReactDrop.discordMessageId, ") started by <@").concat(initiator, "> has finished!:tada:\n    \n:money_with_wings:").concat(endReactDrop.reactdroptips.length, " user(s) will share ").concat(endReactDrop.amount / 1e8, " ").concat(settings.coin.ticker, " (").concat(amountEach / 1e8, " each)!:money_with_wings:")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.AfterReactDropSuccessMessage = AfterReactDropSuccessMessage;

var discordLimitSpamMessage = function discordLimitSpamMessage(message, myFunctionName) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(myFunctionName).setDescription("\uD83D\uDEAB Slow down! \uD83D\uDEAB\n<@".concat(message.author.id, ">, you're using this command too fast, wait a while before using it again.")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.discordLimitSpamMessage = discordLimitSpamMessage;

var minimumTimeReactDropMessage = function minimumTimeReactDropMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Reactdrop').setDescription("Minimum time for reactdrop is 60 seconds (60s)").setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.minimumTimeReactDropMessage = minimumTimeReactDropMessage;

var maxTimeReactdropMessage = function maxTimeReactdropMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Reactdrop').setDescription("Maximum time is 2 days").setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.maxTimeReactdropMessage = maxTimeReactdropMessage;

var ignoreMeMessage = function ignoreMeMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Ignore me').setDescription("<@".concat(message.author.id, ">, you will no longer be @mentioned while receiving rains, soaks and other mass operations, but will continue to receive coins from them.\nIf you wish to be @mentioned, please issue this command again.")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.ignoreMeMessage = ignoreMeMessage;

var unIngoreMeMessage = function unIngoreMeMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Ignore me').setDescription("<@".concat(message.author.id, ">, you will again be @mentioned while receiving rains, soaks and other mass operations.\nIf you do not wish to be @mentioned, please issue this command again.")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.unIngoreMeMessage = unIngoreMeMessage;

var discordDepositConfirmedMessage = function discordDepositConfirmedMessage(amount) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Deposit').setDescription("Deposit Confirmed \n".concat(amount, " ").concat(settings.coin.ticker, " has been credited to your wallet")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.discordDepositConfirmedMessage = discordDepositConfirmedMessage;

var discordIncomingDepositMessage = function discordIncomingDepositMessage(res) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Deposit').setDescription("incoming deposit detected for ".concat(res.locals.amount, " ").concat(settings.coin.ticker, "\nBalance will be reflected in your wallet in ~").concat(settings.min.confirmations, "+ confirmations\n").concat(settings.coin.explorer, "tx/").concat(res.locals.transaction[0].txid)).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.discordIncomingDepositMessage = discordIncomingDepositMessage;

var discordUserWithdrawalRejectMessage = function discordUserWithdrawalRejectMessage(title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Withdraw').setDescription("Your withdrawal has been rejected").setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
}; // transactionNotFoundMessage


exports.discordUserWithdrawalRejectMessage = discordUserWithdrawalRejectMessage;

var transactionNotFoundMessage = function transactionNotFoundMessage(title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("Transaction not found").setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.transactionNotFoundMessage = transactionNotFoundMessage;

var discordWithdrawalAcceptedMessage = function discordWithdrawalAcceptedMessage(updatedTrans) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Withdraw').setDescription("Your withdrawal has been accepted\n".concat(settings.coin.explorer, "/tx/").concat(updatedTrans.txid)).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.discordWithdrawalAcceptedMessage = discordWithdrawalAcceptedMessage;

var balanceMessage = function balanceMessage(userId, user, priceInfo) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Balance').setDescription("<@".concat(userId, ">'s current available balance: ").concat(user.wallet.available / 1e8, " ").concat(settings.coin.ticker, "\n<@").concat(userId, ">'s current locked balance: ").concat(user.wallet.locked / 1e8, " ").concat(settings.coin.ticker, "\nEstimated value of <@").concat(userId, ">'s balance: $").concat(((user.wallet.available + user.wallet.locked) / 1e8 * priceInfo.price).toFixed(2))).setThumbnail(settings.coin.logo).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.balanceMessage = balanceMessage;

var DiscordFeeMessage = function DiscordFeeMessage(message, fee) {
  var feeString = '';

  for (var key in fee) {
    feeString += "".concat(key, ": ").concat(fee[key].fee / 1e2, "% (").concat(fee[key].type, ")\n");
  }

  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Fee Schedule').setDescription("".concat(feeString)).setThumbnail(settings.coin.logo).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.DiscordFeeMessage = DiscordFeeMessage;

var ReactdropCaptchaMessage = function ReactdropCaptchaMessage(userId) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Reactdrop').setDescription("<@".concat(userId, ">'s you have 1 minute to guess")).setImage("attachment://captcha.png").setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.ReactdropCaptchaMessage = ReactdropCaptchaMessage;

var depositAddressMessage = function depositAddressMessage(userId, user) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Deposit').setDescription("<@".concat(userId, ">'s deposit address:\n*").concat(user.wallet.addresses[0].address, "*")).setImage("attachment://qr.png").setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.depositAddressMessage = depositAddressMessage;

var featureDisabledChannelMessage = function featureDisabledChannelMessage(name) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(name).setDescription("This Feature has been disabled for this channel").setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.featureDisabledChannelMessage = featureDisabledChannelMessage;

var featureDisabledServerMessage = function featureDisabledServerMessage(name) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(name).setDescription("This Feature has been disabled for this server").setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.featureDisabledServerMessage = featureDisabledServerMessage;

var featureDisabledGlobalMessage = function featureDisabledGlobalMessage(name) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(name).setDescription("This Feature has been disabled").setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.featureDisabledGlobalMessage = featureDisabledGlobalMessage;

var tipSuccessMessage = function tipSuccessMessage(message, listOfUsersRained, amount, type) {
  var userText = listOfUsersRained.join(", ");
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Tip').setDescription("\n    ".concat(listOfUsersRained.length === 1 ? "<@".concat(message.author.id, "> tipped ").concat(amount / 1e8, " ").concat(settings.coin.ticker, " to ").concat(listOfUsersRained[0]) : "", "\n    ").concat(listOfUsersRained.length > 1 ? "<@".concat(message.author.id, "> tipped ").concat(amount / 1e8, " ").concat(settings.coin.ticker, " to ").concat(userText, " (").concat(type, ")") : "", "\n")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.tipSuccessMessage = tipSuccessMessage;

var unableToFindUserTipMessage = function unableToFindUserTipMessage(message, amount) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Tip').setDescription("Unable to find user to tip.").setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.unableToFindUserTipMessage = unableToFindUserTipMessage;

var AfterSuccessMessage = function AfterSuccessMessage(message, amount, withoutBots, amountPerUser, type, typeH) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(type).setDescription("<@".concat(message.author.id, "> ").concat(typeH, " ").concat(amount / 1e8, " ").concat(settings.coin.ticker, " on ").concat(withoutBots.length, " users -- ").concat(amountPerUser / 1e8, " ").concat(settings.coin.ticker, " each")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.AfterSuccessMessage = AfterSuccessMessage;

var notEnoughActiveUsersMessage = function notEnoughActiveUsersMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, not enough active users")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.notEnoughActiveUsersMessage = notEnoughActiveUsersMessage;

var discordWithdrawalRejectedMessage = function discordWithdrawalRejectedMessage() {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Withdraw").setDescription("Your withdrawal has been rejected").setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.discordWithdrawalRejectedMessage = discordWithdrawalRejectedMessage;

var walletNotFoundMessage = function walletNotFoundMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Wallet not found")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.walletNotFoundMessage = walletNotFoundMessage;

var minimumMessage = function minimumMessage(message, setting, type) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(type).setDescription("<@".concat(message.author.id, ">, Minimum ").concat(type, " is ").concat(setting.min / 1e8, " ").concat(settings.coin.ticker)).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.minimumMessage = minimumMessage;

var timeOutAllAmoutMessageDiscord = function timeOutAllAmoutMessageDiscord(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(capitalize(title)).setDescription("<@".concat(message.author.id, ">, the request to ").concat(title, " all your ").concat(settings.coin.ticker, " has expired")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.timeOutAllAmoutMessageDiscord = timeOutAllAmoutMessageDiscord;

var canceledAllAmoutMessageDiscord = function canceledAllAmoutMessageDiscord(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(capitalize(title)).setDescription("<@".concat(message.author.id, ">, you canceled the request to ").concat(title, " all your ").concat(settings.coin.ticker)).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.canceledAllAmoutMessageDiscord = canceledAllAmoutMessageDiscord;

var confirmAllAmoutMessageDiscord = function confirmAllAmoutMessageDiscord(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(capitalize(title)).setDescription("<@".concat(message.author.id, ">, are you sure that you want to ").concat(title, " with all your ").concat(settings.coin.ticker, "?\n    Accepted answers: yes/no/y/n; \n    Auto-cancel in 30 seconds.")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.confirmAllAmoutMessageDiscord = confirmAllAmoutMessageDiscord;

var claimTooFactFaucetMessage = function claimTooFactFaucetMessage(message, username, distance) {
  var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
  var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
  var seconds = Math.floor(distance % (1000 * 60) / 1000);
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Faucet').setDescription("".concat(username, ", you have to wait ").concat(hours === 1 ? "".concat(hours, " hour") : '', " ").concat(hours > 1 ? "".concat(hours, " hours") : '', ", ").concat(minutes === 1 ? "".concat(minutes, " minute") : '', " ").concat(minutes > 1 ? "".concat(minutes, " minutes") : '', " and ").concat(seconds === 1 ? "".concat(seconds, " second") : '', " ").concat(seconds > 1 ? "".concat(seconds, " seconds") : '', " before claiming the faucet again (the faucet can be claimed every 4 hours).")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.claimTooFactFaucetMessage = claimTooFactFaucetMessage;

var faucetClaimedMessage = function faucetClaimedMessage(message, username, amount) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Faucet').setDescription("".concat(username, ", you have been tipped ").concat(amount / 1e8, " ").concat(settings.coin.ticker, " from the faucet.")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.faucetClaimedMessage = faucetClaimedMessage;

var dryFaucetMessage = function dryFaucetMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Faucet').setDescription("Faucet is dry").setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.dryFaucetMessage = dryFaucetMessage;

var hurricaneMaxUserAmountMessage = function hurricaneMaxUserAmountMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Hurricane').setDescription("<@".concat(message.author.id, ">, Maximum user amount is 50")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.hurricaneMaxUserAmountMessage = hurricaneMaxUserAmountMessage;

var hurricaneInvalidUserAmount = function hurricaneInvalidUserAmount(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Hurricane').setDescription("<@".concat(message.author.id, ">, Invalid amount of users")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.hurricaneInvalidUserAmount = hurricaneInvalidUserAmount;

var thunderstormMaxUserAmountMessage = function thunderstormMaxUserAmountMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('ThunderStorm').setDescription("<@".concat(message.author.id, ">, Maximum user amount is 50")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.thunderstormMaxUserAmountMessage = thunderstormMaxUserAmountMessage;

var thunderstormInvalidUserAmount = function thunderstormInvalidUserAmount(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('ThunderStorm').setDescription("<@".concat(message.author.id, ">, Invalid amount of users")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.thunderstormInvalidUserAmount = thunderstormInvalidUserAmount;

var hurricaneUserZeroAmountMessage = function hurricaneUserZeroAmountMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Hurricane').setDescription("<@".concat(message.author.id, ">, minimum amount of users to thunderstorm is 1")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.hurricaneUserZeroAmountMessage = hurricaneUserZeroAmountMessage;

var thunderstormUserZeroAmountMessage = function thunderstormUserZeroAmountMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('ThunderStorm').setDescription("<@".concat(message.author.id, ">, minimum amount of users to thunderstorm is 1")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.thunderstormUserZeroAmountMessage = thunderstormUserZeroAmountMessage;

var AfterHurricaneSuccess = function AfterHurricaneSuccess(message, amount, amountPerUser, listOfUsersRained) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Hurricane').setDescription("".concat(listOfUsersRained.map(function (user) {
    return "\u26C8 ".concat(user, " has been hit with ").concat(amountPerUser / 1e8, " ").concat(settings.coin.ticker, " \u26C8");
  }).join("\n"))) // .setDescription(`⛈ ${userThunder} has been thunderstruck with ${amount / 1e8} ${settings.coin.ticker} ⛈`)
  .setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.AfterHurricaneSuccess = AfterHurricaneSuccess;

var AfterThunderStormSuccess = function AfterThunderStormSuccess(message, amount, amountPerUser, listOfUsersRained) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('ThunderStorm').setDescription("".concat(listOfUsersRained.map(function (user) {
    console.log('user');
    console.log(user);
    return "\u26C8 ".concat(user, " has been hit with ").concat(amountPerUser / 1e8, " ").concat(settings.coin.ticker, " \u26C8");
  }).join("\n"))) // .setDescription(`⛈ ${userThunder} has been thunderstruck with ${amount / 1e8} ${settings.coin.ticker} ⛈`)
  .setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.AfterThunderStormSuccess = AfterThunderStormSuccess;

var AfterThunderSuccess = function AfterThunderSuccess(message, amount, userThunder) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Thunder').setDescription("\u26C8 ".concat(userThunder, " has been hit with ").concat(amount / 1e8, " ").concat(settings.coin.ticker, " \u26C8")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.AfterThunderSuccess = AfterThunderSuccess;

var reviewMessage = function reviewMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Withdraw').setDescription("<@".concat(message.author.id, ">, Your withdrawal is being reviewed")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.reviewMessage = reviewMessage;

var invalidTimeMessage = function invalidTimeMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Invalid time")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.invalidTimeMessage = invalidTimeMessage;

var invalidEmojiMessage = function invalidEmojiMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, You used an invalid emoji")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.invalidEmojiMessage = invalidEmojiMessage;

var insufficientBalanceMessage = function insufficientBalanceMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Insufficient balance")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.insufficientBalanceMessage = insufficientBalanceMessage;

var userNotFoundMessage = function userNotFoundMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, User not found")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.userNotFoundMessage = userNotFoundMessage;

var invalidAddressMessage = function invalidAddressMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Withdraw').setDescription("<@".concat(message.author.id, ">, Invalid Runebase Address")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.invalidAddressMessage = invalidAddressMessage;

var invalidAmountMessage = function invalidAmountMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Invalid Amount")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.invalidAmountMessage = invalidAmountMessage;

var minimumWithdrawalMessage = function minimumWithdrawalMessage(message, min) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle('Withdraw').setDescription("<@".concat(message.author.id, ">, Minimum Withdrawal is ").concat(min / 1e8, " ").concat(settings.coin.ticker)).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.minimumWithdrawalMessage = minimumWithdrawalMessage;

var disablePublicStatsMessage = function disablePublicStatsMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Statistics").setDescription("<@".concat(message.author.id, ">, Public Statistics has been disabled")).setThumbnail(settings.coin.logo).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.disablePublicStatsMessage = disablePublicStatsMessage;

var NotInDirectMessage = function NotInDirectMessage(message, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(message.author.id, ">, Can't use this command in a direct message")).setThumbnail(settings.coin.logo).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.NotInDirectMessage = NotInDirectMessage;

var enablePublicStatsMeMessage = function enablePublicStatsMeMessage(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Statistics").setDescription("<@".concat(message.author.id, ">, Public Statistic has been enabled")).setThumbnail(settings.coin.logo).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.enablePublicStatsMeMessage = enablePublicStatsMeMessage;

var notEnoughUsersToTip = function notEnoughUsersToTip(message) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Statistics").setDescription("<@".concat(message.author.id, ">, Not enough users to tip")).setThumbnail(settings.coin.logo).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.notEnoughUsersToTip = notEnoughUsersToTip;

var statsMessage = function statsMessage(message, _statsMessage) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("Statistics").setDescription("<@".concat(message.author.id, ">, ").concat(_statsMessage)).setThumbnail(settings.coin.logo).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.statsMessage = statsMessage;

var warnDirectMessage = function warnDirectMessage(userId, title) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle(title).setDescription("<@".concat(userId, ">, I've sent you a direct message.")).setThumbnail(settings.coin.logo).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.warnDirectMessage = warnDirectMessage;

var helpMessage = function helpMessage(withdraw) {
  var result = new _discord.MessageEmbed().setColor(settings.bot.color).setTitle("".concat("".concat(settings.bot.name, " v").concat(_package["default"].version), " Help")).setDescription("`".concat(settings.bot.command.discord, "`\nDisplays this message\n\n`").concat(settings.bot.command.discord, " help`\nDisplays this message\n\n`").concat(settings.bot.command.discord, " info`\nDisplays coin info\n\n`").concat(settings.bot.command.discord, " balance`\nDisplays your balance\n\n`").concat(settings.bot.command.discord, " stats`\nDisplays your tip statistics\n\n`").concat(settings.bot.command.discord, " deposit`\nDisplays your deposit address\n\n`").concat(settings.bot.command.discord, " fees`\nDisplays fee schedule\n\n`").concat(settings.bot.command.discord, " publicstats`\nEnable/Disable public statistics (determines if you want to be shown on the leaderboards) \ndefault: disabled\n\n`").concat(settings.bot.command.discord, " withdraw <address> <amount|all>`\nWithdraws the entered amount to a ").concat(settings.coin.name, " address of your choice\nexample: `").concat(settings.bot.command.discord, " withdraw ").concat(settings.coin.exampleAddress, " 5.20 `\nNote: Minimal amount to withdraw: ").concat(withdraw.min / 1e8, " ").concat(settings.coin.ticker, ". A withdrawal fee of ").concat(withdraw.fee / 1e2, "% ").concat(settings.coin.ticker, ". half of the withdrawal fee will be automatically deducted from the amount and will be donated to the common faucet pot.\n\n`").concat(settings.bot.command.discord, " <@user> <amount|all>`\nTips the @ mentioned user with the desired amount\nexample: `").concat(settings.bot.command.discord, " @test123456#7890 1.00`\n\n`").concat(settings.bot.command.discord, " <@user> <@user> <@user> <amount|all> [split|each]`\nTips the @ mentioned users with the desired amount\nexample: `").concat(settings.bot.command.discord, " @test123456#7890 @test123457#7890 1.00 each`\n\n`").concat(settings.bot.command.discord, " rain <amount|all> [<@role>]`\nRains the desired amount onto all online users (optionally, within specified role)\nexample: `").concat(settings.bot.command.discord, " rain 10`, `").concat(settings.bot.command.discord, " rain 10 @supporters`\n\n`").concat(settings.bot.command.discord, " soak <amount|all> [<@role>]`\nSoaks the desired amount onto all online and idle users (optionally, within specified role)\nexample: `").concat(settings.bot.command.discord, " soak 3.00`\n\n`").concat(settings.bot.command.discord, " flood <amount|all> [<@role>]`\nFloods the desired amount onto all users (including offline users) (optionally, within specified role)\nexample: `").concat(settings.bot.command.discord, " flood 5.00`, `").concat(settings.bot.command.discord, " flood 5.00 @supporters`\n\n`").concat(settings.bot.command.discord, " sleet <amount|all> [<@role>]`\nMakes a sleet storm with the desired amount onto all users that have been active in the channel in the last 15 minutes (optionally, within specified role\nexample: `").concat(settings.bot.command.discord, " sleet 5.00`, `").concat(settings.bot.command.discord, " sleet 5.00 @supporters`\n\n`").concat(settings.bot.command.discord, " voicerain <amount|all> <@voiceChannel> [<@role>]`\nRains the desired amount onto all listening users in the mentioned voice channel.\nexample: `").concat(settings.bot.command.discord, " voicerain 5.00 #General`, `").concat(settings.bot.command.discord, " voicerain 5.00 #General @supporters`\nNOTE: To mention a voice channel, get the channel ID ([read here how](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)) and enclose it with <# and >\n\n`").concat(settings.bot.command.discord, " thunder <amount|all> [<@role>]`\nTips a random lucky online user with the amount (optionally, within specified role)\nexample: `").concat(settings.bot.command.discord, " thunder 5`, `").concat(settings.bot.command.discord, " thunder 5 @supporters`\n\n`").concat(settings.bot.command.discord, " thunderstorm <numberOfUsers> <amount|all> [<@role>]`\nTips a specified number (max: 50) random lucky online users with part of the amount (optionally, within specified role)\nexample: `").concat(settings.bot.command.discord, " thunderstorm 10 5.00`, `").concat(settings.bot.command.discord, " thunderstorm 10 5.00 @supporters`\n\n`").concat(settings.bot.command.discord, " hurricane <numberOfUsers> <amount|all> [<@role>]`\nTips a specified number (max: 50) random lucky online and idle users with part of the amount (optionally, within specified role)\nexample: `").concat(settings.bot.command.discord, " hurricane 10 5.00`, `").concat(settings.bot.command.discord, " hurricane 10 5.00 @supporters`\n\n`").concat(settings.bot.command.discord, " faucet`\nGets an amount from the faucet (applicable every 4 hours)\n\n`").concat(settings.bot.command.discord, " reactdrop <amount> [<time>] [<emoji>]`\nPerforms a react airdrop with the amount, optionally within custom time, optionally using a custom-supplied emoji. <time> parameter accepts time interval expressions in the form of:`60s`, `5m`, `1h`. Default time interval is `5m`(5minutes), e.g. `").concat(settings.bot.command.discord, " reactdrop 10 20m`, `").concat(settings.bot.command.discord, " reactdrop 10 3h \uD83D\uDE03`\n\n`").concat(settings.bot.command.discord, " ignoreme`\nTurns @mentioning you during mass operations on/off\n\n**Like the bot?**\n[Invite it to your server](").concat(settings.bot.url.discord, ")")).setTimestamp().setFooter("".concat(settings.bot.name, " v").concat(_package["default"].version), settings.coin.logo);
  return result;
};

exports.helpMessage = helpMessage;