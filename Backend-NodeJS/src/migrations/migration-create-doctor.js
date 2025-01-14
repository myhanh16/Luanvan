"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("doctor", {
      // name: DataTypes.STRING,
      // specialization: DataTypes.STRING,

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER, // Kiểu dữ liệu INTEGER cho id
      },

      name: {
        type: Sequelize.STRING,
      },

      specialtyID: {
        type: Sequelize.INTEGER,
        references: {
          model: "specialty", // Tên bảng mà khóa ngoại tham chiếu
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
    await queryInterface.dropTable("doctor");
  },
};
