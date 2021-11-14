const { MessageEmbed } = require('discord.js');
const settings = require('../../config/settings');

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
    .setFooter(settings.bot.name, settings.coin.logo);

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
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const AfterReactDropSuccessMessage = (endReactDrop, amountEach) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Reactdrop')
    .setDescription(`:tada:React airdrop started by user has finished!:tada:
    
:money_with_wings:${endReactDrop.reactdroptips.length} user(s) will share ${endReactDrop.amount / 1e8} ${settings.coin.ticker} (${amountEach / 1e8} each)!:money_with_wings:`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const minimumTimeReactDropMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Reactdrop')
    .setDescription(`Minimum time for reactdrop is 60 seconds (60s)`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const discordDepositConfirmedMessage = (amount) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Deposit')
    .setDescription(`Deposit Confirmed 
${amount} ${settings.coin.ticker} has been credited to your wallet`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

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
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const discordUserWithdrawalRejectMessage = (title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Withdraw')
    .setDescription(`Your withdrawal has been rejected`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

// transactionNotFoundMessage
export const transactionNotFoundMessage = (title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`Transaction not found`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const discordWithdrawalAcceptedMessage = (updatedTrans) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Withdraw')
    .setDescription(`Your withdrawal has been accepted
${settings.coin.explorer}/tx/${updatedTrans.txid}`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

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
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const ReactdropCaptchaMessage = (userId) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Reactdrop')
    .setDescription(`<@${userId}>'s you have 1 minute to guess`)
    .setImage("attachment://captcha.png")
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

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
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};
export const tipSuccessMessage = (userId, userIdTipped, amount) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Tip')
    .setDescription(`<@${userId}> tipped ${amount / 1e8} ${settings.coin.ticker} to <@${userIdTipped}>`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};
export const unableToFindUserTipMessage = (message, amount) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Tip')
    .setDescription(`Unable to find user to tip.`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const AfterRainSuccessMessage = (message, amount, withoutBots, amountPerUser) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Rain')
    .setDescription(`<@${message.author.id}> rained ${amount / 1e8} ${settings.coin.ticker} on ${withoutBots.length} users -- ${amountPerUser / 1e8} ${settings.coin.ticker} each`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const AfterFloodSuccessMessage = (message, amount, withoutBots, amountPerUser) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Rain')
    .setDescription(`<@${message.author.id}> Flooded ${amount / 1e8} ${settings.coin.ticker} on ${withoutBots.length} users -- ${amountPerUser / 1e8} ${settings.coin.ticker} each`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const AfterSleetSuccessMessage = (message, amount, usersToRain, amountPerUser) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Sleet')
    .setDescription(`<@${message.author.id}> Sleeted ${amount / 1e8} ${settings.coin.ticker} on ${usersToRain.length} active users -- ${amountPerUser / 1e8} ${settings.coin.ticker} each`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const notEnoughActiveUsersMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, not enough active users`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const walletNotFoundMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Wallet not found`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const minimumRainMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Rain')
    .setDescription(`<@${message.author.id}>, Minimum Rain is ${Number(settings.min.discord.rain) / 1e8} ${settings.coin.ticker}`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const minimumSleetMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Sleet')
    .setDescription(`<@${message.author.id}>, Minimum Sleet is ${Number(settings.min.discord.sleet) / 1e8} ${settings.coin.ticker}`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const minimumFloodMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Flood')
    .setDescription(`<@${message.author.id}>, Minimum Flood is ${Number(settings.min.discord.flood) / 1e8} ${settings.coin.ticker}`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const minimumTipMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Tip')
    .setDescription(`<@${message.author.id}>, Minimum Tip is ${Number(settings.min.discord.tip) / 1e8} ${settings.coin.ticker}`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const reviewMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Withdraw')
    .setDescription(`<@${message.author.id}>, Your withdrawal is being reviewed`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const invalidTimeMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Invalid time`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const insufficientBalanceMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Insufficient balance`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const userNotFoundMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, User not found`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const invalidAddressMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Withdraw')
    .setDescription(`<@${message.author.id}>, Invalid Runebase Address`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const invalidAmountMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Invalid Amount`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const minimumWithdrawalMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle('Withdraw')
    .setDescription(`<@${message.author.id}>, Minimum Withdrawal is ${Number(settings.min.withdrawal) / 1e8} ${settings.coin.ticker}`)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const warnDirectMessage = (userId, title) => {
  const result = new MessageEmbed()
    .setColor(settings.bot.color)
    .setTitle(title)
    .setDescription(`<@${userId}>, I've sent you a direct message.`)
    .setThumbnail(settings.coin.logo)
    .setTimestamp()
    .setFooter(settings.bot.name, settings.coin.logo);

  return result;
};

export const helpMessage = new MessageEmbed()
  .setColor(settings.bot.color)
  .setTitle(`${settings.bot.name} Help`)
  .setDescription(`\`${settings.bot.command.discord}\`
Displays this message

\`${settings.bot.command.discord} help\`
Displays this message

\`${settings.bot.command.discord} info\`
Displays coin info

\`${settings.bot.command.discord} balance\`
Displays your balance

\`${settings.bot.command.discord} deposit\`
Displays your deposit address

\`${settings.bot.command.discord} withdraw <address> <amount|all> \`
Withdraws the entered amount to a ${settings.coin.name} address of your choice

\`${settings.bot.command.discord} <@user> <amount|all>\`
Tips the @ mentioned user with the desired amount

\`${settings.bot.command.discord} rain <amount|all>\`
Rains the desired amount onto all online users (optionally, within specified role)

\`${settings.bot.command.discord} flood <amount|all>\`
Floods the desired amount onto all users (including offline users) (optionally, within specified role)

\`${settings.bot.command.discord} reactdrop <amount> [<time>] [<emoji>]\`
Performs a react airdrop with the amount, optionally within custom time, optionally using a custom-supplied emoji. <time> parameter accepts time interval expressions in the form of:\`60s\`, \`5m\`, \`1h\`. Default time interval is \`5m\`(5minutes), e.g. \`!arrrtip reactdrop 10 20m\`, \`!arrrtip reactdrop 10 3h 😃\`
  `)
  .setTimestamp()
  .setFooter(settings.bot.name, settings.coin.logo);
