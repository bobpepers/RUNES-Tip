'use strict';

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Domain model.
  var SurfTicketModel = sequelize.define('SurfTicket', modelDefinition, modelOptions);

  SurfTicketModel.associate = function (model) {
    SurfTicketModel.belongsTo(model.order, { as: 'order' });
    SurfTicketModel.belongsTo(model.user, { as: 'user' });
  };

  return SurfTicketModel;
};