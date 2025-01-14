"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class time extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  time.init(
    {
      starttime: DataTypes.TIME,
      endtime: DataTypes.TIME,
    },
    {
      sequelize,
      modelName: "time",
    }
  );
  return time;
};
