"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      fullname: DataTypes.STRING,
      phone: DataTypes.INTEGER,
      address: DataTypes.STRING,
      gender: DataTypes.BOOLEAN,
      role: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "User",
    }
  );
  User.associate = (models) => {
    User.hasOne(models.doctor, { foreignKey: "userID", as: "doctor" });
  };
  return User;
};
