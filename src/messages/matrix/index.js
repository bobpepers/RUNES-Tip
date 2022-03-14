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
) => {
  const result = {
    body: `${username}, i've sent you a direct message.
    
${settings.bot.name} v${pjson.version}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>${username}, i've sent you a direct message</strong></p>
<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

export const helpMessage = () => {
  const result = {
    body: `Help message v${pjson.version}
    ${settings.bot.command.matrix} 
show this help message

${settings.bot.command.matrix}  help
show this help message

${settings.bot.command.matrix}  deposit
Displays your deposit address

${settings.bot.command.matrix} withdraw <address> <amount|all>
Withdraws the entered amount to a ${settings.coin.name} address of your choice

${settings.bot.name} v${pjson.version}`,
    msgtype: "m.text",
    format: 'org.matrix.custom.html',
    formatted_body: `<blockquote><p><strong>Help message v${pjson.version}</strong></p
    >
<code>${settings.bot.command.matrix}</code>
<p>show this help message</p>

<code>${settings.bot.command.matrix} help</code>
<p>show this message</p>

<code>${settings.bot.command.matrix}  deposit</code>
<p>Displays your deposit address</p>

<code>${settings.bot.command.matrix} withdraw \<address\> \<amount|all\></code>
<p>Withdraws the entered amount to a ${settings.coin.name} address of your choice</p>

<font color="${settings.bot.color}">${settings.bot.name} v${pjson.version}</font></blockquote>`,
  };
  return result;
};

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
