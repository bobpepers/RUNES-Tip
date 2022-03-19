/* eslint-disable import/prefer-default-export */
import pjson from "../../../package.json";
import getCoinSettings from '../../config/settings';

const settings = getCoinSettings();

export const matrixBotDisabledMessage = () => {
  const result = {
    body: `Matrix tipbot disabled

${settings.bot.name} v${pjson.version}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>Matrix tipbot disabled</strong></p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const matrixBotMaintenanceMessage = () => {
  const result = {
    body: `Matrix tipbot maintenance

${settings.bot.name} v${pjson.version}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>Matrix tipbot maintenance</strong></p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const matrixWelcomeMessage = (username) => {
  const result = {
    body: `Welcome ${username}, we created a wallet for you.
Type "${settings.bot.command.matrix} help" for usage info

${settings.bot.name} v${pjson.version}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>Welcome ${username}, we created a wallet for you.
Type "${settings.bot.command.matrix} help" for usage info</strong></p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const inviteMatrixDirectMessageRoom = (username) => {
  const result = {
    body: `${username}, i invited you to a direct message room.
Please accept the invite to allow full functionality of this bot.

${settings.bot.name} v${pjson.version}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>${username}, i invited you to a direct message room.</strong></p>
<p><strong>Please accept the invite to allow full functionality of this bot.</strong></p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const warnDirectMessage = (
  username,
  title,
) => {
  const result = {
    body: `${title}

${username}, i've sent you a direct message.
    
${settings.bot.name} v${pjson.version}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p>${title}</p><p><strong>${username}, i've sent you a direct message</strong></p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const helpMessage = () => {
  const result = {
    is_direct: true,
    body: `Help v${pjson.version}
    ${settings.bot.command.matrix} 
show this help message

${settings.bot.command.matrix}  help
show this help message

${settings.bot.command.matrix} balance
Displays balance

${settings.bot.command.matrix}  deposit
Displays your deposit address

${settings.bot.command.matrix} withdraw <address> <amount|all>
Withdraws the entered amount to a ${settings.coin.name} address of your choice

${settings.bot.command.discord} flood [amount|all]
Floods the desired amount onto all users (including offline users)
example: ${settings.bot.command.discord} flood 5.00

${settings.bot.command.discord} sleet <amount|all> [<time>]
Makes a sleet storm with the desired amount onto all users that have been active in the room in the last 15 minutes (optionally, within specified time)
example: \`${settings.bot.command.discord} sleet 5.00\`, \`${settings.bot.command.discord} sleet 5.00 @supporters

${settings.bot.command.discord} ignoreme
Turns @mentioning you during mass operations on/off

${settings.bot.name} v${pjson.version}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>Help message v${pjson.version}</strong></p
    >
<code>${settings.bot.command.matrix}</code>
<p>show this help message</p>

<code>${settings.bot.command.matrix} help</code>
<p>show this message</p>

<code>${settings.bot.command.matrix} balance</code>
<p>Displays balance</p>

<code>${settings.bot.command.matrix} deposit</code>
<p>Displays your deposit address</p>

<code>${settings.bot.command.matrix} withdraw &lt;address&gt; &lt;amount|all&gt;</code>
<p>Withdraws the entered amount to a ${settings.coin.name} address of your choice</p>

<code>${settings.bot.command.discord} flood &lt;amount|all&gt;</code>
<p>Floods the desired amount onto all users (including offline users)<br>
example: ${settings.bot.command.discord} flood 5.00</p>

<code>${settings.bot.command.discord} sleet &lt;amount|all&gt; [&lt;time&gt;]</code>
<p>Makes a sleet storm with the desired amount onto all users that have been active in the room in the last 15 minutes (optionally, within specified time)<br>
example: \`${settings.bot.command.discord} sleet 5.00\`, \`${settings.bot.command.discord} sleet 5.00 @supporters</p>

<code>${settings.bot.command.discord} ignoreme</code>
<p>Turns @mentioning you during mass operations on/off</p>

<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const balanceMessage = (
  userId,
  user,
  priceInfo,
) => {
  const result = {
    body: `${user.username}'s current available balance: ${user.wallet.available / 1e8} ${settings.coin.ticker}
${user.username}'s current locked balance: ${user.wallet.locked / 1e8} ${settings.coin.ticker}
Estimated value of ${user.username}'s balance: $${(((user.wallet.available + user.wallet.locked) / 1e8) * priceInfo.price).toFixed(2)}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote>
<p>${user.username}'s current available balance: <strong>${user.wallet.available / 1e8} ${settings.coin.ticker}</strong><br>
${user.username}'s current locked balance: <strong>${user.wallet.locked / 1e8} ${settings.coin.ticker}</strong><br>
Estimated value of ${user.username}'s balance: <strong>$${(((user.wallet.available + user.wallet.locked) / 1e8) * priceInfo.price).toFixed(2)}</strong></p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const depositAddressMessage = (user) => {
  const result = {
    body: `deposit address: ${user.wallet.addresses[0].address}
${settings.bot.name} v${pjson.version}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>deposit address: </strong>${user.wallet.addresses[0].address}</p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const matrixIncomingDepositMessage = (res) => {
  const result = {
    body: `incoming deposit detected for ${res.locals.amount} ${settings.coin.ticker}
Balance will be reflected in your wallet in ~${settings.min.confirmations}+ confirmations
${settings.coin.explorer}/tx/${res.locals.transaction[0].txid}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote>
<p>incoming deposit detected for <strong>${res.locals.amount} ${settings.coin.ticker}</strong><br>
Balance will be reflected in your wallet in <strong>~${settings.min.confirmations}+ confirmations</strong><br>
${settings.coin.explorer}/tx/${res.locals.transaction[0].txid}</p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font>
</blockquote>`,
  };
  return result;
};

export const matrixDepositConfirmedMessage = (amount) => {
  const result = {
    body: `Deposit Confirmed 
${amount} ${settings.coin.ticker} has been credited to your wallet`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote>
<p>Deposit Confirmed<br> 
${amount} ${settings.coin.ticker} has been credited to your wallet</p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font>
</blockquote>`,
  };
  return result;
};

/// /

export const featureDisabledChannelMessage = (name) => {
  const result = {
    body: "This Feature has been disabled for this channel",
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>This Feature has been disabled for this channel</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const featureDisabledServerMessage = (name) => {
  const result = {
    body: "This Feature has been disabled for this server",
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>This Feature has been disabled for this server</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const featureDisabledGlobalMessage = (name) => {
  const result = {
    body: "This Feature has been disabled",
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>This Feature has been disabled</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const settingsNotFoundMessage = (name) => {
  const result = {
    body: "Settings not found!",
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>Settings not found!</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};
  ///

export const confirmAllAmoutMessage = (
  message,
  operationName,
  userBeingTipped,
) => {
  const result = {
    body: `${message.sender.name}, are you sure that you want to ${operationName} ${userBeingTipped ? `${userBeingTipped} ` : ``}all your ${settings.coin.ticker}?
Accepted answers: **yes/no/y/n**; 
Auto-cancel in 30 seconds.`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>${message.sender.name}, are you sure that you want to ${operationName} ${userBeingTipped ? `${userBeingTipped} ` : ``}all your ${settings.coin.ticker}?<br>
Accepted answers: **yes/no/y/n**;<br> 
Auto-cancel in 30 seconds.</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const canceledAllAmoutMessage = (
  message,
  operationName,
  userBeingTipped,
) => {
  const result = {
    body: `${message.sender.name}, you canceled the request to ${operationName} ${userBeingTipped ? `${userBeingTipped} ` : ``}all your ${settings.coin.ticker}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>${message.sender.name}, you canceled the request to ${operationName} ${userBeingTipped ? `${userBeingTipped} ` : ``}all your ${settings.coin.ticker}</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const timeOutAllAmoutMessage = (
  message,
  operationName,
  userBeingTipped,
) => {
  const result = {
    body: `${message.sender.name}, the request to ${operationName} ${userBeingTipped ? `${userBeingTipped} ` : ``}all your ${settings.coin.ticker} has expired`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p>${message.sender.name}, the request to ${operationName} ${userBeingTipped ? `${userBeingTipped} ` : ``}all your ${settings.coin.ticker} has expired</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const walletNotFoundMessage = (
  message,
  title,
) => {
  const result = {
    body: `${message.sender.name}, Wallet not found`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>${message.sender.name}, Wallet not found</strong></p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

/// /

export const invalidAmountMessage = (
  message,
  title,
) => {
  const result = {
    body: `${message.sender.name}, Invalid Amount`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>${message.sender.name}, Invalid Amount</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const insufficientBalanceMessage = (
  message,
  title,
) => {
  const result = {
    body: `${message.sender.name}, Insufficient balance`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>${message.sender.name}, Insufficient balance</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const minimumMessage = (
  message,
  setting,
  type,
) => {
  const result = {
    body: `${message.sender.name}, Minimum ${type} is ${setting.min / 1e8} ${settings.coin.ticker}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>${message.sender.name}, Minimum ${type} is ${setting.min / 1e8} ${settings.coin.ticker}</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const errorMessage = (
  message,
  setting,
  type,
) => {
  const result = {
    body: `Something went wrong.`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>Something went wrong.</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const reviewMessage = (
  message,
  transaction,
) => {
  const amount = ((transaction.amount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const fee = ((transaction.feeAmount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const total = (((transaction.amount - transaction.feeAmount) / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const result = {
    body: `${message.sender.name},  Your withdrawal is being reviewed
    
amount: ${amount}
fee: ${fee}
total: ${total}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>
    ${message.sender.name},  Your withdrawal is being reviewed<br><br>
    
amount: ${amount}<br>
fee: ${fee}<br>
total: ${total}<br>
</strong></p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const invalidAddressMessage = (
  message,
) => {
  const result = {
    body: `${message.sender.name}, Invalid Runebase Address`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>${message.sender.name}, Invalid Runebase Address</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const matrixWithdrawalAcceptedMessage = (
  updatedTrans,
) => {
  const amount = ((updatedTrans.amount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const fee = ((updatedTrans.feeAmount / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const total = (((updatedTrans.amount - updatedTrans.feeAmount) / 1e8).toFixed(8)).replace(/(\.0+|0+)$/, '');
  const result = {
    body: `Your withdrawal has been accepted

amount: ${amount}
fee: ${fee}
total: ${total}
    
${settings.coin.explorer}/tx/${updatedTrans.txid}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>
Your withdrawal has been accepted<br><br>
amount: ${amount}<br>
fee: ${fee}<br>
total: ${total}<br><br>
    
${settings.coin.explorer}/tx/${updatedTrans.txid}
</strong></p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const matrixWithdrawalConfirmedMessage = (
  userId,
  trans,
) => {
  const result = {
    body: `Withdraw #${trans.id}
${userId}, Your withdrawal has been complete`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><strong><h3>Withdraw #${trans.id}</h3><br><p>${userId}, Your withdrawal has been complete</p></strong>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const nodeOfflineMessage = () => {
  const result = {
    body: `Runebase node is offline`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><strong><p>Runebase node is offline</p></strong>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const notInDirectMessage = (message, title) => {
  const result = {
    body: `${title}
${message.sender.name}, Can't use this command in a direct message`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><strong><h6>${title}</h6><p>${message.sender.name}, Can't use this command in a direct message</p></strong>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};
/// //

export const matrixUserBannedMessage = (
  user,
) => {
  const result = {
    body: `🚫     User: ${user.username} Banned     🚫
Reason:
${user.banMessage}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><h6>🚫     User: ${user.username} Banned     🚫</h6>
<p><strong>Reason:<br>
${user.banMessage}</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const matrixRoomBannedMessage = (
  server,
) => {
  const result = {
    body: `🚫     Server Banned     🚫
Reason:
${server.banMessage}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote>
<h6>🚫     Server Banned     🚫</h6>
<p><strong>Reason:<br>
${server.banMessage}</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const notEnoughUsers = () => {
  const result = {
    body: "not enough users",
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>not enough users</strong></p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const userListMessage = (list) => {
  const result = {
    body: `${list}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>${list}</strong></p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const afterSuccessMessage = (
  message,
  id,
  amount,
  withoutBots,
  amountPerUser,
  type,
  typeH,
) => {
  const result = {
    body: `${type} #${id}
${message.sender.name} ${typeH} **${amount / 1e8} ${settings.coin.ticker}** on ${withoutBots.length} users
💸 **${amountPerUser / 1e8} ${settings.coin.ticker}** each 💸`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote>
<h6>${type} #${id}</h6>
<p><strong>${message.sender.name} ${typeH} <u>${amount / 1e8} ${settings.coin.ticker}</u> on ${withoutBots.length} users<br>
💸 <u>${amountPerUser / 1e8} ${settings.coin.ticker}</u> each 💸</strong></p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const groupNotFoundMessage = () => {
  const result = {
    body: "Room not found",
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>Room not found</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const invalidTimeMessage = (message, title) => {
  const result = {
    body: `${title}
${message.sender.name}, Invalid time`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><h6>${title}</h6><br><p><strong>${message.sender.name}, Invalid time</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const ignoreMeMessage = (message) => {
  const result = {
    body: `Ignore me
${message.sender.name}, you will no longer be @mentioned while receiving rains, soaks and other mass operations, but will continue to receive coins from them.
If you wish to be @mentioned, please issue this command again.`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><h6>Ignore me</h6><p><strong>${message.sender.name}, you will no longer be @mentioned while receiving rains, soaks and other mass operations, but will continue to receive coins from them.<br>
If you wish to be @mentioned, please issue this command again.</strong></p>
  <font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const unIngoreMeMessage = (message) => {
  const result = {
    body: `Ignore me
${message.sender.name}, you will again be @mentioned while receiving rains, soaks and other mass operations.
If you do not wish to be @mentioned, please issue this command again.`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><h6>Ignore me</h6><p><strong>${message.sender.name}, you will again be @mentioned while receiving rains, soaks and other mass operations.<br>
If you do not wish to be @mentioned, please issue this command again.</strong></p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

/// /
export const testMessage = () => {
  const result = {
    body: "Hello World",
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>Hello Worlds</strong></p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};
