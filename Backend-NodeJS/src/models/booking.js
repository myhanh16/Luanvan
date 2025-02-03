"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  booking.init(
    {
      appointment_date: DataTypes.DATE,
      time_solt: DataTypes.DATE,
      status: DataTypes.STRING,
      doctorID: DataTypes.INTEGER,
      userID: DataTypes.INTEGER,
      statusID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "booking",
      tableName: "booking",
    }
  );
  return booking;
};
