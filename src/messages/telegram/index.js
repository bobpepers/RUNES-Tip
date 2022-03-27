/* eslint-disable import/prefer-default-export */
import pjson from "../../../package.json";
import getCoinSettings from '../../config/settings';
import {
  getUserToMentionFromDatabaseRecord,
  getUserToMentionCtx,
} from "../../helpers/client/telegram/userToMention";
import { capitalize } from "../../helpers/utils";

const settings = getCoinSettings();

export const featureDisabledServerMessage = async () => {
  const result = `<u><b>This feature has been disabled for this group</b></u>

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const featureDisabledGlobalMessage = async () => {
  const result = `<u><b>This feature has been disabled</b></u>

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const telegramDepositConfirmedMessage = async (
  amount,
  trans,
) => {
  const result = `<b><u>Deposit #${trans.id}</u></b>

Deposit Confirmed
<b>${amount} ${settings.coin.ticker}</b> has been credited to your wallet

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const telegramIncomingDepositMessage = async (res) => {
  console.log(res.locals);
  const result = `<b><u>Deposit #${res.locals.transaction[0].id}</u></b>

incoming deposit detected for <b>${res.locals.amount} ${settings.coin.ticker}</b>
Balance will be reflected in your wallet in <b>~${settings.min.confirmations}+ confirmations</b>
${settings.coin.explorer}/tx/${res.locals.transaction[0].txid}

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const withdrawalAcceptedAdminMessage = async (updatedTrans) => {
  const amount = ((updatedTrans.amount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const fee = ((updatedTrans.feeAmount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const total = (((updatedTrans.amount - updatedTrans.feeAmount) / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const result = `<b><u>Admin withdraw message</u></b>
Withdrawal #${updatedTrans.id} Accepted

amount: <b>${amount} ${settings.coin.ticker}</b>
fee: <b>${fee} ${settings.coin.ticker}</b>
total: <b>${total} ${settings.coin.ticker}</b>

${settings.coin.explorer}/tx/${updatedTrans.txid}

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const withdrawalAcceptedMessage = async (
  transaction,
  updatedTrans,
) => {
  const amount = ((updatedTrans.amount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const fee = ((updatedTrans.feeAmount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const total = (((updatedTrans.amount - updatedTrans.feeAmount) / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const result = `<b><u>Withdraw #${updatedTrans.id}</u></b>

${transaction.address.wallet.user.username}'s withdrawal has been accepted

amount: <b>${amount} ${settings.coin.ticker}</b>
fee: <b>${fee} ${settings.coin.ticker}</b>
total: <b>${total} ${settings.coin.ticker}</b>

${settings.coin.explorer}/tx/${updatedTrans.txid}

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const telegramWithdrawalConfirmedMessage = async (
  user,
  trans,
) => {
  const [
    userToMention,
    userId,
  ] = await getUserToMentionFromDatabaseRecord(user);
  const result = `<b><u>Withdraw #${trans.id}</u></b>

<b><a href="tg://user?id=${userId}">${userToMention}</a></b>'s withdrawal has been complete

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const balanceMessage = async (
  user,
  priceInfo,
) => {
  const [
    userToMention,
    userId,
  ] = await getUserToMentionFromDatabaseRecord(user);

  const result = `<b><u><a href="tg://user?id=${userId}">${userToMention}'s Balance</a></u></b>

current available balance: <b>${user.wallet.available / 1e8} ${settings.coin.ticker}</b>
current locked balance: <b>${user.wallet.locked / 1e8} ${settings.coin.ticker}</b>
Estimated value: <b>$${(((user.wallet.available + user.wallet.locked) / 1e8) * priceInfo.price).toFixed(2)}</b>

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const telegramBotDisabledMessage = async () => {
  const result = `<b><u>Telegram tipbot disabled</u></b>

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const telegramBotMaintenanceMessage = async () => {
  const result = `<b><u>Telegram tipbot maintenance</u></b>

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const depositAddressNotFoundMessage = () => {
  const result = `Deposit Address not found`;
  return result;
};

export const reviewMessage = async (
  user,
  transaction,
) => {
  const amount = ((transaction.amount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const fee = ((transaction.feeAmount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const total = (((transaction.amount - transaction.feeAmount) / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const [
    userToMention,
    userId,
  ] = await getUserToMentionFromDatabaseRecord(user);
  const result = `<u><b>Withdrawal #${transaction.id}</b></u>

<b><a href="tg://user?id=${userId}">${userToMention}</a></b>, your withdrawal is being reviewed.

amount: <b>${amount} ${settings.coin.ticker}</b>
fee: <b>${fee} ${settings.coin.ticker}</b>
total: <b>${total} ${settings.coin.ticker}</b>

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};
export const telegramWithdrawalRejectedMessage = () => {
  const result = `Withdrawal has been rejected`;
  return result;
};

export const tipSuccessMessage = (
  user,
  amount,
  findUserToTip,
) => {
  const result = `@${user.username} tipped ${amount / 1e8} ${settings.coin.ticker} to @${findUserToTip.username}`;
  return result;
};

export const minimumMessage = async (
  setting,
  title,
) => {
  const result = `<u><b>${capitalize(title)}</b></u>

Minimum ${title} is <b>${Number(setting.min) / 1e8} ${settings.coin.ticker}</b>

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const claimTooFastFaucetMessage = async (
  user,
  distance,
) => {
  const [
    userToMention,
    userId,
  ] = await getUserToMentionFromDatabaseRecord(user);
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  const result = `<u><b>Faucet</b></u>

<b><a href="tg://user?id=${userId}">${userToMention}</a></b>, you have to wait ${hours === 1 ? `${hours} hour, ` : ''}${hours > 1 ? `${hours} hours, ` : ''}${minutes === 1 ? `${minutes} minute and ` : ''}${minutes > 1 ? `${minutes} minutes and ` : ''}${seconds === 1 ? `${seconds} second ` : ''} ${seconds > 1 ? `${seconds} seconds ` : ''}before claiming the faucet again.
(the faucet can be claimed every 4 hours)

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const faucetClaimedMessage = async (
  id,
  user,
  amount,
) => {
  const [
    userToMention,
    userId,
  ] = await getUserToMentionFromDatabaseRecord(user);

  const result = `<u><b>Faucet #${id}</b></u>

<b><a href="tg://user?id=${userId}">${userToMention}</a></b>, you have been tipped ${amount / 1e8} ${settings.coin.ticker} from the faucet.

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const groupNotFoundMessage = () => {
  const result = `Group not found`;
  return result;
};

export const rainErrorMessage = () => {
  const result = `Something went wrong with raining`;
  return result;
};

export const rainSuccessMessage = (
  amount,
  usersToRain,
  amountPerUser,
) => {
  const result = `Raining ${amount / 1e8} ${settings.coin.ticker} on ${usersToRain.length} active users -- ${amountPerUser / 1e8} ${settings.coin.ticker} each`;
  return result;
};

export const notEnoughActiveUsersMessage = () => {
  const result = `not enough active users`;
  return result;
};

export const insufficientBalanceMessage = async (
  title,
) => {
  const result = `<b><u>${capitalize(title)}</u></b>

Insufficient Balance

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const unableToFindUserMessage = () => {
  const result = `Unable to find user`;
  return result;
};

export const userNotFoundMessage = async (
  ctx,
  title,
) => {
  const [
    userToMention,
    userId,
  ] = await getUserToMentionCtx(ctx);

  const result = `<b><u>${capitalize(title)}</u></b>

<b><a href="tg://user?id=${userId}">${userToMention}</a></b>'s wallet was not found

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const telegramServerBannedMessage = async (
  server,
) => {
  const result = `🚫     <b><u>Server Banned</u></b>     🚫

Reason:
<b>${server.banMessage}</b>

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const telegramUserBannedMessage = async (
  user,
) => {
  const [
    userToMention,
    userId,
  ] = await getUserToMentionFromDatabaseRecord(user);

  const result = `🚫     <b><u><a href="tg://user?id=${userId}">${userToMention} Banned</a></u></b>     🚫

Reason:
<b>${user.banMessage}</b>

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const nodeIsOfflineMessage = () => {
  const result = `<b><u>Withdraw</u></b>

${settings.coin.name} node is offline

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const invalidAddressMessage = () => {
  const result = `<b><u>Withdraw</u></b>

Invalid ${settings.coin.name} Address

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const invalidAmountMessage = (
  title,
) => {
  const result = `<b><u>${capitalize(title)}</u></b>

Invalid amount

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const telegramLimitSpamMessage = async (
  ctx,
  myFunctionName,
) => {
  const [
    userToMention,
    userId,
  ] = await getUserToMentionCtx(ctx);
  const result = `<b><u>${myFunctionName}</u></b>

🚫 Slow down! 🚫

<a href="tg://user?id=${userId}">${userToMention}</a>, you're using this command too fast, wait a while before using it again.

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const depositAddressMessage = async (
  user,
) => {
  const [
    userToMention,
    userId,
  ] = await getUserToMentionFromDatabaseRecord(user);

  const result = `<b><u>Deposit Address</u></b>

<a href="tg://user?id=${userId}">${userToMention}</a>'s deposit address:
<b>${user.wallet.addresses[0].address}</b>

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const helpMessage = (
  withdraw,
) => {
  const result = `<b>Tipbot Help</b>

<code>${settings.bot.command.telegram}</code>
Display this message

<code>${settings.bot.command.telegram} help</code>
/help
Display this message

<code>${settings.bot.command.telegram} price</code>
/price
Display current ${settings.coin.ticker} price

<code>${settings.bot.command.telegram} info</code>
/info
Displays coin info

<code>${settings.bot.command.telegram} balance</code>
/balance
Display wallet balance

<code>${settings.bot.command.telegram} deposit</code>
/deposit
Displays your deposit address

<code>${settings.bot.command.telegram} faucet</code>
/faucet
Claim faucet

<code>${settings.bot.command.telegram} tip &lt;@user&gt; &lt;amount&gt;</code>
Tips the @ mentioned user with the desired amount, e.g.
example: <code>${settings.bot.command.telegram} tip @Bagosan 1.00</code>

<code>${settings.bot.command.discord} &lt;@user&gt; &lt;@user&gt; &lt;@user&gt; &lt;amount|all&gt; [split|each]</code>
Tips the @ mentioned users with the desired amount
example: <code>${settings.bot.command.discord} @test123456 @test123457 1.00 each</code>

<code>${settings.bot.command.discord} rain &lt;amount|all&gt;</code>
Rains the desired amount onto all recently online users
example: <code>${settings.bot.command.discord} rain 10</code>

<code>${settings.bot.command.telegram} flood &lt;amount|all&gt;</code>
Floods the desired amount onto all users (including offline users)
example: <code>${settings.bot.command.telegram} flood 5.00</code>

<code>${settings.bot.command.telegram} sleet &lt;amount&gt;</code>
Sleets the desired amount onto all active users (default time is 15min), e.g.
<code>${settings.bot.command.telegram} sleet 1.00</code>

<code>${settings.bot.command.telegram} withdraw &lt;address&gt; &lt;amount&gt;</code>
Withdraws the entered amount to a ${settings.coin.ticker} address of your choice, e.g.
<code>${settings.bot.command.telegram} withdraw ReU2nhYXamYRd2VBk4auwresov6jwLEuSg 5.20</code>
Note: Minimal amount to withdraw: ${withdraw.min / 1e8} ${settings.coin.ticker}. A withdrawal fee of ${withdraw.fee / 1e2}% ${settings.coin.ticker} will be automatically deducted from the amount. portion of the fee is donated to common faucet pot.

<pre>${settings.bot.name} v${pjson.version}</pre>`;

  return result;
};

// ${settings.coin.name === 'Runebase'
//     && `${settings.bot.command.telegram} referral
// /referral
// <code>Displays your referral count</code>
// <code>Note: We reward members for every 10 new members they add. current reward = 20 ${settings.coin.ticker}</code>

// ${settings.bot.command.telegram} referral top
// /top
// <code>Displays referral top 10</code>`}

export const InfoMessage = (
  blockHeight,
  priceInfo,
) => {
  const result = `<b><u>Coin Info</u></b>
${settings.coin.description}

<b><u>Coin Name</u></b>
${settings.coin.name}

<b><u>Coin Ticker</u></b>
${settings.coin.ticker}

<b><u>Current block height</u></b>
${blockHeight}

<b><u>Website</u></b>
${settings.coin.website}

<b><u>Github</u></b>
${settings.coin.github}

<b><u>Block Explorer</u></b>
${settings.coin.explorer}

<b><u>Discord Server</u></b>
${settings.coin.discord}

<b><u>Telegram Group</u></b>
${settings.coin.telegram}

<b><u>Exchanges</u></b>
${settings.coin.exchanges.join('\n')}

<b><u>Current price</u></b>
$${priceInfo.price} (source: coinpaprika)

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const confirmAllAmoutMessage = (
  ctx,
  operationName,
  userBeingTipped,
) => {
  const result = `<b>@${ctx.update.message.from.username}, are you sure that you want to ${operationName} ${userBeingTipped ? `${userBeingTipped} ` : ``}all your ${settings.coin.ticker}?
Accepted answers: <u>yes/no/y/n</u>;
Auto-cancel in 30 seconds.</b>

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const timeOutAllAmoutMessage = (
  ctx,
  operationName,
  userBeingTipped,
) => {
  const result = `<b>@${ctx.update.message.from.username}, the request to ${operationName} ${userBeingTipped ? `${userBeingTipped} ` : ``}all your ${settings.coin.ticker} has expired</b>

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const canceledAllAmoutMessage = (
  ctx,
  operationName,
  userBeingTipped,
) => {
  const result = `<b>@${ctx.update.message.from.username}, you canceled the request to ${operationName} ${userBeingTipped ? `${userBeingTipped} ` : ``}all your ${settings.coin.ticker}</b>

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const welcomeMessage = async (
  user,
) => {
  const [
    userToMention,
    userId,
  ] = await getUserToMentionFromDatabaseRecord(user);

  const result = `Welcome <a href="tg://user?id=${userId}">${userToMention}</a>, we created a wallet for you.
Type "${settings.bot.command.telegram} help" for usage info

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const warnDirectMessage = async (
  user,
) => {
  const [
    userToMention,
    userId,
  ] = await getUserToMentionFromDatabaseRecord(user);

  const result = `
<b><a href="tg://user?id=${userId}">${userToMention}</a>, i've sent you a direct message.</b>

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const disallowDirectMessageMessage = async (
  user,
) => {
  const [
    userToMention,
    userId,
  ] = await getUserToMentionFromDatabaseRecord(user);

  const result = `<a href="tg://user?id=${userId}">${userToMention}</a>, this function is not allowed in direct message.

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const priceMessage = async (
  priceRecord,
) => {
  let replyString = `<b><u>${settings.coin.ticker} PRICE</u></b>\n`;
  replyString += priceRecord.map((a) => `${a.currency}: ${a.price}`).join('\n');
  const result = `${replyString}

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const errorMessage = async (
  title,
) => {
  const result = `<u><b>${title}</b></u>

<b>Something went wrong.</b>

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const notEnoughUsers = (
  title,
) => {
  const result = `<u><b>${title}</b></u>

<b>Not enough users found.</b>

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const invalidTimeMessage = async (
  ctx,
  title,
) => {
  const [
    userToMention,
    userId,
  ] = await getUserToMentionCtx(ctx);

  const result = `<u><b>${title}</b></u>

<a href="tg://user?id=${userId}">${userToMention}</a>, Invalid time.

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const userListMessage = async (
  list,
) => {
  const result = `<b>${list}</b>`;
  return result;
};

export const tipSingleSuccessMessage = async (
  ctx,
  id,
  listOfUsersRained,
  amount,
) => {
  const [
    userToMention,
    userId,
  ] = await getUserToMentionCtx(ctx);

  const result = `<u><b>Tip #${id}</b></u>

<a href="tg://user?id=${userId}">${userToMention}</a> tipped <b>${amount / 1e8} ${settings.coin.ticker}</b> to ${listOfUsersRained[0]}

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const tipMultipleSuccessMessage = async (
  ctx,
  id,
  listOfUsersRained,
  amount,
  type,
) => {
  const [
    userToMention,
    userId,
  ] = await getUserToMentionCtx(ctx);
  const result = `<u><b>Tip #${id}</b></u>

<a href="tg://user?id=${userId}">${userToMention}</a> tipped <b>${(amount * listOfUsersRained.length) / 1e8} ${settings.coin.ticker}</b> to ${listOfUsersRained.length} users

Type: <b>${capitalize(type)}</b>

💸 <b>${amount / 1e8} ${settings.coin.ticker}</b> each 💸

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};

export const afterSuccessMessage = async (
  ctx,
  id,
  amount,
  userLength,
  amountPerUser,
  type,
  typeH,
) => {
  const [
    userToMention,
    userId,
  ] = await getUserToMentionCtx(ctx);

  const result = `<b><u>${type} #${id}</u></b>

<b><a href="tg://user?id=${userId}">${userToMention}</a></b> ${typeH} <u><b>${amount / 1e8} ${settings.coin.ticker}</b></u> on ${userLength} users
💸 <u><b>${amountPerUser / 1e8} ${settings.coin.ticker}</b></u> each 💸

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};
