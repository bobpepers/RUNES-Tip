import { config } from "dotenv";
import { getInstance } from "./rclient";
import settings from '../config/settings';

config();

export const processWithdrawal = async (transaction) => {
  let response;
  const amount = ((transaction.amount - Number(transaction.feeAmount)) / 1e8);

  // Add New Currency here (default fallback is Runebase)
  if (settings.coin.setting === 'Runebase') {
    response = await getInstance().sendToAddress(transaction.to_from, (amount.toFixed(8)).toString());
  } else if (settings.coin.setting === 'Pirate') {
    const preResponse = await getInstance().zSendMany(
      process.env.PIRATE_MAIN_ADDRESS,
      [{ address: transaction.to_from, amount: amount.toFixed(8) }],
      1,
      0.0001,
    );
    let opStatus = await getInstance().zGetOperationStatus([preResponse]);
    while (!opStatus || opStatus[0].status === 'executing') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      opStatus = await getInstance().zGetOperationStatus([preResponse]);
    }
    console.log('opStatus');
    console.log(opStatus);
    response = opStatus[0].result.txid;
  } else {
    response = await getInstance().sendToAddress(transaction.to_from, (amount.toFixed(8)).toString());
  }

  return response;
};
