import db from '../../models';

require('dotenv').config();

const { Sequelize, Transaction, Op } = require('sequelize');
const { Markup } = require('telegraf');
const { getInstance } = require('../../services/rclient');
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
<code>Displays referral top 10</code>
  `, Markup.inlineKeyboard([
    [Markup.button.callback('Balance', 'Balance'),
      Markup.button.callback('Price', 'Price')],
    [Markup.button.callback('Exchanges', 'Exchanges'),
      Markup.button.callback('Deposit', 'Deposit')],
    [Markup.button.callback('Referral', 'Referral'),
      Markup.button.callback('Referral Top 10', 'ReferralTop')],
  ]));
};

/**
 * Fetch Wallet
 */
export const dbsync = async (req, res, next) => {
  db.sequelize.sync().then(() => {
    res.status(201).json({ message: 'Tables Created' });
  });
};
