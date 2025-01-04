"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("User", {
      // email: DataTypes.STRING,
      // password: DataTypes.STRING,
      // fullname: DataTypes.STRING,
      // phone: DataTypes.INTEGER,
      // address: DataTypes.STRING,
      // gender: DataTypes.BOOLEAN,
      // role: DataTypes.INTEGER,

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      email: {
        type: Sequelize.STRING,
      },

      password: {
        type: Sequelize.STRING,
      },

      fullname: {
        type: Sequelize.STRING,
      },

      phone: {
        type: Sequelize.INTEGER,
      },

      address: {
        type: Sequelize.STRING,
      },

      gender: {
        type: Sequelize.BOOLEAN,
      },

      role: {
        type: Sequelize.INTEGER,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("User");
  },
};
