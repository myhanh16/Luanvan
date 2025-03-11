"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("User", "isActive", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Mặc định tài khoản được kích hoạt
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("User", "isActive");
  },
};
