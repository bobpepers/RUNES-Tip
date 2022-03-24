limport { Transaction } from "sequelize";
import db from '../../../models';
import logger from "../../logger";
import {
  disallowDirectMessageMessage,
  errorMessage,
} from '../../../messages/discord';

const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

export const disallowDirectMessage = async (
  ctx,
  user,
  functionType,
  io,
) => {
  const activity = [];
  let disallow = false;

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    if (ctx.update.message.chat.id === ctx.update.message.from.id) {
      const notDirectActivity = await db.activity.create({
        type: `${functionType}_f`,
        spenderId: user.id,
      }, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      activity.unshift(notDirectActivity);
      await ctx.replyWithHTML(
        await disallowDirectMessageMessage(
          user,
        ),
      );
      disallow = true;
    }

    t.afterCommit(() => {
      console.log('done');
    });
  }).catch(async (err) => {
    try {
      await db.error.create({
        type: functionType,
        error: `${err}`,
      });
    } catch (e) {
      logger.error(`Error Telegram: ${e}`);
    }
    console.log(err);
    logger.error(`${functionType} error: ${err}`);
    try {
      await ctx.replyWithHTML(errorMessage(
        capitalize(functionType),
      ));
    } catch (err) {
      console.log(err);
    }
  });
  if (activity.length > 0) {
    io.to('admin').emit('updateActivity', {
      activity,
    });
  }
  return disallow;
};
