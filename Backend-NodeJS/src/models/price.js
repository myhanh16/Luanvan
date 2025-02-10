"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class price extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  price.init(
    {
      price: DataTypes.INTEGER,
      specialtyID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "price",
      tableName: "price",
    }
  );
  price.associate = (models) => {
    price.belongsTo(models.specialty, {
      foreignKey: "specialtyID",
      as: "specialty",
    });
  };
  return price;
};
