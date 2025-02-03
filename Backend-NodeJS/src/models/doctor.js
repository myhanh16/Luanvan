"use strict";
const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  doctor.init(
    {
      experience_years: DataTypes.INTEGER,
      workroom: DataTypes.STRING,
      description: DataTypes.STRING,
      img: DataTypes.STRING,
      userID: DataTypes.INTEGER,
      specialtyID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "doctor",
      tableName: "doctor",
    }
  );
  doctor.associate = (models) => {
    doctor.belongsTo(models.User, { foreignKey: "userID", as: "User" });
  };
  return doctor;
};
