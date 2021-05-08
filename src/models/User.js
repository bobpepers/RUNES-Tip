module.exports = (sequelize, DataTypes) => {
// 1: The model schema.
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
    hooks: {
      beforeCreate: hashPassword,
    },
  };

  // 3: Define the User model.
  const UserModel = sequelize.define('user', modelDefinition, modelOptions);

  UserModel.associate = (model) => {
    UserModel.hasOne(model.wallet);
  };

  return UserModel;
};
// module.exports = UserModel;
