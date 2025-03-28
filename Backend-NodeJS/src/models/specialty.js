"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  specialty.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      img: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "specialty",
      tableName: "specialty",
    }
  );

  specialty.associate = (models) => {
    specialty.hasOne(models.doctor, {
      foreignKey: "specialtyID",
      as: "doctor",
    });
    specialty.hasOne(models.price, {
      foreignKey: "specialtyID",
      as: "price", // Alias này phải khớp với alias trong truy vấn
    });
  };

  return specialty;
};
