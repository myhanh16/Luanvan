"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class medicalrecords extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  medicalrecords.init(
    {
      diagnosis: DataTypes.STRING,
      treatment: DataTypes.STRING,
      create_at: DataTypes.DATE,
      bookingID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "medicalrecords",
      tableName: "medicalrecords",
    }
  );

  medicalrecords.associate = function (models) {
    medicalrecords.belongsTo(models.booking, {
      foreignKey: "bookingID",
      as: "booking",
    });
  };
  return medicalrecords;
};
