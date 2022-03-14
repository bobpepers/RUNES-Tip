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
