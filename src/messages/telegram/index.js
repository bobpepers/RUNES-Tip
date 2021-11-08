/* eslint-disable import/prefer-default-export */

export const helpMessage = () => {
  const result = `<b>Tipbot Help</b>
      
/runestip
<code>Display this message</code>
    
      
/runestip help
/help
<code>Display this message</code>
    
      
/runestip price
/price
<code>Display current ${process.env.CURRENCY_SYMBOL} price</code>
    
      
/runestip exchanges
/exchanges
<code>Display list of exchanges to trade ${process.env.CURRENCY_SYMBOL}</code>
    
    
/runestip balance
/balance
<code>Display wallet balance</code>
    
      
/runestip tip [@user] [amount]
/tip [@user] [amount]
<code>Tips the @ mentioned user with the desired amount, e.g.</code>
/runestip tip @Bagosan 1.00
/tip @Bagosan 1.00
    
      
/runestip rain [amount]
/rain [amount]
<code>Rains the desired amount onto all active users (active time 3 hours), e.g.</code>
/runestip rain 1.00
/rain 1.00
    
      
/runestip deposit
/deposit
<code>Displays your deposit address</code>
    
      
/runestip withdraw [address] [amount]
/withdraw [address] [amount]
<code>Withdraws the entered amount to a ${process.env.CURRENCY_SYMBOL} address of your choice, e.g.</code>
/runestip withdraw ReU2nhYXamYRd2VBk4auwresov6jwLEuSg 5.20
/withdraw ReU2nhYXamYRd2VBk4auwresov6jwLEuSg 5.20
<code>Note: Minimal amount to withdraw: 2 ${process.env.CURRENCY_SYMBOL}. A withdrawal fee of 0.1 ${process.env.CURRENCY_SYMBOL} will be automatically deducted from the amount.</code>
      
    
/runestip referral
/referral
<code>Displays your referral count</code>
<code>Note: We reward members for every 10 new members they add. current reward = 20 ${process.env.CURRENCY_SYMBOL}</code>
      
    
/runestip referral top
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
