"use strict";

const { Sequelize } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("schedules", {
      // doctorID: DataTypes.INTEGER,
      // timeID: DataTypes.INTEGER,
      // date: DataTypes.DATE,
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER, // Kiểu dữ liệu INTEGER cho id
      },

      doctorID: {
        allowNull: false,
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "doctor", // Tên bảng tham chiếu (ví dụ bảng time hoặc bảng nào chứa thời gian)
          key: "id", // Tên cột tham chiếu trong bảng thời gian
        },
        onDelete: "CASCADE", // Xóa các bản ghi liên quan khi xóa thời gian
        onUpdate: "CASCADE", // Cập nhật các bản ghi liên quan khi ID thời gian thay đổi
      },

      date: {
        type: Sequelize.DATEONLY,
      },

      timeID: {
        allowNull: false,
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "time", // Tên bảng tham chiếu (ví dụ bảng time hoặc bảng nào chứa thời gian)
          key: "id", // Tên cột tham chiếu trong bảng thời gian
        },
        onDelete: "CASCADE", // Xóa các bản ghi liên quan khi xóa thời gian
        onUpdate: "CASCADE", // Cập nhật các bản ghi liên quan khi ID thời gian thay đổi
      },
      meetlink: {
        type: Sequelize.STRING,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("schedules");
  },
};
