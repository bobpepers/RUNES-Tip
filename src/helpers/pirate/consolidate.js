import { getInstance } from "../../services/rclient";

export async function consolidatePirate() {
  const balances = await getInstance().zGetBalances();
  // eslint-disable-next-line no-restricted-syntax
  for (const balance of balances) {
    if (balance.address !== process.env.PIRATE_MAIN_ADDRESS) {
      if (balance.unconfirmed === 0) {
        const sendAmount = balance.balance - 0.0001;
        // eslint-disable-next-line no-await-in-loop
        const result = await getInstance().zSendMany(
          balance.address,
          [{ address: process.env.PIRATE_MAIN_ADDRESS, amount: sendAmount }],
          1,
          0.0001,
        );
      }
    }
  }
}