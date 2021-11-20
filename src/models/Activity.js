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

    ActivityModel.belongsTo(model.transaction, {
      as: 'rain',
      foreignKey: 'rainId',
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'raintip',
      foreignKey: 'raintipId',
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'soak',
      foreignKey: 'soakId',
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'soaktip',
      foreignKey: 'soaktipId',
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'flood',
      foreignKey: 'floodId',
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'floodtip',
      foreignKey: 'floodtipId',
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'sleet',
      foreignKey: 'sleetId',
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'sleettip',
      foreignKey: 'sleettipId',
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'thunder',
      foreignKey: 'thunderId',
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'thundertip',
      foreignKey: 'thundertipId',
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'thunderstorm',
      foreignKey: 'thunderstormId',
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'thunderstormtip',
      foreignKey: 'thunderstormtipId',
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'reactdrop',
      foreignKey: 'reactdropId',
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'reactdroptip',
      foreignKey: 'reactdroptipId',
    });
  };

  return ActivityModel;
};
