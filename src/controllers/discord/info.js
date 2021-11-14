/* eslint-disable import/prefer-default-export */
import { 
    warnDirectMessage, 
    coinInfoMessage,
} from '../../messages/discord';
import db from '../../models';

export const discordCoinInfo = async (message) => {
  const blockHeight = await db.block.findOne({
    order: [ [ 'id', 'DESC' ]],
  });
  const priceInfo = await db.priceInfo.findOne({
    order: [ [ 'id', 'ASC' ]],
  });
    console.log('blockheight');
    console.log(blockHeight);
  if (message.channel.type === 'DM') {
    message.author.send({ embeds: [coinInfoMessage(blockHeight.id, priceInfo)] });
  }
  if (message.channel.type === 'GUILD_TEXT') {
    
    
    message.channel.send({ embeds: [warnDirectMessage(message.author.id, 'Coin Info')] });
    message.author.send({ embeds: [coinInfoMessage(blockHeight.id, priceInfo)] });
  }
  return true;
};
