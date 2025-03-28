"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("specialty", "img", {
      type: Sequelize.STRING,
      allowNull: true, // Cho phép giá trị null
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("specialty", "img");
  },
};
