require('dotenv').config();
const { MessageEmbed } = require('discord.js');

export const balanceMessage = (userId, user) => {
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

export const AfterRainSuccessMessage = (message, amount) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Rain')
    .setDescription(`<@${message.author.id}> rained ${amount / 1e8} ${process.env.CURRENCY_SYMBOL} on ${withoutBots.length} users -- ${amountPerUser / 1e8} ${process.env.CURRENCY_SYMBOL} each`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const AfterFloodSuccessMessage = (message, amount) => {
  const result = new MessageEmbed()
    .setColor(`#${process.env.BOT_COLOR}`)
    .setTitle('Rain')
    .setDescription(`<@${message.author.id}> Flooded ${amount / 1e8} ${process.env.CURRENCY_SYMBOL} on ${withoutBots.length} users -- ${amountPerUser / 1e8} ${process.env.CURRENCY_SYMBOL} each`)
    .setTimestamp()
    .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);

  return result;
};

export const AfterSleetSuccessMessage = (message, amount) => {
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
    .setDescription(`<@${message.author.id}>, Minimum Withdrawal is 2 ${process.env.CURRENCY_SYMBOL}`)
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
  .setTitle('RunesTip Help')
  .setDescription(`\`\`\`
!runestip
\`\`\`
Displays this message

\`\`\`
!runestip help
\`\`\`
Displays this message

\`\`\`
!runestip balance
\`\`\`
Displays your balance

\`\`\`
!runestip deposit
\`\`\`
Displays your deposit address

\`\`\`
!runestip withdraw <address> <amount|all> 
\`\`\`
Withdraws the entered amount to a ${process.env.CURRENCY_NAME} address of your choice

\`\`\`
!runestip <@user> <amount|all>
\`\`\`
Tips the @ mentioned user with the desired amount

\`\`\`
!runestip rain <amount|all> [<@role>]
\`\`\`
Rains the desired amount onto all online users (optionally, within specified role)

\`\`\`
!runestip flood <amount|all> [<@role>]
\`\`\`
Floods the desired amount onto all users (including offline users) (optionally, within specified role)
  `)
  .setTimestamp()
  .setFooter(process.env.BOT_NAME, process.env.CURRENCY_LOGO);
