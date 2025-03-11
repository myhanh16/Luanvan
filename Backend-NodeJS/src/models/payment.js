"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  payment.init(
    {
      bookingID: DataTypes.INTEGER,
      amount: DataTypes.DECIMAL(10, 2),
      status: DataTypes.STRING,
      transactionID: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "payment",
      tableName: "payment",
    }
  );

  payment.associate = function (models) {
    payment.belongsTo(models.booking, {
      foreignKey: "bookingID",
      as: "booking",
    });
  };
  return payment;
};
