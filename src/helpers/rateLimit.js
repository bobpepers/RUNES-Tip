import * as RateLimiterFlexible from "rate-limiter-flexible";
import {
  discordLimitSpamMessage,
} from "../messages/discord";

const errorConsumer = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 2,
  duration: 15,
});

const rateLimiterReactdrop = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 4, // 4 messages (4 reactdrops)
  duration: 120, // every 120 seconds
});

const rateLimiterTip = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 10,
  duration: 120,
});

const rateLimiterWithdraw = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 4,
  duration: 120,
});

const rateLimiterHelp = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 20,
  duration: 120,
});

const rateLimiterPrice = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 20,
  duration: 120,
});

const rateLimiterInfo = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 20,
  duration: 120,
});

const rateLimiterRain = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 50,
  duration: 120,
});

const rateLimiterSoak = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 50,
  duration: 120,
});

const rateLimiterFlood = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 50,
  duration: 120,
});

const rateLimiterHurricane = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 50,
  duration: 120,
});

const rateLimiterIgnoreMe = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 5,
  duration: 120,
});

const rateLimiterSleet = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 20,
  duration: 120,
});

const rateLimiterBalance = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 50,
  duration: 120,
});

const rateLimiterFaucet = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 4,
  duration: 120,
});

const rateLimiterDeposit = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 4,
  duration: 120,
});

const rateLimiterStats = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 10,
  duration: 120,
});
const rateLimiterLeaderboard = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 10,
  duration: 120,
});

const rateLimiterPublicStats = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 8,
  duration: 120,
});

const rateLimiterThunder = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 180,
  duration: 120,
});

const rateLimiterThunderstorm = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 180,
  duration: 120,
});

const rateLimiterTrivia = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 4,
  duration: 120,
});

const rateLimiterListTransactions = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 2,
  duration: 30,
});

const rateLimiterFees = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 2,
  duration: 30,
});

const rateLimiterVoiceRain = new RateLimiterFlexible.default.RateLimiterMemory({
  points: 180,
  duration: 120,
});

export const myRateLimiter = async (
  client,
  message,
  platform,
  title,
) => {
  try {
    let userId;
    if (platform === 'discord') {
      if (message.user) {
        userId = message.user.id;
      } else if (message.author) {
        userId = message.author.id;
      }
    }
    if (platform === 'telegram') {
      if (
        message
        && message.update
        && message.update.message
        && message.update.message.from
        && message.update.message.from.id
      ) {
        userId = message.update.message.from.id;
      }
      if (
        message
        && message.update
        && message.update.callback_query
        && message.update.callback_query.from
        && message.update.callback_query.from.id
      ) {
        userId = message.update.callback_query.from.id;
      }
    }
    if (platform === 'matrix') {
      userId = message.author.id;
    }
    try {
      if (title.toLowerCase() === 'listtransactions') {
        await rateLimiterListTransactions.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'trivia') {
        await rateLimiterTrivia.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'thunder') {
        await rateLimiterThunder.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'thunderstorm') {
        await rateLimiterThunderstorm.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'stats') {
        await rateLimiterStats.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'leaderboard') {
        await rateLimiterLeaderboard.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'publicstats') {
        await rateLimiterPublicStats.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'faucet') {
        await rateLimiterFaucet.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'deposit') {
        await rateLimiterDeposit.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'balance') {
        await rateLimiterBalance.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'price') {
        await rateLimiterPrice.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'tip') {
        await rateLimiterTip.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'withdraw') {
        await rateLimiterWithdraw.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'help') {
        await rateLimiterHelp.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'info') {
        await rateLimiterInfo.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'rain') {
        await rateLimiterRain.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'soak') {
        await rateLimiterSoak.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'flood') {
        await rateLimiterFlood.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'hurricane') {
        await rateLimiterHurricane.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'ignoreme') {
        await rateLimiterIgnoreMe.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'sleet') {
        await rateLimiterSleet.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'reactdrop') {
        await rateLimiterReactdrop.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'fees') {
        await rateLimiterFees.consume(userId, 1);
        return false;
      }
      if (title.toLowerCase() === 'voicerain') {
        await rateLimiterVoiceRain.consume(userId, 1);
        return false;
      }
      throw new Error("no Rate limiter could be reached");
    } catch (err) {
      try {
        const notError = await errorConsumer.consume(userId, 1);
        if (notError.remainingPoints > 0) {
          if (platform === 'discord') {
            console.log('send error message ratelimiter');
            await message.channel.send({
              embeds: [
                discordLimitSpamMessage(
                  message,
                  title,
                ),
              ],
            });
            console.log('after send reply');
          }
          if (platform === 'telegram') {
            await message.channel.send({ embeds: [discordLimitSpamMessage(message, title)] });
          }
          if (platform === 'matrix') {
            await message.channel.send({ embeds: [discordLimitSpamMessage(message, title)] });
          }
        }
        return true;
      } catch (e) {
        return true;
      }
    }
  } catch (lastErrorCatch) {
    console.log(lastErrorCatch);
    console.log('catching the last error');
    return true;
  }
};
