/* eslint-disable import/prefer-default-export */
import pjson from "../../../package.json";
import getCoinSettings from '../../config/settings';
import {
  getUserToMentionFromDatabaseRecord,
  getUserToMentionCtx,
} from "../../helpers/client/telegram/userToMention";

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
  const result = `Withdrawal Accepted
${settings.coin.explorer}/tx/${updatedTrans.txid}`;
  return result;
};

export const withdrawalAcceptedMessage = async (
  transaction,
  updatedTrans,
) => {
  const result = `${transaction.address.wallet.user.username}'s withdrawal has been accepted
  ${settings.coin.explorer}/tx/${updatedTrans.txid}`;
  return result;
};

export const telegramWithdrawalConfirmedMessage = async (user) => {
  const result = `${user.username}'s withdrawal has been complete`;
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

export const withdrawalReviewMessage = () => {
  const result = `Withdrawal is being reviewed`;
  return result;
};
export const telegramWithdrawalRejectedMessage = () => {
  const result = `Withdrawal has been rejected`;
  return result;
};

export const generalErrorMessage = () => {
  const result = `Something went wrong`;
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
  const result = `Minimum ${title} is ${Number(setting.min) / 1e8} ${settings.coin.ticker}`;
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
  
<b><a href="tg://user?id=${userId}">${userToMention}</a></b>, you have to wait ${hours === 1 ? `${hours} hour` : ''} ${hours > 1 ? `${hours} hours,` : ''} ${minutes === 1 ? `${minutes} minute` : ''} ${minutes > 1 ? `${minutes} minutes and` : ''} ${seconds === 1 ? `${seconds} second` : ''} ${seconds > 1 ? `${seconds} seconds` : ''} before claiming the faucet again (the faucet can be claimed every 4 hours).

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

export const insufficientBalanceMessage = async () => {
  const result = `Insufficient Balance`;
  return result;
};

export const unableToFindUserMessage = () => {
  const result = `Unable to find user`;
  return result;
};

export const userNotFoundMessage = () => {
  const result = `User not found`;
  return result;
};

export const invalidAddressMessage = () => {
  const result = `Invalid Runebase Address`;
  return result;
};

export const invalidAmountMessage = () => {
  const result = `Invalid amount`;
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
      
${settings.bot.command.telegram}
<code>Display this message</code>
    
      
${settings.bot.command.telegram} help
/help
<code>Display this message</code>
    
      
${settings.bot.command.telegram} price
/price
<code>Display current ${settings.coin.ticker} price</code>
    
      
${settings.bot.command.telegram} info
/info
<code>Displays coin info</code>
    
    
${settings.bot.command.telegram} balance
/balance
<code>Display wallet balance</code>

${settings.bot.command.telegram} faucet
/faucet
<code>Claim faucet</code>
    
      
${settings.bot.command.telegram} tip [@user] [amount]
/tip [@user] [amount]
<code>Tips the @ mentioned user with the desired amount, e.g.</code>
${settings.bot.command.telegram} tip @Bagosan 1.00
/tip @Bagosan 1.00
    
      
${settings.bot.command.telegram} rain [amount]
/rain [amount]
<code>Rains the desired amount onto all active users (active time 3 hours), e.g.</code>
${settings.bot.command.telegram} rain 1.00
/rain 1.00
    
      
${settings.bot.command.telegram} deposit
/deposit
<code>Displays your deposit address</code>
    
      
${settings.bot.command.telegram} withdraw [address] [amount]
/withdraw [address] [amount]
<code>Withdraws the entered amount to a ${settings.coin.ticker} address of your choice, e.g.</code>
${settings.bot.command.telegram} withdraw ReU2nhYXamYRd2VBk4auwresov6jwLEuSg 5.20
/withdraw ReU2nhYXamYRd2VBk4auwresov6jwLEuSg 5.20
<code>Note: Minimal amount to withdraw: ${withdraw.min / 1e8} ${settings.coin.ticker}. A withdrawal fee of ${withdraw.fee / 1e2}% ${settings.coin.ticker} will be automatically deducted from the amount. half of the fee is donated to common faucet pot.</code>
      
${settings.coin.name === 'Runebase'
    && `${settings.bot.command.telegram} referral
/referral
<code>Displays your referral count</code>
<code>Note: We reward members for every 10 new members they add. current reward = 20 ${settings.coin.ticker}</code>
      
    
${settings.bot.command.telegram} referral top
/top
<code>Displays referral top 10</code>`}     

<pre>${settings.bot.name} v${pjson.version}</pre>`;

  return result;
};

export const InfoMessage = (blockHeight, priceInfo) => {
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

  const result = `<a href="tg://user?id=${userId}">${userToMention}</a>, i've sent you a direct message.

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

export const errorMessage = (
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

export const userListMessage = (
  list,
) => {
  const result = `<b>${list}</b>`;
  return result;
};

export const afterSuccessMessage = async (
  ctx,
  id,
  amount,
  withoutBots,
  amountPerUser,
  type,
  typeH,
) => {
  const [
    userToMention,
    userId,
  ] = await getUserToMentionCtx(ctx);

  const result = `<b><u>${type} #${id}</u></b>

<b><a href="tg://user?id=${userId}">${userToMention}</a></b> ${typeH} <u><b>${amount / 1e8} ${settings.coin.ticker}</b></u> on ${withoutBots.length} users
💸 <u><b>${amountPerUser / 1e8} ${settings.coin.ticker}</b></u> each 💸

<pre>${settings.bot.name} v${pjson.version}</pre>`;
  return result;
};
