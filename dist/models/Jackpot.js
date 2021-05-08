'use strict';

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    jackpot_amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    total_tickets: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    endsAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    phase: {
      type: DataTypes.ENUM,
      values: ['running', 'complete'],
      defaultValue: 'running'
    },
    winner_one_tickets: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    winner_two_tickets: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    winner_three_tickets: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    winner_four_tickets: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    winner_five_tickets: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    winner_six_tickets: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    winner_seven_tickets: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    winner_eight_tickets: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    winner_nine_tickets: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    winner_ten_tickets: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Domain model.
  var JackpotModel = sequelize.define('jackpot', modelDefinition, modelOptions);

  JackpotModel.associate = function (model) {
    JackpotModel.belongsTo(model.user, {
      as: 'winner_one',
      foreignKey: 'winnerOneId'
    });
    JackpotModel.belongsTo(model.user, {
      as: 'winner_two',
      foreignKey: 'winnerTwoId'
    });
    JackpotModel.belongsTo(model.user, {
      as: 'winner_three',
      foreignKey: 'winnerThreeId'
    });
    JackpotModel.belongsTo(model.user, {
      as: 'winner_four',
      foreignKey: 'winnerFourId'
    });
    JackpotModel.belongsTo(model.user, {
      as: 'winner_five',
      foreignKey: 'winnerFiveId'
    });
    JackpotModel.belongsTo(model.user, {
      as: 'winner_six',
      foreignKey: 'winnerSixId'
    });
    JackpotModel.belongsTo(model.user, {
      as: 'winner_seven',
      foreignKey: 'winnerSevenId'
    });
    JackpotModel.belongsTo(model.user, {
      as: 'winner_eigth',
      foreignKey: 'winnerEigthId'
    });
    JackpotModel.belongsTo(model.user, {
      as: 'winner_nine',
      foreignKey: 'winnerNineId'
    });
    JackpotModel.belongsTo(model.user, {
      as: 'winner_ten',
      foreignKey: 'winnerTenId'
    });
  };

  return JackpotModel;
};