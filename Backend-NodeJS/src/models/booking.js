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
      booking_date: DataTypes.DATE,
      scheduleID: DataTypes.INTEGER,
      // doctorID: DataTypes.INTEGER,
      userID: DataTypes.INTEGER,
      statusID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "booking",
      tableName: "booking",
    }
  );
  booking.associate = (models) => {
    booking.belongsTo(models.schedules, {
      foreignKey: "scheduleID",
      as: "schedules",
    });
    // booking.belongsTo(models.doctor, {
    //   foreignKey: "doctorID",
    //   as: "doctor",
    // });
    booking.belongsTo(models.status, {
      foreignKey: "statusID",
      as: "status",
    });
    booking.belongsTo(models.User, { foreignKey: "userID", as: "User" });
    booking.hasMany(models.medicalrecords, {
      foreignKey: "bookingID",
      as: "medicalrecords",
    });

    booking.hasOne(models.payment, {
      foreignKey: "bookingID",
      as: "payment",
    });
  };

  return booking;
};
