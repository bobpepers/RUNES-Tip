import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getMemberCount = async (client, Api, ctx) => {
  const chatId = Math.abs(ctx.message.chat.id);
  console.log(chatId);
  const result = await client.invoke(
    new Api.messages.GetFullChat({
      chatId,
    }),
  );
  console.log(result.users); // prints the result
  // console.log(ctx);
  // console.log('ctx');
  // const chatId = ctx.chat.id;
  // const membersCount = await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getChat?chat_id=${chatId}`);
  // console.log(membersCount.data.result);
  // return membersCount;
};
