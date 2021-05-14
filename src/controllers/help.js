import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');
const { getInstance } = require('../services/rclient');
/**
 * Fetch Wallet
 */
export const fetchHelp = async (ctx) => {
  console.log('32111');
  console.log(ctx);
  console.log(ctx.update.message.from);
  ctx.replyWithHTML(`
<b>Tipbot Help</b>

/runestip
<pre>display this message</pre>

/runestip help
<pre>display this message</pre>

/runestip price
<pre>display current RUNES price</pre>

/runestip exchanges
<pre>display list of exchanges to trade RUNES</pre>

/runestip tip [@user] [amount]
<pre>Tips the @ mentioned user with the desired amount, e.g.</pre>
/runestip tip @Bagosan 1.00

/runestip rain [amount]
<pre>Rains the desired amount onto all active users (active time 3 hours), e.g.</pre>
/runestip rain 1.00

/runestip deposit
<pre>Displays your deposit address</pre>

/runestip withdraw [address] [amount]
<pre>Withdraws the entered amount to a RUNES address of your choice, e.g.</pre>
/runestip withdraw ReU2nhYXamYRd2VBk4auwresov6jwLEuSg 5.20
<pre>Note: Minimal amount to withdraw: 2 RUNES. A withdrawal fee of 0.1 RUNES will be automatically deducted from the amount.</pre>

/runestip referral
<pre>Displays your referral count</pre>
<pre>Note: We reward members for every 10 new members they add. current reward = 20 RUNES</pre>
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
