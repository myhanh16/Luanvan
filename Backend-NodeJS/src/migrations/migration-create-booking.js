"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bookings", {
      // appointment_date: DataTypes.DATE,
      // time_solt: DataTypes.DATE,
      // status: DataTypes.STRING,

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      appointment_date: {
        type: Sequelize.DATE,
      },

      time_slot: {
        type: Sequelize.DATE,
      },

      status: {
        type: Sequelize.STRING,
      },

      doctorID: {
        type: Sequelize.INTEGER,
        references: {
          model: "doctor", // Tên bảng mà khóa ngoại tham chiếu
          key: "id", // Tên trường khóa chính
        },
        onUpdate: "CASCADE", // Cập nhật khi khóa chính thay đổi
        onDelete: "SET NULL", // Đặt giá trị NULL khi khóa chính bị xóa
      },

      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: "User", // Tên bảng mà khóa ngoại tham chiếu
          key: "id", // Tên trường khóa chính
        },
        onUpdate: "CASCADE", // Cập nhật khi khóa chính thay đổi
        onDelete: "SET NULL", // Đặt giá trị NULL khi khóa chính bị xóa
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
    await queryInterface.dropTable("bookings");
  },
};
