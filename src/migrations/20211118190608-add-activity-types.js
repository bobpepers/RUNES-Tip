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
        ),
      });
  },
};
