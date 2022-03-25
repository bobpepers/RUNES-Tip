import { MessageEmbed } from "discord.js";
import getCoinSettings from '../../config/settings';
import pjson from "../../../package.json";

const settings = getCoinSettings();

const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

export const discordUserBannedMessage = (user) => {
  const result = new MessageEmbed()
    .setColor("#C70039")
    .setTitle(`🚫     User: ${user.username} Banned     🚫`)
    .setDescription(`Reason:
${user.banMessage}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const discordServerBannedMessage = (server) => {
  const result = new MessageEmbed()
    .setColor(`#C70039`)
    .setTitle('🚫     Server Banned     🚫')
    .setDescription(`Reason:
${server.banMessage}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const priceMessage = (replyString) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Price')
    .setThumbnail(settings.coin.logo)
    .setDescription(replyString)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const discordChannelBannedMessage = (channel) => {
  const result = new MessageEmbed()
    .setColor('#FF7900')
    .setTitle('❗     Channel Restricted     ❗')
    .setDescription(`Reason:
${channel.banMessage}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const coinInfoMessage = (
  blockHeight,
  priceInfo,
) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Tipbot')
    .addField("Coin Info", settings.coin.description)
    .addField("\u200b", "\u200b")
    .addFields(
      { name: "Coin Name", value: settings.coin.name, inline: true },
      { name: "Ticker", value: settings.coin.ticker, inline: true },
    )
    .addField("\u200b", "\u200b")
    .addFields(
      { name: "Current block height", value: `${blockHeight}`, inline: true },
      { name: "Wallet version", value: "0", inline: true },
    )
    .addField("\u200b", "\u200b")
    .addField("Website", settings.coin.website)
    .addField("Github", settings.coin.github)
    .addField("Block Explorer", settings.coin.explorer)
    .addField("Discord Server", settings.coin.discord)
    .addField("Telegram Group", settings.coin.telegram)
    .addField("Exchanges", settings.coin.exchanges.join('\n'))
    .addField("Current price", `$${priceInfo.price} (source: coinpaprika)`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const triviaMessageDiscord = (
  id,
  distance,
  author,
  question,
  answers,
  amount,
  totalPeople,
) => {
  // Time calculations for days, hours, minutes and seconds
  const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 60)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  const ended = days < 1 && hours < 1 && minutes < 1 && seconds < 1;

  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Trivia #${id}`)
    .setDescription(`👨‍🏫 <@${author}> has started a trivia question for ${totalPeople} ${Number(totalPeople) === 1 ? 'person' : 'people'}! 👨‍🏫

:information_source: Click the correct answer for a chance to win a share in ${amount / 1e8} ${settings.coin.ticker}!

Question: ${question}

${answers}

${!ended ? `:clock9: Time remaining ${days > 0 ? `${days} days` : ''}  ${hours > 0 ? `${hours} hours` : ''} ${minutes > 0 ? `${minutes} minutes` : ''} ${seconds > 0 ? `${seconds} seconds` : ''}` : `Ended`}
`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const reactDropMessage = (
  id,
  distance,
  author,
  emoji,
  amount,
) => {
  // Time calculations for days, hours, minutes and seconds
  const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 60)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  const ended = days < 1 && hours < 1 && minutes < 1 && seconds < 1;

  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Reactdrop #${id}`)
    .setDescription(`:tada: <@${author}> has started a react airdrop! :tada:

:information_source: React to this message ONLY with ${emoji} to win a share in ${amount / 1e8} ${settings.coin.ticker}! You will also be presented with a simple math question in your direct messages which you need to solve to be eligible.

${!ended ? `:clock9: Time remaining ${days > 0 ? `${days} days` : ''}  ${hours > 0 ? `${hours} hours` : ''} ${minutes > 0 ? `${minutes} minutes` : ''} ${seconds > 0 ? `${seconds} seconds` : ''}` : `Ended`}
`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const AfterTriviaSuccessMessage = (
  endTrivia,
  amountEach,
  initiator,
) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Trivia #${endTrivia.id}`)
    .setDescription(`:tada:[Trivia](https://discord.com/channels/${endTrivia.group.groupId.replace("discord-", "")}/${endTrivia.channel.channelId.replace("discord-", "")}/${endTrivia.discordMessageId}) started by <@${initiator}> has finished!:tada:
    
:money_with_wings:${endTrivia.triviatips.length} ${endTrivia.triviatips.length === 1 ? 'user' : 'users'} will share ${endTrivia.amount / 1e8} ${settings.coin.ticker} (${amountEach / 1e8} each)!:money_with_wings:`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const AfterReactDropSuccessMessage = (endReactDrop, amountEach, initiator) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Reactdrop #${endReactDrop.id}`)
    .setDescription(`:tada:[React airdrop](https://discord.com/channels/${endReactDrop.group.groupId.replace("discord-", "")}/${endReactDrop.channel.channelId.replace("discord-", "")}/${endReactDrop.discordMessageId}) started by <@${initiator}> has finished!:tada:
    
:money_with_wings:${endReactDrop.reactdroptips.length} user(s) will share ${endReactDrop.amount / 1e8} ${settings.coin.ticker} (${amountEach / 1e8} each)!:money_with_wings:`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const discordLimitSpamMessage = (userId, myFunctionName) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(myFunctionName)
    .setDescription(`🚫 Slow down! 🚫
<@${userId}>, you're using this command too fast, wait a while before using it again.`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const minimumTimeReactDropMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Reactdrop')
    .setDescription(`Minimum time for reactdrop is 60 seconds (60s)`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const maxTimeTriviaMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Trivia')
    .setDescription(`Maximum time is 2 days`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const maxTimeReactdropMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Reactdrop')
    .setDescription(`Maximum time is 2 days`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const ignoreMeMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Ignore me')
    .setDescription(`<@${message.author.id}>, you will no longer be @mentioned while receiving rains, soaks and other mass operations, but will continue to receive coins from them.
If you wish to be @mentioned, please issue this command again.`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const unIngoreMeMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Ignore me')
    .setDescription(`<@${message.author.id}>, you will again be @mentioned while receiving rains, soaks and other mass operations.
If you do not wish to be @mentioned, please issue this command again.`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const notAVoiceChannel = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Voice Rain')
    .setDescription(`<@${message.author.id}>, Incorrect voice channel defined`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const voiceChannelNotFound = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Voice Rain')
    .setDescription(`<@${message.author.id}>, Voice channel not found`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const cannotSendMessageUser = (title, message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, ${settings.bot.name} was unable to send you a direct message.\nPlease check your discord privacy settings.`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const discordErrorMessage = (title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`Something went wrong.`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const discordDepositConfirmedMessage = (
  amount,
  trans,
) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Deposit #${trans.id}`)
    .setDescription(`Deposit Confirmed 
${amount} ${settings.coin.ticker} has been credited to your wallet`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const discordIncomingDepositMessage = (res) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Deposit #${res.locals.transaction[0].id}`)
    .setDescription(`incoming deposit detected for ${res.locals.amount} ${settings.coin.ticker}
Balance will be reflected in your wallet in ~${settings.min.confirmations}+ confirmations
${settings.coin.explorer}/tx/${res.locals.transaction[0].txid}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const discordUserWithdrawalRejectMessage = (title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Withdraw')
    .setDescription(`Your withdrawal has been rejected`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

// transactionNotFoundMessage
export const transactionNotFoundMessage = (title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`Transaction not found`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const reviewMessage = (message, transaction) => {
  const amount = ((transaction.amount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const fee = ((transaction.feeAmount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const total = (((transaction.amount - transaction.feeAmount) / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Withdraw #${transaction.id}`)
    .setDescription(`<@${message.author.id}>, Your withdrawal is being reviewed
    
amount: ${amount}
fee: ${fee}
total: ${total}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const discordWithdrawalAcceptedMessage = (updatedTrans) => {
  const amount = ((updatedTrans.amount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const fee = ((updatedTrans.feeAmount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const total = (((updatedTrans.amount - updatedTrans.feeAmount) / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Withdraw #${updatedTrans.id}`)
    .setDescription(`Your withdrawal has been accepted

amount: ${amount}
fee: ${fee}
total: ${total}

${settings.coin.explorer}/tx/${updatedTrans.txid}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const discordWithdrawalConfirmedMessage = (userId, trans) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Withdraw #${trans.id}`)
    .setDescription(`<@${userId}>, Your withdrawal has been complete`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const listTransactionsMessage = (userId, user, transactions) => {
  let myString = '';
  // const confirmations = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const transaction of transactions) {
    console.log(transaction);
    myString = myString.concat(`__#${transaction.id} -- ${transaction.type === 'receive' ? 'Deposit' : 'Withdrawal'} -- ${capitalize(transaction.phase)}__
__date:__ ${transaction.createdAt.toLocaleDateString("en-US")}
__txId:__ ${transaction.txid}\n\n`);
  }

  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('List Transactions')
    .setDescription(`<@${userId}>'s latest withdrawals and deposits\n
${myString}`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const balanceMessage = (userId, user, priceInfo) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Balance')
    .setDescription(`<@${userId}>'s current available balance: ${user.wallet.available / 1e8} ${settings.coin.ticker}
<@${userId}>'s current locked balance: ${user.wallet.locked / 1e8} ${settings.coin.ticker}
Estimated value of <@${userId}>'s balance: $${(((user.wallet.available + user.wallet.locked) / 1e8) * priceInfo.price).toFixed(2)}`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const DiscordFeeMessage = (message, fee) => {
  let feeString = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const key in fee) {
    if (Object.prototype.hasOwnProperty.call(fee, key)) {
      feeString += `${key}: ${fee[key].fee / 1e2}% (${fee[key].type})\n`;
    }
  }
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Fee Schedule')
    .setDescription(`${feeString}`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const ReactdropCaptchaMessage = (userId) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Reactdrop')
    .setDescription(`<@${userId}>'s you have 1 minute to guess`)
    .setImage("attachment://captcha.png")
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const depositAddressMessage = (userId, user) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Deposit')
    .setDescription(`<@${userId}>'s deposit address:
*${user.wallet.addresses[0].address}*`)
    .setImage("attachment://qr.png")
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const featureDisabledChannelMessage = (name) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(name)
    .setDescription(`This Feature has been disabled for this channel`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const featureDisabledServerMessage = (name) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(name)
    .setDescription(`This Feature has been disabled for this server`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const featureDisabledGlobalMessage = (name) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(name)
    .setDescription(`This Feature has been disabled`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const tipFaucetSuccessMessage = (message, amount) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Tip')
    .setDescription(`<@${message.author.id}> tipped ${amount / 1e8} ${settings.coin.ticker} to Faucet`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const tipSingleSuccessMessage = (
  message,
  id,
  listOfUsersRained,
  amount,
) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Tip #${id}`)
    .setDescription(`<@${message.author.id}> tipped ${amount / 1e8} ${settings.coin.ticker} to ${listOfUsersRained[0]}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const tipMultipleSuccessMessage = (
  message,
  id,
  listOfUsersRained,
  amount,
  type,
) => {
  const userText = listOfUsersRained.join(", ");
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Tip #${id}`)
    .setDescription(`<@${message.author.id}> tipped **${(amount * listOfUsersRained.length) / 1e8} ${settings.coin.ticker}** to ${listOfUsersRained.length} users

Type: **${capitalize(type)}**  

💸 **${amount / 1e8} ${settings.coin.ticker}** each 💸`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const unableToFindUserTipMessage = (message, amount) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Tip')
    .setDescription(`Unable to find user to tip.`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const AfterSuccessMessage = (
  message,
  id,
  amount,
  withoutBots,
  amountPerUser,
  type,
  typeH,
) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`${type} #${id}`)
    .setDescription(`<@${message.author.id}> ${typeH} **${amount / 1e8} ${settings.coin.ticker}** on ${withoutBots.length} users\n💸 **${amountPerUser / 1e8} ${settings.coin.ticker}** each 💸`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const notEnoughActiveUsersMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, not enough active users`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const discordWithdrawalRejectedMessage = () => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle("Withdraw")
    .setDescription(`Your withdrawal has been rejected`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const walletNotFoundMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Wallet not found`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const minimumMessage = (message, setting, type) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(type)
    .setDescription(`<@${message.author.id}>, Minimum ${type} is ${setting.min / 1e8} ${settings.coin.ticker}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const timeOutAllAmoutMessageDiscord = (
  message,
  operationName,
  userBeingTipped,
) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(capitalize(operationName))
    .setDescription(`<@${message.author.id}>, the request to ${operationName} ${userBeingTipped ? `${userBeingTipped} ` : ``}all your ${settings.coin.ticker} has expired`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};
export const canceledAllAmoutMessageDiscord = (
  message,
  operationName,
  userBeingTipped,
) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(capitalize(operationName))
    .setDescription(`<@${message.author.id}>, you canceled the request to ${operationName} ${userBeingTipped ? `${userBeingTipped} ` : ``}all your ${settings.coin.ticker}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const confirmAllAmoutMessageDiscord = (
  message,
  operationName,
  userBeingTipped,
) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(capitalize(operationName))
    .setDescription(`<@${message.author.id}>, are you sure that you want to ${operationName} ${userBeingTipped ? `${userBeingTipped} ` : ``}all your ${settings.coin.ticker}?
Accepted answers: **yes/no/y/n**; 
Auto-cancel in 30 seconds.`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const claimTooFactFaucetMessage = (username, distance) => {
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Faucet')
    .setDescription(`⏱️ ${username}, you have to wait ${hours === 1 ? `${hours} hour` : ''}${hours > 1 ? `${hours} hours,` : ''} ${minutes === 1 ? `${minutes} minute` : ''}${minutes > 1 ? `${minutes} minutes and` : ''} ${seconds === 1 ? `${seconds} second` : ''}${seconds > 1 ? `${seconds} seconds` : ''} before claiming the faucet again (the faucet can be claimed every 4 hours).`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const faucetClaimedMessage = (
  id,
  username,
  amount,
) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Faucet #${id}`)
    .setDescription(`💧 ${username}, you have been tipped **${amount / 1e8} ${settings.coin.ticker}** from the faucet.`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const dryFaucetMessage = () => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Faucet')
    .setDescription(`🏜️ Faucet is dry`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const hurricaneMaxUserAmountMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Hurricane')
    .setDescription(`<@${message.author.id}>, Maximum user amount is 50`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const hurricaneInvalidUserAmount = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Hurricane')
    .setDescription(`<@${message.author.id}>, Invalid amount of users`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const thunderstormMaxUserAmountMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('ThunderStorm')
    .setDescription(`<@${message.author.id}>, Maximum user amount is 50`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const thunderstormInvalidUserAmount = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('ThunderStorm')
    .setDescription(`<@${message.author.id}>, Invalid amount of users`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const hurricaneUserZeroAmountMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Hurricane')
    .setDescription(`<@${message.author.id}>, minimum amount of users to thunderstorm is 1`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const thunderstormUserZeroAmountMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('ThunderStorm')
    .setDescription(`<@${message.author.id}>, minimum amount of users to thunderstorm is 1`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const AfterThunderSuccess = (
  message,
  id,
  amount,
  userThunder,
) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Thunder #${id}`)
    .setDescription(`⛈ ${userThunder} has been hit with ${amount / 1e8} ${settings.coin.ticker} ⛈`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const invalidPeopleAmountMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Invalid amount of people to win ${title}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const invalidTimeMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Invalid time`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const noTriviaQuestionFoundMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, No trivia question found`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const invalidEmojiMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, You used an invalid emoji`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const insufficientBalanceMessage = (
  message,
  title,
) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Insufficient balance`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const userNotFoundMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, User not found`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const invalidAddressMessage = (
  message,
) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Withdraw')
    .setDescription(`<@${message.author.id}>, Invalid ${settings.coin.name} Address`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const invalidAmountMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Invalid Amount`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const minimumWithdrawalMessage = (message, min) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Withdraw')
    .setDescription(`<@${message.author.id}>, Minimum Withdrawal is ${min / 1e8} ${settings.coin.ticker}`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const disablePublicStatsMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle("Statistics")
    .setDescription(`<@${message.author.id}>, Public Statistics has been disabled`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const NotInDirectMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Can't use this command in a direct message`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const enablePublicStatsMeMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle("Statistics")
    .setDescription(`<@${message.author.id}>, Public Statistic has been enabled`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const notEnoughUsersToTip = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Tip`)
    .setDescription(`<@${message.author.id}>, Not enough users to tip`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const statsMessage = (message, statsMessage) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Statistics`)
    .setDescription(`<@${message.author.id}>, ${statsMessage}`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};
export const ReactDropReturnInitiatorMessage = () => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Reactdrop`)
    .setDescription(`Nobody claimed, returning funds to reactdrop initiator`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const discordWelcomeMessage = (
  userInfo,
) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Bot`)
    .setDescription(`Welcome <@${userInfo.id}>, we created a wallet for you.
Type "${settings.bot.command.discord} help" for usage info`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const discordBotMaintenanceMessage = () => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Bot`)
    .setDescription(`Discord tipbot maintenance`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const discordBotDisabledMessage = () => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Bot`)
    .setDescription(`Discord tipbot disabled`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const triviaReturnInitiatorMessage = () => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`Trivia`)
    .setDescription(`Nobody claimed, returning funds to trivia initiator`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const warnDirectMessage = (userId, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${userId}>, I've sent you a direct message.`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });

  return result;
};

export const helpMessageOne = (withdraw) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(`${`${settings.bot.name} v${pjson.version}`} Help`)
    .setDescription(`\`${settings.bot.command.discord}\`
Displays this message

\`${settings.bot.command.discord} help\`
Displays this message

\`${settings.bot.command.discord} info\`
Displays coin info

\`${settings.bot.command.discord} balance\`
Displays your balance

\`${settings.bot.command.discord} price\`
Displays ${settings.coin.ticker} price

\`${settings.bot.command.discord} stats\`
Displays your tip statistics

\`${settings.bot.command.discord} deposit\`
Displays your deposit address

\`${settings.bot.command.discord} fees\`
Displays fee schedule

\`${settings.bot.command.discord} publicstats\`
Enable/Disable public statistics (determines if you want to be shown on the leaderboards) 
default: disabled

\`${settings.bot.command.discord} withdraw <address> <amount|all>\`
Withdraws the entered amount to a ${settings.coin.name} address of your choice
example: \`${settings.bot.command.discord} withdraw ${settings.coin.exampleAddress} 5.20 \`
Note: Minimal amount to withdraw: ${withdraw.min / 1e8} ${settings.coin.ticker}. A withdrawal fee of ${withdraw.fee / 1e2}% ${settings.coin.ticker}. half of the withdrawal fee will be automatically deducted from the amount and will be donated to the common faucet pot.
`);
    // .setTimestamp()
    // .setFooter({
    //  text: `${settings.bot.name} v${pjson.version}`,
    //  iconURL: settings.coin.logo,
    // });
  return result;
};

export const helpMessageTwo = (withdraw) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    // .setTitle(`${`${settings.bot.name} v${pjson.version}`} Help`)
    .setDescription(`\`${settings.bot.command.discord} <@user> <amount|all>\`
Tips the @ mentioned user with the desired amount
example: \`${settings.bot.command.discord} @test123456#7890 1.00\`

\`${settings.bot.command.discord} <@user> <@user> <@user> <amount|all> [split|each]\`
Tips the @ mentioned users with the desired amount
example: \`${settings.bot.command.discord} @test123456#7890 @test123457#7890 1.00 each\`

\`${settings.bot.command.discord} rain <amount|all> [<@role>]\`
Rains the desired amount onto all online users (optionally, within specified role)
example: \`${settings.bot.command.discord} rain 10\`, \`${settings.bot.command.discord} rain 10 @supporters\`

\`${settings.bot.command.discord} soak <amount|all> [<@role>]\`
Soaks the desired amount onto all online and idle users (optionally, within specified role)
example: \`${settings.bot.command.discord} soak 3.00\`

\`${settings.bot.command.discord} flood <amount|all> [<@role>]\`
Floods the desired amount onto all users (including offline users) (optionally, within specified role)
example: \`${settings.bot.command.discord} flood 5.00\`, \`${settings.bot.command.discord} flood 5.00 @supporters\`

\`${settings.bot.command.discord} sleet <amount|all> [<time>] [<@role>]\`
Makes a sleet storm with the desired amount onto all users that have been active in the channel in the last 15 minutes (optionally, within specified role
example: \`${settings.bot.command.discord} sleet 5.00\`, \`${settings.bot.command.discord} sleet 5.00 @supporters\`, \`${settings.bot.command.discord} sleet 5.00 10m @supporters\`

\`${settings.bot.command.discord} voicerain <amount|all> <@voiceChannel> [<@role>]\`
Rains the desired amount onto all listening users in the mentioned voice channel.
example: \`${settings.bot.command.discord} voicerain 5.00 #General\`, \`${settings.bot.command.discord} voicerain 5.00 #General @supporters\`
NOTE: To mention a voice channel, get the channel ID ([read here how](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)) and enclose it with <# and >

\`${settings.bot.command.discord} thunder <amount|all> [<@role>]\`
Tips a random lucky online user with the amount (optionally, within specified role)
example: \`${settings.bot.command.discord} thunder 5\`, \`${settings.bot.command.discord} thunder 5 @supporters\`

\`${settings.bot.command.discord} thunderstorm <numberOfUsers> <amount|all> [<@role>]\`
Tips a specified number (max: 50) random lucky online users with part of the amount (optionally, within specified role)
example: \`${settings.bot.command.discord} thunderstorm 10 5.00\`, \`${settings.bot.command.discord} thunderstorm 10 5.00 @supporters\`

\`${settings.bot.command.discord} hurricane <numberOfUsers> <amount|all> [<@role>]\`
Tips a specified number (max: 50) random lucky online and idle users with part of the amount (optionally, within specified role)
example: \`${settings.bot.command.discord} hurricane 10 5.00\`, \`${settings.bot.command.discord} hurricane 10 5.00 @supporters\`

\`${settings.bot.command.discord} faucet\`
Gets an amount from the faucet (applicable every 4 hours)

\`${settings.bot.command.discord} reactdrop <amount> [<time>] [<emoji>]\`
Performs a react airdrop with the amount, optionally within custom time, optionally using a custom-supplied emoji. <time> parameter accepts time interval expressions in the form of:\`60s\`, \`5m\`, \`1h\`. Default time interval is \`5m\`(5minutes), e.g. \`${settings.bot.command.discord} reactdrop 10 20m\`, \`${settings.bot.command.discord} reactdrop 10 3h 😃\`

\`${settings.bot.command.discord} trivia <amount> [<amountOfPeople>] [<time>]\`
Performs a trivia with the amount, optionally with set amount of of people, optionally within custom time. <time> parameter accepts time interval expressions in the form of:\`60s\`, \`5m\`, \`1h\`. Default time interval is \`5m\`(5minutes), e.g. \`${settings.bot.command.discord} trivia 5\`, \`${settings.bot.command.discord} trivia 5 3 40s\`

\`${settings.bot.command.discord} ignoreme\`
Turns @mentioning you during mass operations on/off

**Like the bot?**
[Invite it to your server](${settings.bot.url.discord})`)
    .setTimestamp()
    .setFooter({
      text: `${settings.bot.name} v${pjson.version}`,
      iconURL: settings.coin.logo,
    });
  return result;
};
