/* eslint-disable import/prefer-default-export */

export const withdrawalAcceptedAdminMessage = (updatedTrans) => {
  const result = `Withdrawal Accepted
https://explorer.runebase.io/tx/${updatedTrans.txid}`;
  return result;
};

export const withdrawalAcceptedMessage = (transaction, updatedTrans) => {
  const result = `${transaction.address.wallet.user.username}'s withdrawal has been accepted
https://explorer.runebase.io/tx/${updatedTrans.txid}`;
  return result;
};

export const balanceMessage = (telegramUserName, user, priceInfo) => {
  const result = `${telegramUserName}'s current available balance: ${user.wallet.available / 1e8} ${process.env.CURRENCY_SYMBOL}
${telegramUserName}'s current locked balance: ${user.wallet.locked / 1e8} ${process.env.CURRENCY_SYMBOL}
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

export const somethingWentWrongMessage = () => {
  const result = `Something went wrong`;
  return result;
};

export const tipSuccessMessage = (user, amount, findUserToTip) => {
  const result = `@${user.username} tipped ${amount / 1e8} ${process.env.CURRENCY_SYMBOL} to @${findUserToTip.username}`;
  return result;
};

export const minimumTipMessage = () => {
  const result = `Minimum Tip is ${Number(process.env.MINIMUM_TIP) / 1e8} ${process.env.CURRENCY_SYMBOL}`;
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
  const result = `Raining ${amount / 1e8} ${process.env.CURRENCY_SYMBOL} on ${usersToRain.length} active users -- ${amountPerUser / 1e8} ${process.env.CURRENCY_SYMBOL} each`;
  return result;
};

export const minimumRainMessage = () => {
  const result = `Minimum Rain is ${Number(process.env.MINIMUM_RAIN) / 1e8} ${process.env.CURRENCY_SYMBOL}`;
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

export const minimumWithdrawalMessage = () => {
  const result = `Minimum ${process.env.CURRENCY_SYMBOL} is ${Number(process.env.MINIMUM_WITHDRAWAL) / 1e8} ${process.env.CURRENCY_SYMBOL}`;
  return result;
};

export const depositAddressMessage = (telegramUserName, user) => {
  const result = `${telegramUserName}'s deposit address: 
*${user.wallet.addresses[0].address}*`;
  return result;
};

export const welcomeMessage = (ctx) => {
  const result = `Welcome ${ctx.update.message.from.username}, we created a wallet for you.
Type "${process.env.TELEGRAM_BOT_COMMAND} help" for usage info`;
  return result;
};

export const helpMessage = () => {
  const result = `<b>Tipbot Help</b>
      
${process.env.TELEGRAM_BOT_COMMAND}
<code>Display this message</code>
    
      
${process.env.TELEGRAM_BOT_COMMAND} help
/help
<code>Display this message</code>
    
      
${process.env.TELEGRAM_BOT_COMMAND} price
/price
<code>Display current ${process.env.CURRENCY_SYMBOL} price</code>
    
      
${process.env.TELEGRAM_BOT_COMMAND} exchanges
/exchanges
<code>Display list of exchanges to trade ${process.env.CURRENCY_SYMBOL}</code>
    
    
${process.env.TELEGRAM_BOT_COMMAND} balance
/balance
<code>Display wallet balance</code>
    
      
${process.env.TELEGRAM_BOT_COMMAND} tip [@user] [amount]
/tip [@user] [amount]
<code>Tips the @ mentioned user with the desired amount, e.g.</code>
${process.env.TELEGRAM_BOT_COMMAND} tip @Bagosan 1.00
/tip @Bagosan 1.00
    
      
${process.env.TELEGRAM_BOT_COMMAND} rain [amount]
/rain [amount]
<code>Rains the desired amount onto all active users (active time 3 hours), e.g.</code>
${process.env.TELEGRAM_BOT_COMMAND} rain 1.00
/rain 1.00
    
      
${process.env.TELEGRAM_BOT_COMMAND} deposit
/deposit
<code>Displays your deposit address</code>
    
      
${process.env.TELEGRAM_BOT_COMMAND} withdraw [address] [amount]
/withdraw [address] [amount]
<code>Withdraws the entered amount to a ${process.env.CURRENCY_SYMBOL} address of your choice, e.g.</code>
${process.env.TELEGRAM_BOT_COMMAND} withdraw ReU2nhYXamYRd2VBk4auwresov6jwLEuSg 5.20
/withdraw ReU2nhYXamYRd2VBk4auwresov6jwLEuSg 5.20
<code>Note: Minimal amount to withdraw: 2 ${process.env.CURRENCY_SYMBOL}. A withdrawal fee of 0.1 ${process.env.CURRENCY_SYMBOL} will be automatically deducted from the amount.</code>
      
    
${process.env.TELEGRAM_BOT_COMMAND} referral
/referral
<code>Displays your referral count</code>
<code>Note: We reward members for every 10 new members they add. current reward = 20 ${process.env.CURRENCY_SYMBOL}</code>
      
    
${process.env.TELEGRAM_BOT_COMMAND} referral top
/top
<code>Displays referral top 10</code>`;

  return result;
};

export const exchangeListMessage = () => {
  const result = `
<b><u>Exchanges with ${process.env.CURRENCY_SYMBOL} listed</u></b>
  
<b>Bololex</b>
    
<pre>RUNES/BTC</pre>
https://bololex.com/trading/?symbol=RUNES-BTC
    
<pre>RUNES/USDT</pre>
https://bololex.com/trading/?symbol=RUNES-USDT
  
<pre>RUNES/DOGE</pre>
https://bololex.com/trading/?symbol=RUNES-DOGE
  
<pre>RUNES/ETH</pre>
https://bololex.com/trading/?symbol=RUNES-ETH
  
<pre>RUNES/BOLO</pre>
https://bololex.com/trading/?symbol=RUNES-BOLO
  
<b>Altmarkets</b>
    
<pre>RUNES/DOGE</pre>
https://v2.altmarkets.io/trading/runesdoge
    
<b>TxBit</b>
    
<pre>RUNES/BTC</pre>
https://txbit.io/Trade/RUNES/BTC
    
<pre>RUNES/ETH</pre>
https://txbit.io/Trade/RUNES/ETH
    
<b>StakeCenter</b>
   
<pre>RUNES/BTC</pre>
https://stakecenter.co/client/exchange/BTC/RUNES
    
<pre>RUNES/LTC</pre>
https://stakecenter.co/client/exchange/LTC/RUNES
    
<pre>RUNES/DOGE</pre>
https://stakecenter.co/client/exchange/DOGE/RUNES
    
<pre>RUNES/RDD</pre>
https://stakecenter.co/client/exchange/RDD/RUNES
    
<b>LocalRunes (any local currency)</b>
https://www.localrunes.com/`;
  return result;
};
