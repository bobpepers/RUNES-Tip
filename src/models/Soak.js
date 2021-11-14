module.exports = (sequelize, DataTypes) => {
    const modelDefinition = {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      userCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    };
  
    const modelOptions = {
      freezeTableName: true,
    };

    const SoakModel = sequelize.define('soak', modelDefinition, modelOptions);
  
    SoakModel.associate = (model) => {
        SoakModel.belongsTo(model.user);
        SoakModel.hasMany(model.soaktip);
    };

    return SoakModel;
  };
  