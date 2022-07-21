"use strict";

module.exports = {
  startSyncBlock: 460912,
  bot: {
    name: "TokelTip",
    color: "#550a8a",
    url: {
      telegram: "",
      discord: "https://discord.com/oauth2/authorize?client_id=999573343000854658&scope=bot&permissions=523328"
    },
    command: {
      discord: "!tokeltip",
      telegram: "!tokeltip",
      matrix: "!tokeltip"
    },
    enabled: {
      telegram: true,
      discord: true,
      matrix: false
    }
  },
  coin: {
    setting: "Komodo",
    // Supported names for setting (Runebase, Pirate, Komodo) // default fallback settings are Runebase
    name: "Tokel",
    ticker: "TKL",
    logo: "https://downloads.runebase.io/tkl.png",
    website: "https://tokel.io",
    explorer: "https://explorer.tokel.io",
    github: "https://github.com/TokelPlatform",
    telegram: "https://t.me/TokelPlatformchat",
    discord: "https://discord.gg/2KeH7yudWb",
    description: "Create NFTs and tokens easily. No complicated smart contracts. No Gas Fees. The Tokel UTXO chain makes tokenization easy, accessible and cheap for everyone.",
    exchanges: ["https://dex-trade.com/spot/trading/TKLBTC"],
    exampleAddress: 'RM8FFca9yKBAKGHz5iEvhqp41XJJqNr8Cr',
    halving: {
      enabled: false,
      every: 0,
      // amount of blocks for each halving
      initialBlockReward: 0,
      // initial amount of coins rewarded
      blockTime: 0 // blocktime in seconds

    }
  },
  faucet: 1,
  // (50 = 0,5% / 100 = 1% / ...) percentage of total per claim
  min: {
    confirmations: 6
  }
};