import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');
const { getInstance } = require('../services/rclient');
/**
 * Fetch Wallet
 */
export const fetchExchangeList = async (ctx) => {
  // console.log('32111');
  // console.log(ctx);
  // console.log(ctx.update.message.from);
  ctx.replyWithHTML(`
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
https://www.localrunes.com/
`);
};

/**
 * Fetch Wallet
 */
export const dbsync = async (req, res, next) => {
  db.sequelize.sync().then(() => {
    res.status(201).json({ message: 'Tables Created' });
  });
};
