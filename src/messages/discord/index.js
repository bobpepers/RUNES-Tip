require('dotenv').config();
const { MessageEmbed } = require('discord.js');

export const reactDropMessage = (distance, message, emoji) => {
  // Time calculations for days, hours, minutes and seconds
  const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 60)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Reactdrop')
    .setDescription(`:tada: <@${message.author.id}> has started a react airdrop! :tada:

:information_source: React to this message ONLY with ${emoji} to win a share in 0.3 ARRR! You will also be presented with a simple math question in your direct messages which you need to solve to be eligible.

${seconds > 0 ? `:clock9: Time remaining ${days > 0 ? `${days} days` : ''}  ${hours > 0 ? `${hours} hours` : ''} ${minutes > 0 ? `${minutes} minutes` : ''} ${seconds > 0 ? `${seconds} seconds` : ''}` : `Ended`}
`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const minimumTimeReactDropMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Reactdrop')
    .setDescription(`Minimum time for reactdrop is 60 seconds (60s)`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const discordDepositConfirmedMessage = (amount) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Deposit')
    .setDescription(`Deposit Confirmed 
${amount} ${process.env.CURRENCY_SYMBOL} has been credited to your wallet`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const discordIncomingDepositMessage = (res) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Deposit')
    .setDescription(`incoming deposit detected for ${res.locals.amount} ${process.env.CURRENCY_SYMBOL}
Balance will be reflected in your wallet in ~${process.env.MINIMUM_TRANSACTION_CONFIRMATIONS}+ confirmations
${process.env.EXPLORER_URL}/tx/${res.locals.transaction[0].txid}`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const discordUserWithdrawalRejectMessage = (title) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Withdraw')
    .setDescription(`Your withdrawal has been rejected`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

// transactionNotFoundMessage
export const transactionNotFoundMessage = (title) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle(title)
    .setDescription(`Transaction not found`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const discordWithdrawalAcceptedMessage = (updatedTrans) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Withdraw')
    .setDescription(`Your withdrawal has been accepted
${process.env.EXPLORER_URL}/tx/${updatedTrans.txid}`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const balanceMessage = (userId, user, priceInfo) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Balance')
    .setDescription(`<@${userId}>'s current available balance: ${user.wallet.available / 1e8} ${process.env.CURRENCY_SYMBOL}
<@${userId}>'s current locked balance: ${user.wallet.locked / 1e8} ${process.env.CURRENCY_SYMBOL}
Estimated value of <@${userId}>'s balance: $${(((user.wallet.available + user.wallet.locked) / 1e8) * priceInfo.price).toFixed(2)}`)
    .setThumbnail(process.env.CURRENCY_LOGO)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const ReactdropCaptchaMessage = (userId) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Reactdrop')
    .setDescription(`<@${userId}>'s you have 1 minute to guess`)
    .setImage("attachment://captcha.png")
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const depositAddressMessage = (userId, user) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Deposit')
    .setDescription(`<@${userId}>'s deposit address:
*${user.wallet.addresses[0].address}*`)
    .setImage("attachment://qr.png")
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};
export const tipSuccessMessage = (userId, userIdTipped, amount) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Tip')
    .setDescription(`<@${userId}> tipped ${amount / 1e8} ${process.env.CURRENCY_SYMBOL} to <@${userIdTipped}>`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};
export const unableToFindUserTipMessage = (message, amount) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Tip')
    .setDescription(`Unable to find user to tip.`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const AfterRainSuccessMessage = (message, amount, withoutBots, amountPerUser) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Rain')
    .setDescription(`<@${message.author.id}> rained ${amount / 1e8} ${process.env.CURRENCY_SYMBOL} on ${withoutBots.length} users -- ${amountPerUser / 1e8} ${process.env.CURRENCY_SYMBOL} each`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const AfterFloodSuccessMessage = (message, amount, withoutBots, amountPerUser) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Rain')
    .setDescription(`<@${message.author.id}> Flooded ${amount / 1e8} ${process.env.CURRENCY_SYMBOL} on ${withoutBots.length} users -- ${amountPerUser / 1e8} ${process.env.CURRENCY_SYMBOL} each`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const AfterSleetSuccessMessage = (message, amount, usersToRain, amountPerUser) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Sleet')
    .setDescription(`<@${message.author.id}> Sleeted ${amount / 1e8} ${process.env.CURRENCY_SYMBOL} on ${usersToRain.length} active users -- ${amountPerUser / 1e8} ${process.env.CURRENCY_SYMBOL} each`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const notEnoughActiveUsersMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, not enough active users`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const walletNotFoundMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Wallet not found`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const minimumRainMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Rain')
    .setDescription(`<@${message.author.id}>, Minimum Rain is ${Number(process.env.MINIMUM_RAIN) / 1e8} ${process.env.CURRENCY_SYMBOL}`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const minimumSleetMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Sleet')
    .setDescription(`<@${message.author.id}>, Minimum Rain is ${Number(process.env.MINIMUM_SLEET) / 1e8} ${process.env.CURRENCY_SYMBOL}`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const minimumFloodMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Flood')
    .setDescription(`<@${message.author.id}>, Minimum Flood is ${Number(process.env.MINIMUM_FLOOD) / 1e8} ${process.env.CURRENCY_SYMBOL}`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const minimumTipMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Tip')
    .setDescription(`<@${message.author.id}>, Minimum Tip is ${Number(process.env.MINIMUM_TIP) / 1e8} ${process.env.CURRENCY_SYMBOL}`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const reviewMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Withdraw')
    .setDescription(`<@${message.author.id}>, Your withdrawal is being reviewed`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const invalidTimeMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Invalid time`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const insufficientBalanceMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Insufficient balance`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const userNotFoundMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, User not found`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const invalidAddressMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Withdraw')
    .setDescription(`<@${message.author.id}>, Invalid Runebase Address`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const invalidAmountMessage = (message, title) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle(title)
    .setDescription(`<@${message.author.id}>, Invalid Amount`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const minimumWithdrawalMessage = (message) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Withdraw')
    .setDescription(`<@${message.author.id}>, Minimum Withdrawal is ${Number(process.env.MINIMUM_WITHDRAWAL) / 1e8} ${process.env.CURRENCY_SYMBOL}`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const warnDirectMessage = (userId, title) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle(title)
    .setDescription(`<@${userId}>, I've sent you a direct message.`)
    .setThumbnail(process.env.CURRENCY_LOGO)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const helpMessage = new MessageEmbed()
  .setColor(`#${process.env.BOT_COLOR}`)
  .setTitle(`${process.env.BOT_NAME} Help`)
  .setDescription(`\`\`\`
${process.env.DISCORD_BOT_COMMAND}
\`\`\`
Displays this message

\`\`\`
${process.env.DISCORD_BOT_COMMAND} help
\`\`\`
Displays this message

\`\`\`
${process.env.DISCORD_BOT_COMMAND} balance
\`\`\`
Displays your balance

\`\`\`
${process.env.DISCORD_BOT_COMMAND} deposit
\`\`\`
Displays your deposit address

\`\`\`
${process.env.DISCORD_BOT_COMMAND} withdraw <address> <amount|all> 
\`\`\`
Withdraws the entered amount to a ${process.env.CURRENCY_NAME} address of your choice

\`\`\`
${process.env.DISCORD_BOT_COMMAND} <@user> <amount|all>
\`\`\`
Tips the @ mentioned user with the desired amount

\`\`\`
${process.env.DISCORD_BOT_COMMAND} rain <amount|all> [<@role>]
\`\`\`
Rains the desired amount onto all online users (optionally, within specified role)

\`\`\`
${process.env.DISCORD_BOT_COMMAND} flood <amount|all> [<@role>]
\`\`\`
Floods the desired amount onto all users (including offline users) (optionally, within specified role)
  `)
  .setTimestamp()
  .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);
