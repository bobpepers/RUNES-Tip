module.exports = {
  blockchainEnv: {
    MAINNET: 'mainnet',
    TESTNET: 'testnet',
  },

  ipcEvent: {
    SERVER_START_ERROR: 'server-start-error',
    RUNEBASED_ERROR: 'runebased-error',
    RUNEBASED_KILLED: 'runebased-killed',
    API_INITIALIZED: 'api-initialized',
    WALLET_ENCRYPTED: 'wallet-encrypted',
    WALLET_BACKUP: 'wallet-backup',
    WALLET_IMPORT: 'wallet-import',
  },

  txState: {
    PENDING: 'PENDING',
    SUCCESS: 'CONFIRMED',
    FAIL: 'FAIL',
  },

  fill: {
    topic: '0x0000000000000000000000000000000000000000000000000000000000000000',
  },

  orderState: {
    CONFIRMED: 'CONFIRMED',
    PENDING: 'PENDING',
    FAIL: 'FAIL',
    ACTIVE: 'ACTIVE',
    FULFILLED: 'FULFILLED',
    PENDINGCANCEL: 'PENDINGCANCEL',
    CANCELED: 'CANCELED',
  },

  execFile: {
    RUNEBASED: 'runebased',
    RUNEBASE_QT: 'runebase-qt',
    RUNEBASE_CLI: 'runebase-cli',
  },

  BLOCK_0_TIMESTAMP: 1530246365,
  SATOSHI_CONVERSION: 10 ** 8,
};
