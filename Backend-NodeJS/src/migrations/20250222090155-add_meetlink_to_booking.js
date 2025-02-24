"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("booking", "meetlink", {
      type: Sequelize.STRING,
      allowNull: true, // Cho phép giá trị null
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("booking", "meetlink");
  },
};
