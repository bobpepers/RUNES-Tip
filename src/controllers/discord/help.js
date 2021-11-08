/* eslint-disable import/prefer-default-export */
require('dotenv').config();
const { MessageEmbed } = require('discord.js');

const textChannelHelp = new MessageEmbed()
  .setColor('#0099ff')
  .setTitle('Help')
  .setDescription('I\'ve sent you a direct message.')
  .setThumbnail('https://downloads.runebase.io/logo-512x512.png')
  .setTimestamp()
  .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');

const help = new MessageEmbed()
  .setColor('#0099ff')
  .setTitle('RunesTip Help')
  .setDescription(`\`\`\`
!runestip
\`\`\`
Displays this message

\`\`\`
!runestip help
\`\`\`
Displays this message

\`\`\`
!runestip balance
\`\`\`
Displays your balance

\`\`\`
!runestip deposit
\`\`\`
Displays your deposit address

\`\`\`
!runestip withdraw <address> <amount|all> 
\`\`\`
Withdraws the entered amount to a ${process.env.CURRENCY_NAME} address of your choice

\`\`\`
!arrrtip <@user> <amount|all>
\`\`\`
Tips the @ mentioned user with the desired amount

\`\`\`
!arrrtip rain <amount|all> [<@role>]
\`\`\`
Rains the desired amount onto all online users (optionally, within specified role)

\`\`\`
!arrrtip flood <amount|all> [<@role>]
\`\`\`
Floods the desired amount onto all users (including offline users) (optionally, within specified role)
  `)
  .setTimestamp()
  .setFooter('RunesTipBot', 'https://downloads.runebase.io/logo-512x512.png');

export const discordHelp = (message) => {
  if (message.channel.type === 'DM') {
    message.author.send({ embeds: [help] });
  }
  if (message.channel.type === 'GUILD_TEXT') {
    message.channel.send({ embeds: [textChannelHelp] });
    message.author.send({ embeds: [help] });
  }
  return true;
};
