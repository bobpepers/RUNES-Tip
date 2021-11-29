import { MessageEmbed } from "discord.js";
import settings from "../../config/settings";
import pjson from "../../../package.json";

export const discordUserBannedMessage = (user) => {
  const result = new MessageEmbed()
    .setColor("#C70039")
    .setTitle('🚫     User Banned     🚫')
    .setDescription(`Reason:
${user.banMessage}`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const discordServerBannedMessage = (server) => {
  const result = new MessageEmbed()
    .setColor(`#C70039`)
    .setTitle('🚫     Server Banned     🚫')
    .setDescription(`Reason:
${server.banMessage}`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const discordChannelBannedMessage = (channel) => {
  const result = new MessageEmbed()
    .setColor('#FF7900')
    .setTitle('❗     Channel Restricted     ❗')
    .setDescription(`Reason:
${channel.banMessage}`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const coinInfoMessage = (blockHeight, priceInfo) => {
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
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const reactDropMessage = (distance, author, emoji, amount) => {
  // Time calculations for days, hours, minutes and seconds
  const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 60)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  const ended = days < 1 && hours < 1 && minutes < 1 && seconds < 1;

  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Reactdrop')
    .setDescription(`:tada: <@${author}> has started a react airdrop! :tada:

:information_source: React to this message ONLY with ${emoji} to win a share in ${amount / 1e8} ${settings.coin.ticker}! You will also be presented with a simple math question in your direct messages which you need to solve to be eligible.

${!ended ? `:clock9: Time remaining ${days > 0 ? `${days} days` : ''}  ${hours > 0 ? `${hours} hours` : ''} ${minutes > 0 ? `${minutes} minutes` : ''} ${seconds > 0 ? `${seconds} seconds` : ''}` : `Ended`}
`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const AfterReactDropSuccessMessage = (endReactDrop, amountEach, initiator) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Reactdrop')
    .setDescription(`:tada:React airdrop started by <@${initiator}> has finished!:tada:
    
:money_with_wings:${endReactDrop.reactdroptips.length} user(s) will share ${endReactDrop.amount / 1e8} ${settings.coin.ticker} (${amountEach / 1e8} each)!:money_with_wings:`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const discordLimitSpamMessage = (message, myFunctionName) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(myFunctionName)
    .setDescription(`🚫 Slow down! 🚫
<@${message.author.id}>, you're using this command too fast, wait a while before using it again.`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const minimumTimeReactDropMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Reactdrop')
    .setDescription(`Minimum time for reactdrop is 60 seconds (60s)`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const ignoreMeMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Ignore me')
    .setDescription(`<@${message.author.id}>, you will no longer be @mentioned while receiving rains, soaks and other mass operations, but will continue to receive coins from them.
If you wish to be @mentioned, please issue this command again.`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const unIngoreMeMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Ignore me')
    .setDescription(`<@${message.author.id}>, you will again be @mentioned while receiving rains, soaks and other mass operations.
If you do not wish to be @mentioned, please issue this command again.`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const discordDepositConfirmedMessage = (amount) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Deposit')
    .setDescription(`Deposit Confirmed 
${amount} ${settings.coin.ticker} has been credited to your wallet`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const discordIncomingDepositMessage = (res) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Deposit')
    .setDescription(`incoming deposit detected for ${res.locals.amount} ${settings.coin.ticker}
Balance will be reflected in your wallet in ~${settings.min.confirmations}+ confirmations
${settings.coin.explorer}/tx/${res.locals.transaction[0].txid}`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const discordUserWithdrawalRejectMessage = (title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Withdraw')
    .setDescription(`Your withdrawal has been rejected`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

// transactionNotFoundMessage
export const transactionNotFoundMessage = (title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`Transaction not found`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const discordWithdrawalAcceptedMessage = (updatedTrans) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Withdraw')
    .setDescription(`Your withdrawal has been accepted
${settings.coin.explorer}/tx/${updatedTrans.txid}`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

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
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const ReactdropCaptchaMessage = (userId) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Reactdrop')
    .setDescription(`<@${userId}>'s you have 1 minute to guess`)
    .setImage("attachment://captcha.png")
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

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
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};
export const tipSuccessMessage = (userId, tempUsername, amount) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Tip')
    .setDescription(`<@${userId}> tipped ${amount / 1e8} ${settings.coin.ticker} to ${tempUsername}`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};
export const unableToFindUserTipMessage = (message, amount) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Tip')
    .setDescription(`Unable to find user to tip.`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const AfterSuccessMessage = (message, amount, withoutBots, amountPerUser, type, typeH) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(type)
    .setDescription(`<@${message.author.id}> ${typeH} ${amount / 1e8} ${settings.coin.ticker} on ${withoutBots.length} users -- ${amountPerUser / 1e8} ${settings.coin.ticker} each`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const notEnoughActiveUsersMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, not enough active users`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const walletNotFoundMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Wallet not found`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const minimumMessage = (message, type) => {
  let minAmount;
  if (type === 'Sleet') {
    minAmount = settings.min.discord.sleet;
  }
  if (type === 'Rain') {
    minAmount = settings.min.discord.rain;
  }
  if (type === 'Flood') {
    minAmount = settings.min.discord.flood;
  }
  if (type === 'Tip') {
    minAmount = settings.min.discord.tip;
  }
  if (type === 'Soak') {
    minAmount = settings.min.discord.soak;
  }
  if (type === 'ReactDrop') {
    minAmount = settings.min.discord.reactdrop;
  }
  if (type === 'Thunder') {
    minAmount = settings.min.discord.thunder;
  }
  if (type === 'ThunderStorm') {
    minAmount = settings.min.discord.thunderstorm;
  }
  if (type === 'Hurricane') {
    minAmount = settings.min.discord.hurricane;
  }
  if (type === 'VoiceRain') {
    minAmount = settings.min.discord.voicerain;
  }
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(type)
    .setDescription(`<@${message.author.id}>, Minimum ${type} is ${Number(minAmount) / 1e8} ${settings.coin.ticker}`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const claimTooFactFaucetMessage = (message, username, distance) => {
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Faucet')
    .setDescription(`${username}, you have to wait ${hours === 1 ? `${hours} hour` : ''} ${hours > 1 ? `${hours} hours` : ''}, ${minutes === 1 ? `${minutes} minute` : ''} ${minutes > 1 ? `${minutes} minutes` : ''} and ${seconds === 1 ? `${seconds} second` : ''} ${seconds > 1 ? `${seconds} seconds` : ''} before claiming the faucet again (the faucet can be claimed every 4 hours).`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const faucetClaimedMessage = (message, username, amount) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Faucet')
    .setDescription(`${username}, you have been tipped ${amount / 1e8} ${settings.coin.ticker} from the faucet.`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const dryFaucetMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Faucet')
    .setDescription(`Faucet is dry`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const hurricaneMaxUserAmountMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Hurricane')
    .setDescription(`<@${message.author.id}>, Maximum user amount is 50`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};
export const hurricaneInvalidUserAmount = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Hurricane')
    .setDescription(`<@${message.author.id}>, Invalid amount of users`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const thunderstormMaxUserAmountMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('ThunderStorm')
    .setDescription(`<@${message.author.id}>, Maximum user amount is 50`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const thunderstormInvalidUserAmount = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('ThunderStorm')
    .setDescription(`<@${message.author.id}>, Invalid amount of users`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const hurricaneUserZeroAmountMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Hurricane')
    .setDescription(`<@${message.author.id}>, minimum amount of users to thunderstorm is 1`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const thunderstormUserZeroAmountMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('ThunderStorm')
    .setDescription(`<@${message.author.id}>, minimum amount of users to thunderstorm is 1`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const AfterHurricaneSuccess = (message, amount, amountPerUser, listOfUsersRained) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Hurricane')
    .setDescription(`${listOfUsersRained.map((user) => `⛈ ${user} has been hit by hurricane with ${amountPerUser / 1e8} ${settings.coin.ticker} ⛈`).join("\n")}`)
    // .setDescription(`⛈ ${userThunder} has been thunderstruck with ${amount / 1e8} ${settings.coin.ticker} ⛈`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const AfterThunderStormSuccess = (message, amount, amountPerUser, listOfUsersRained) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('ThunderStorm')
    .setDescription(`${listOfUsersRained.map((user) => {
      console.log('user');
      console.log(user);
      return `⛈ ${user} has been thunderstruck with ${amountPerUser / 1e8} ${settings.coin.ticker} ⛈`;
    }).join("\n")}`)
    // .setDescription(`⛈ ${userThunder} has been thunderstruck with ${amount / 1e8} ${settings.coin.ticker} ⛈`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const AfterThunderSuccess = (message, amount, userThunder) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Thunder')
    .setDescription(`⛈ ${userThunder} has been thunderstruck with ${amount / 1e8} ${settings.coin.ticker} ⛈`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const reviewMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Withdraw')
    .setDescription(`<@${message.author.id}>, Your withdrawal is being reviewed`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const invalidTimeMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Invalid time`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const invalidEmojiMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, You used an invalid emoji`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const insufficientBalanceMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Insufficient balance`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const userNotFoundMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, User not found`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const invalidAddressMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Withdraw')
    .setDescription(`<@${message.author.id}>, Invalid Runebase Address`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const invalidAmountMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Invalid Amount`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const minimumWithdrawalMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Withdraw')
    .setDescription(`<@${message.author.id}>, Minimum Withdrawal is ${Number(settings.min.withdrawal) / 1e8} ${settings.coin.ticker}`)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const disablePublicStatsMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle("Statistics")
    .setDescription(`<@${message.author.id}>, Public Statistics has been disabled`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const NotInDirectMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Can't use this command in a direct message`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const enablePublicStatsMeMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle("Statistics")
    .setDescription(`<@${message.author.id}>, Public Statistic has been enabled`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const statsMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle("Statistics")
    .setDescription(`<@${message.author.id}>, statsMessage`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const warnDirectMessage = (userId, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${userId}>, I've sent you a direct message.`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);

  return result;
};

export const helpMessage = new MessageEmbed()
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

\`${settings.bot.command.discord} stats\`
Displays your tip statistics

\`${settings.bot.command.discord} deposit\`
Displays your deposit address

\`${settings.bot.command.discord} leaderboard\`
Displays server leaderboard

\`${settings.bot.command.discord} publicstats\`
Enable/Disable public statistics (determines if you want to be shown on the leaderboards) 
default: disabled

\`${settings.bot.command.discord} withdraw <address> <amount|all> \`
Withdraws the entered amount to a ${settings.coin.name} address of your choice
example: \`${settings.bot.command.discord} withdraw ${settings.coin.exampleAddress} 5.20 \`
Note: Minimal amount to withdraw: ${settings.min.withdrawal / 1e8} ${settings.coin.ticker}. A withdrawal fee of ${settings.fee.withdrawal / 1e8} ${settings.coin.ticker} will be automatically deducted from the amount and will be donated to the common faucet pot.

\`${settings.bot.command.discord} <@user> <amount|all>\`
Tips the @ mentioned user with the desired amount
example: \`${settings.bot.command.discord} @test123456#7890 1.00\`

\`${settings.bot.command.discord} rain <amount|all>\`
Rains the desired amount onto all online users (optionally, within specified role)
example: \`${settings.bot.command.discord} rain 10\`

\`${settings.bot.command.discord} soak <amount|all>\`
Soaks the desired amount onto all online and idle users (optionally, within specified role)
example: \`${settings.bot.command.discord} soak 3.00\`

\`${settings.bot.command.discord} flood <amount|all>\`
Floods the desired amount onto all users (including offline users) (optionally, within specified role)
example: \`${settings.bot.command.discord} flood 5.00\`

\`${settings.bot.command.discord} sleet <amount|all>\`
Makes a sleet storm with the desired amount onto all users that have been active in the channel in the last 15 minutes (optionally, within specified role

\`${settings.bot.command.discord} voicerain <amount|all> <@voiceChannel>\`
Rains the desired amount onto all listening users in the mentioned voice channel.
example: \`${settings.bot.command.discord} voicerain 5.00 #General\`
NOTE: To mention a voice channel, get the channel ID ([read here how](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)) and enclose it with <# and >

\`${settings.bot.command.discord} thunder <amount|all>\`
Tips a random lucky online user with the amount (optionally, within specified role)
example: \`${settings.bot.command.discord} thunder 5\`

\`${settings.bot.command.discord} thunderstorm <numberOfUsers> <amount|all>\`
Tips a specified number (max: 50) random lucky online users with part of the amount (optionally, within specified role)
example: \`${settings.bot.command.discord} thunderstorm 10 5.00\`

\`${settings.bot.command.discord} hurricane <numberOfUsers> <amount|all>\`
Tips a specified number (max: 50) random lucky online and idle users with part of the amount (optionally, within specified role)
example: \`${settings.bot.command.discord} hurricane 10 5.00\`

\`${settings.bot.command.discord} faucet\`
Gets an amount from the faucet (applicable every 4 hours)

\`${settings.bot.command.discord} reactdrop <amount> [<time>] [<emoji>]\`
Performs a react airdrop with the amount, optionally within custom time, optionally using a custom-supplied emoji. <time> parameter accepts time interval expressions in the form of:\`60s\`, \`5m\`, \`1h\`. Default time interval is \`5m\`(5minutes), e.g. \`!arrrtip reactdrop 10 20m\`, \`!arrrtip reactdrop 10 3h 😃\`

\`${settings.bot.command.discord} ignoreme\`
Turns @mentioning you during mass operations on/off

**Like the bot?**
[Invite it to your server](${settings.bot.url.discord})`)
  .setTimestamp()
  .setFooter(`${settings.bot.name} v${pjson.version}`, settings.coin.logo);
