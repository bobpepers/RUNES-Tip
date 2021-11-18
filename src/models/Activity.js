// LEGENDE
// _i = insufficient balance
// _s = Success
// _f = fail
//
module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: [
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
      ],
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    spender_balance: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    earner_balance: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Domain model.
  const ActivityModel = sequelize.define('activity', modelDefinition, modelOptions);

  ActivityModel.associate = (model) => {
    ActivityModel.belongsTo(model.user, {
      as: 'spender',
      foreignKey: 'spenderId',
    });
    ActivityModel.belongsTo(model.user, {
      as: 'earner',
      foreignKey: 'earnerId',
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'transaction',
      foreignKey: 'transactionId',
    });
  };

  return ActivityModel;
};
