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
    user_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },
    lastname: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },
    role: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastSeen: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the User model.
  const UserModel = sequelize.define('user', modelDefinition, modelOptions);

  UserModel.associate = (model) => {
    UserModel.hasOne(model.wallet);
    UserModel.hasMany(model.tip, {
      foreignKey: 'userId',
      as: 'userTip',
    });
    UserModel.hasMany(model.tip, {
      foreignKey: 'userTippedId',
      as: 'userTipped',
    });
    UserModel.hasMany(model.rain);
    UserModel.hasMany(model.raintip);
  };

  return UserModel;
};
// module.exports = UserModel;
