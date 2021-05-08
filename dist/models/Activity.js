'use strict';

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM,
      values: ['login', 'register', 'registerVerified', 'resetpass', 'resetpassComplete', 'logout', 'surfStart', 'surfComplete', 'click', 'depositAccepted', 'depositComplete', 'withdrawRequested', 'withdrawAccepted', 'withdrawComplete', 'withdrawRejected', 'createSurfOrder', 'cancelSurfOrder', 'createClickOrder', 'cancelClickOrder', 'jackpot', 'buyTicket', 'buyWebslot', 'buyClickslot', 'newDomain', 'banned', 'referralBonus']
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    spender_balance: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    earner_balance: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Domain model.
  var ActivityModel = sequelize.define('activity', modelDefinition, modelOptions);

  ActivityModel.associate = function (model) {
    ActivityModel.belongsTo(model.ip, {
      as: 'ip'
    });
    ActivityModel.belongsTo(model.user, {
      as: 'spender',
      foreignKey: 'spenderId'
    });
    ActivityModel.belongsTo(model.user, {
      as: 'earner',
      foreignKey: 'earnerId'
    });
    ActivityModel.belongsTo(model.order, {
      as: 'order',
      foreignKey: 'orderId'
    });
    ActivityModel.belongsTo(model.domain, {
      as: 'domainActivity',
      foreignKey: 'domainId'
    });
    ActivityModel.belongsTo(model.transaction, {
      as: 'txActivity',
      foreignKey: 'txId'
    });
    ActivityModel.belongsTo(model.faucetRolls, {
      as: 'faucetRoll'
    });
  };

  return ActivityModel;
};