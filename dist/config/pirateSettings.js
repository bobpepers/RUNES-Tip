"use strict";

module.exports = {
  startSyncBlock: 500000,
  bot: {
    name: "PirateTipBot",
    color: "#BB9645",
    url: {
      telegram: "",
      discord: "https://discord.com/oauth2/authorize?client_id=906563045248094249&scope=bot&permissions=523328"
    },
    command: {
      discord: "!piratetip",
      telegram: "!piratetip"
    }
  },
  coin: {
    setting: "Pirate",
    // Supported names for setting (Runebase, Pirate) // default fallback settings are Runebase
    name: "Pirate",
    ticker: "ARRR",
    logo: "https://pirate.black/wp-content/uploads/2019/04/Pirate_Logo_Ship_Gold.png",
    website: "https://pirate.black",
    explorer: "https://explorer.pirate.black/",
    github: "https://github.com/PirateNetwork",
    telegram: "https://t.me/piratechain",
    discord: "https://discord.gg/V62f77NV6e",
    description: "Pirate Chain (ARRR) is a 100% private send cryptocurrency. It uses a privacy protocol that cannot be compromised by other users activity on the network. Most privacy coins are riddled with holes created by optional privacy. Pirate Chain uses ZK-Snarks to shield 100% of the peer to peer transactions on the blockchain making for highly anonymous and private transactions.",
    exchanges: ["https://tradeogre.com/exchange/BTC-ARRR", "https://trade.kucoin.com/trade/ARRR-USDT", "https://www.gate.io/trade/ARRR_USDT"],
    exampleAddress: 'zs1e3zh7a00wz4ej2lacpl2fvnrl680hkk766nt7z4ujl6rlj04n59ex7hjlnknvhwdc7vxzn0kcvt'
  },
  faucet: 50,
  // (50 = 0,5% / 100 = 1% / ...) percentage of total per claim
  min: {
    confirmations: 6
  }
};