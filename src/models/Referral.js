module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Wallet model.
  const ReferralModel = sequelize.define('referral', modelDefinition, modelOptions);

  // 4: Wallet belongs to User

  ReferralModel.associate = (model) => {
    ReferralModel.belongsTo(model.user);
  };

  // 5: Wallet has many addresses

  return ReferralModel;
};
