"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("doctor", "workroom", {
      type: Sequelize.STRING,
      allowNull: true, // Cho phép null nếu chưa muốn nhập phòng ngay
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("doctor", "workroom");
  },
};
