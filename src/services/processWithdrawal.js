import { config } from "dotenv";
import { getInstance } from "./rclient";
import getCoinSettings from '../config/settings';

const settings = getCoinSettings();

config();

export const processWithdrawal = async (transaction) => {
  let response;
  let responseStatus;
  const amount = ((transaction.amount - Number(transaction.feeAmount)) / 1e8);

  // Add New Currency here (default fallback is Runebase)
  if (settings.coin.setting === 'Runebase') {
    try {
      response = await getInstance().sendToAddress(transaction.to_from, (amount.toFixed(8)).toString());
    } catch (e) {
      console.log(e);
      responseStatus = e.reponse.status;
    }
  } else if (settings.coin.setting === 'Pirate') {
    try {
      const preResponse = await getInstance().zSendMany(
        process.env.PIRATE_MAIN_ADDRESS,
        [{ address: transaction.to_from, amount: amount.toFixed(8) }],
        1,
        0.0001,
      );
      let opStatus = await getInstance().zGetOperationStatus([preResponse]);
      while (!opStatus || opStatus[0].status === 'executing') {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 1000));
        opStatus = await getInstance().zGetOperationStatus([preResponse]);
      }
      response = opStatus[0].result.txid;
    } catch (e) {
      responseStatus = e.response.status;
      console.log(e);
    }
  } else {
    try {
      response = await getInstance().sendToAddress(transaction.to_from, (amount.toFixed(8)).toString());
    } catch (e) {
      responseStatus = e.reponse.status;
    }
  }

  return [
    response,
    responseStatus,
  ];
};
