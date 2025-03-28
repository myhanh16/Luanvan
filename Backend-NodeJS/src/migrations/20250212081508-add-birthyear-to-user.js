"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("User", "birthYear", {
      type: Sequelize.INTEGER,
      allowNull: true, // Cho phép NULL để không làm mất dữ liệu cũ
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("User", "birthYear");
  },
};
