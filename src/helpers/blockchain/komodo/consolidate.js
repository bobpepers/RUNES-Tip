/* eslint-disable no-restricted-syntax */
import { Transaction } from "sequelize";
import { config } from "dotenv";
import db from '../../../models';
import { getInstance } from "../../../services/rclient";

config();

export async function consolidateKomodoFunds() {
  // const transactions = await getInstance().listTransactions(1000);
  console.log('consolidating');
  const listUnspent = await getInstance().listUnspent();
  console.log(listUnspent.length);
  console.log("length");
  if (listUnspent.length > 1) {
    const consolidate = await getInstance().zMergeToAddress(
      ["ANY_TADDR"],
      process.env.KOMODO_CONSOLIDATION_ADDRESS,
    );
    console.log(consolidate);
  }
}
