"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class schedules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  schedules.init(
    {
      doctorID: DataTypes.INTEGER,
      timeID: DataTypes.INTEGER,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "schedules",
      tableName: "schedules",
    }
  );
  schedules.associate = (models) => {
    schedules.belongsTo(models.doctor, {
      foreignKey: "doctorID",
      as: "Doctor",
    });
    schedules.belongsTo(models.time, {
      foreignKey: "timeID",
      as: "Time",
    });
  };
  return schedules;
};
