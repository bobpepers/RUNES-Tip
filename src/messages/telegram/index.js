/* eslint-disable import/prefer-default-export */
import getCoinSettings from '../../config/settings';

const settings = getCoinSettings();

export const featureDisabledServerMessage = () => {
  const result = `This feature has been disabled for this server`;
  return result;
};
export const featureDisabledGlobalMessage = () => {
  const result = `This feature has been disabled`;
  return result;
};
export const telegramDepositConfirmedMessage = (amount) => {
  const result = `Deposit Confirmed 
${amount} ${settings.coin.ticker} has been credited to your wallet`;
  return result;
};

export const telegramIncomingDepositMessage = (res) => {
  const result = `incoming deposit detected for ${res.locals.amount} ${settings.coin.ticker}
Balance will be reflected in your wallet in ~${settings.min.confirmations}+ confirmations
${settings.coin.explorer}/tx/${res.locals.transaction[0].txid}`;
  return result;
};

export const withdrawalAcceptedAdminMessage = (updatedTrans) => {
  const result = `Withdrawal Accepted
${settings.coin.explorer}/tx/${updatedTrans.txid}`;
  return result;
};

export const withdrawalAcceptedMessage = (transaction, updatedTrans) => {
  const result = `${transaction.address.wallet.user.username}'s withdrawal has been accepted
  ${settings.coin.explorer}/tx/${updatedTrans.txid}`;
  return result;
};

export const balanceMessage = (telegramUserName, user, priceInfo) => {
  const result = `${telegramUserName}'s current available balance: ${user.wallet.available / 1e8} ${settings.coin.ticker}
${telegramUserName}'s current locked balance: ${user.wallet.locked / 1e8} ${settings.coin.ticker}
Estimated value of ${telegramUserName}'s balance: $${(((user.wallet.available + user.wallet.locked) / 1e8) * priceInfo.price).toFixed(2)}`;
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

export const tipSuccessMessage = (user, amount, findUserToTip) => {
  const result = `@${user.username} tipped ${amount / 1e8} ${settings.coin.ticker} to @${findUserToTip.username}`;
  return result;
};

export const minimumMessage = (setting, title) => {
  const result = `Minimum ${title} is ${Number(setting.min) / 1e8} ${settings.coin.ticker}`;
  return result;
};

export const claimTooFastFaucetMessage = (username, distance) => {
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  const result = `${username}, you have to wait ${hours === 1 ? `${hours} hour` : ''} ${hours > 1 ? `${hours} hours,` : ''} ${minutes === 1 ? `${minutes} minute` : ''} ${minutes > 1 ? `${minutes} minutes and` : ''} ${seconds === 1 ? `${seconds} second` : ''} ${seconds > 1 ? `${seconds} seconds` : ''} before claiming the faucet again (the faucet can be claimed every 4 hours).`;
  return result;
};
export const faucetClaimedMessage = (username, amount) => {
  const result = `${username}, you have been tipped ${amount / 1e8} ${settings.coin.ticker} from the faucet.`;
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

export const rainSuccessMessage = (amount, usersToRain, amountPerUser) => {
  const result = `Raining ${amount / 1e8} ${settings.coin.ticker} on ${usersToRain.length} active users -- ${amountPerUser / 1e8} ${settings.coin.ticker} each`;
  return result;
};

export const notEnoughActiveUsersMessage = () => {
  const result = `not enough active users`;
  return result;
};

export const insufficientBalanceMessage = () => {
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

export const depositAddressMessage = (telegramUserName, user) => {
  const result = `${telegramUserName}'s deposit address: 
*${user.wallet.addresses[0].address}*`;
  return result;
};

export const welcomeMessage = (ctx) => {
  const result = `Welcome ${ctx.update.message.from.username}, we created a wallet for you.
Type "${settings.bot.command.telegram} help" for usage info`;
  return result;
};

export const helpMessage = (withdraw) => {
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
`;

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
$${priceInfo.price} (source: coinpaprika)`;
  return result;
};
