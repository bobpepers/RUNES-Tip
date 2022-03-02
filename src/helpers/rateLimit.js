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
  points: 4,
  duration: 120,
});

export const limitListTransactions = async (message) => {
  try {
    const limited = await rateLimiterListTransactions.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'List Transactions')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitTrivia = async (message) => {
  try {
    const limited = await rateLimiterTrivia.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Trivia')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitThunder = async (message) => {
  try {
    const limited = await rateLimiterThunder.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Thunder')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitThunderStorm = async (message) => {
  try {
    const limited = await rateLimiterThunderstorm.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Thunderstorm')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitStats = async (message) => {
  try {
    const limited = await rateLimiterStats.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Tip')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};
export const limitLeaderboard = async (message) => {
  try {
    const limited = await rateLimiterLeaderboard.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Tip')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};
export const limitPublicStats = async (message) => {
  try {
    const limited = await rateLimiterPublicStats.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Tip')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};
export const limitFaucet = async (message) => {
  try {
    const limited = await rateLimiterFaucet.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Tip')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};
export const limitDeposit = async (message) => {
  try {
    const limited = await rateLimiterDeposit.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Tip')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitBalance = async (message) => {
  try {
    const limited = await rateLimiterBalance.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Tip')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitPrice = async (message) => {
  try {
    const limited = await rateLimiterPrice.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Price')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitTip = async (message) => {
  try {
    const limited = await rateLimiterTip.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Tip')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitWithdraw = async (message) => {
  try {
    const limited = await rateLimiterWithdraw.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Withdraw')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitHelp = async (message) => {
  try {
    const limited = await rateLimiterHelp.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Help')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitInfo = async (message) => {
  try {
    const limited = await rateLimiterInfo.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Info')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitRain = async (message) => {
  try {
    const limited = await rateLimiterRain.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Rain')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitSoak = async (message) => {
  try {
    const limited = await rateLimiterSoak.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Soak')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitFlood = async (message) => {
  try {
    const limited = await rateLimiterFlood.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Flood')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitHurricane = async (message) => {
  try {
    const limited = await rateLimiterHurricane.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Hurricane')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitIgnoreMe = async (message) => {
  try {
    const limited = await rateLimiterIgnoreMe.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'IgnoreMe')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitSleet = async (message) => {
  try {
    const limited = await rateLimiterSleet.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'Sleet')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};

export const limitReactDrop = async (message) => {
  try {
    const limited = await rateLimiterReactdrop.consume(message.author.id, 1);
    return false;
  } catch (err) {
    try {
      const notError = await errorConsumer.consume(message.author.id, 1);
      if (notError.remainingPoints > 0) {
        await message.channel.send({ embeds: [discordLimitSpamMessage(message, 'ReactDrop')] });
      }
      return true;
    } catch (e) {
      return true;
    }
  }
};
