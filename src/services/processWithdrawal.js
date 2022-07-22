import { config } from "dotenv";
import { getInstance } from "./rclient";
import getCoinSettings from '../config/settings';
import { fromUtf8ToHex } from "../helpers/utils";

const settings = getCoinSettings();

config();

export const processWithdrawal = async (transaction) => {
  let response;
  let responseStatus;
  const amount = ((transaction.amount - Number(transaction.feeAmount)) / 1e8);

  // Add New Currency here (default fallback is Runebase)
  if (settings.coin.setting === 'Runebase') {
    try {
      const listUnspent = await getInstance().listUnspent();
      const foundConsolidationRunebaseAddress = listUnspent.find((obj) => obj.address === process.env.RUNEBASE_CONSOLIDATION_ADDRESS);
      if (
        foundConsolidationRunebaseAddress
        && (amount + 0.005) < foundConsolidationRunebaseAddress.amount
      ) {
        const inputs = [
          {
            txid: foundConsolidationRunebaseAddress.txid,
            vout: foundConsolidationRunebaseAddress.vout,
          },
        ];
        const outputs = [
          {
            [transaction.to_from]: (amount.toFixed(8)).toString(),
          },
          {
            [process.env.RUNEBASE_CONSOLIDATION_ADDRESS]: ((((foundConsolidationRunebaseAddress.amount - amount) - 0.005)).toFixed(8)).toString(),
          },
        ];
        const rawTransaction = await getInstance().createRawTransaction(
          inputs,
          outputs,
        );
        const signedTransaction = await getInstance().signRawTransactionWithWallet(rawTransaction);
        response = await getInstance().sendRawTransaction(signedTransaction.hex);
      }
    } catch (e) {
      console.log(e);
      responseStatus = e.reponse.status;
    }
  } else if (settings.coin.setting === 'Komodo') {
    try {
      response = await getInstance().sendToAddress(transaction.to_from, (amount.toFixed(8)).toString());
    } catch (e) {
      console.log(e);
      responseStatus = e.reponse.status;
    }
  } else if (settings.coin.setting === 'Pirate') {
    try {
      const hexMemo = await fromUtf8ToHex(transaction.memo);
      const preResponse = await getInstance().zSendMany(
        process.env.PIRATE_MAIN_ADDRESS,
        [{
          address: transaction.to_from,
          amount: amount.toFixed(8),
          ...(
            hexMemo && {
              memo: hexMemo,
            }
          ),
        }],
        1,
        0.0001,
      );
      let opStatus = await getInstance().zGetOperationStatus([preResponse]);
      while (!opStatus || opStatus[0].status === 'executing') {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // eslint-disable-next-line no-await-in-loop
        opStatus = await getInstance().zGetOperationStatus([preResponse]);
      }
      response = opStatus[0].result.txid;
    } catch (e) {
      console.log(e);
      responseStatus = e.response.status;
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
