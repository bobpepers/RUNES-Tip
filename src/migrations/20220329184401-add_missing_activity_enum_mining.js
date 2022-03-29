// LEGENDE
// _i = insufficient balance
// _s = Success
// _f = fail
//
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface
      .changeColumn('activity', 'type', {
        type: DataTypes.ENUM(
          'depositAccepted',
          'depositComplete',
          'withdrawRequested',
          'withdrawAccepted',
          'withdrawComplete',
          'withdrawRejected',
          'help',
          'balance',
          'deposit',
          'info',
          'tip_i',
          'tip_f',
          'tip_s',
          'rain_i',
          'rain_f',
          'rain_s',
          'raintip_f',
          'raintip_s',
          'soak_i',
          'soak_f',
          'soak_s',
          'soaktip_f',
          'soaktip_s',
          'flood_i',
          'flood_f',
          'flood_s',
          'floodtip_f',
          'floodtip_s',
          'sleet_i',
          'sleet_f',
          'sleet_s',
          'sleettip_f',
          'sleettip_s',
          'thunder_i',
          'thunder_f',
          'thunder_s',
          'thundertip_f',
          'thundertip_s',
          'thunderstorm_i',
          'thunderstorm_f',
          'thunderstorm_s',
          'reactdrop_i',
          'reactdrop_f',
          'reactdrop_s',
          'reactdroptip_f',
          'reactdroptip_s',
          'thunderstormtip_s',
          'thunderstormtip_f',
          'ignore',
          'price',
          'hurricane_f',
          'hurricane_i',
          'hurricane_s',
          'hurricanetip_s',
          'faucet_add',
          'faucettip_s',
          'faucettip_f',
          'faucettip_i',
          'faucettip_t',
          'voicerain_s',
          'voicerain_i',
          'voicerain_f',
          'voiceraintip_s',
          'withdraw_i',
          'withdraw_f',
          'waterFaucet',
          'tiptip_s',
          'fees_s',
          'fees_f',
          'ignoreme_s',
          'ignoreme_f',
          'publicstats_s',
          'publicstats_f',
          'stats_i',
          'stats_f',
          'stats_s',
          'tip_faucet_s',
          'tiptip_faucet_s',
          'trivia_s',
          'trivia_i',
          'trivia_f',
          'triviatip_s',
          'listtransactions_f',
          'listtransactions_s',
          'balance_s',
          'balance_f',
          'help_s',
          'help_f',
          'deposit_s',
          'deposit_f',
          'info_s',
          'info_f',
          'price_s',
          'price_f',
          'halving_s',
          'halving_f',
          'mining_s',
          'mining_f',
        ),
      });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface
      .changeColumn('activity', 'type', {
        type: DataTypes.ENUM(
          'depositAccepted',
          'depositComplete',
          'withdrawRequested',
          'withdrawAccepted',
          'withdrawComplete',
          'withdrawRejected',
          'help',
          'balance',
          'deposit',
          'info',
          'tip_i',
          'tip_f',
          'tip_s',
          'rain_i',
          'rain_f',
          'rain_s',
          'raintip_f',
          'raintip_s',
          'soak_i',
          'soak_f',
          'soak_s',
          'soaktip_f',
          'soaktip_s',
          'flood_i',
          'flood_f',
          'flood_s',
          'floodtip_f',
          'floodtip_s',
          'sleet_i',
          'sleet_f',
          'sleet_s',
          'sleettip_f',
          'sleettip_s',
          'thunder_i',
          'thunder_f',
          'thunder_s',
          'thundertip_f',
          'thundertip_s',
          'thunderstorm_i',
          'thunderstorm_f',
          'thunderstorm_s',
          'reactdrop_i',
          'reactdrop_f',
          'reactdrop_s',
          'reactdroptip_f',
          'reactdroptip_s',
          'thunderstormtip_s',
          'thunderstormtip_f',
          'ignore',
          'price',
          'hurricane_f',
          'hurricane_i',
          'hurricane_s',
          'hurricanetip_s',
          'faucet_add',
          'faucettip_s',
          'faucettip_f',
          'faucettip_i',
          'faucettip_t',
          'voicerain_s',
          'voicerain_i',
          'voicerain_f',
          'voiceraintip_s',
          'withdraw_i',
          'withdraw_f',
          'waterFaucet',
          'tiptip_s',
          'fees_s',
          'fees_f',
          'ignoreme_s',
          'ignoreme_f',
          'publicstats_s',
          'publicstats_f',
          'stats_i',
          'stats_f',
          'stats_s',
          'tip_faucet_s',
          'tiptip_faucet_s',
          'trivia_s',
          'trivia_i',
          'trivia_f',
          'triviatip_s',
          'listtransactions_f',
          'listtransactions_s',
          'balance_s',
          'balance_f',
          'help_s',
          'help_f',
          'deposit_s',
          'deposit_f',
          'info_s',
          'info_f',
          'price_s',
          'price_f',
          'halving_s',
          'halving_f',
        ),
      });
  },
};
