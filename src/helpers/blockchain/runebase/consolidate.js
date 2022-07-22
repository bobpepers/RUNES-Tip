/* eslint-disable no-restricted-syntax */
import { Transaction } from "sequelize";
import { config } from "dotenv";
import BigNumber from 'bignumber.js';
import db from '../../../models';
import { getInstance } from "../../../services/rclient";

config();

const BN = BigNumber.clone({ DECIMAL_PLACES: 8 });

export async function consolidateRunebaseFunds() {
  const listUnspent = await getInstance().listUnspent();
  if (listUnspent.length > 1) {
    const sliceTo = listUnspent.length > 10 ? 10 : listUnspent.length;
    const unspentSlice = listUnspent.slice(0, sliceTo);
    console.log(unspentSlice);
    const inputs = unspentSlice.map((u) => ({
      txid: u.txid,
      vout: u.vout,
    }));
    const amount = unspentSlice
      .reduce((prev, { amount }) => prev.plus(amount), new BN(0))
      .toNumber();
    const outputs = [{ [process.env.RUNEBASE_CONSOLIDATION_ADDRESS]: amount }];

    const create = await getInstance().walletCreateFundedPsbt(
      inputs,
      outputs,
      0,
      {
        changeAddress: process.env.RUNEBASE_CONSOLIDATION_ADDRESS,
        subtractFeeFromOutputs: [0],
      },
    );
    const signed = await getInstance().walletProcessPsbt(create.psbt);
    const final = await getInstance().finalizePsbt(signed.psbt);
    const { hex } = final;
    const txid = await getInstance().sendRawTransaction(hex);
  } else {
    console.log('No need for consolidation');
  }
}
