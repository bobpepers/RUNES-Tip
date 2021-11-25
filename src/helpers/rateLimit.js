import * as RateLimiterFlexible from "rate-limiter-flexible";
// import { RateLimiter } from "@riddea/telegraf-rate-limiter";
import {
  discordLimitSpamMessage,
} from "../messages/discord";

const errorConsumer = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 2,
  duration: 15,
});

const rateLimiterReactdrop = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 4,
  duration: 120,
});

export const limitReactDrop = async (message) => {
  try {
    const limited = await rateLimiterReactdrop.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      console.log(notError);
      console.log('notError');
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'ReactDrop')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};
