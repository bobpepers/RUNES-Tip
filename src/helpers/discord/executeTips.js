import BigNumber from "bignumber.js";
import db from '../../models';
import {
  invalidAmountMessage,
  insufficientBalanceMessage,
  minimumMessage,
} from '../../messages/discord';

const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

export const executeTipFunction = async (
  tipFunction,
  queue,
  amount = 0,
  discordClient,
  message,
  filteredMessageDiscord,
  io,
  groupTask,
  channelTask,
  setting,
) => {
  const task = await tipFunction(
    discordClient,
    message,
    filteredMessageDiscord,
    io,
    groupTask,
    channelTask,
    setting,
  );
  await queue.add(() => task);
};
