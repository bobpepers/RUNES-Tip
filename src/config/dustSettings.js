module.exports = {
  startSyncBlock: 460912,
  bot: {
    name: "DustTipBot",
    color: "#0099ff",
    url: {
      telegram: "",
      discord: "https://discord.com/oauth2/authorize?client_id=924779779499110443&scope=bot&permissions=523328",
    },
    command: {
      discord: "!dusttip",
      telegram: "!dusttip",
      matrix: "!dusttip",
    },
    enabled: {
      telegram: true,
      discord: true,
      matrix: false,
    },
  },
  coin: {
    setting: "Komodo", // Supported names for setting (Runebase, Pirate, Komodo) // default fallback settings are Runebase
    name: "Dragonfairy",
    ticker: "DUST",
    logo: "https://downloads.runebase.io/dust.png",
    website: "n/a",
    explorer: "http://http://dragonfairy.gives",
    github: "n/a",
    telegram: "n/a",
    discord: "n/a",
    description: "Temporary promotional token (no value) for atomicdex marketing activities",
    exchanges: [
      "none",
    ],
    exampleAddress: 'ReU2nhYXamYRd2VBk4auwresov6jwLEuSg',
    halving: {
      enabled: false,
      every: 0, // amount of blocks for each halving
      initialBlockReward: 0, // initial amount of coins rewarded
      blockTime: 0, // blocktime in seconds
    },
  },
  faucet: 1, // (50 = 0,5% / 100 = 1% / ...) percentage of total per claim
  min: {
    confirmations: 6,
  },
};
