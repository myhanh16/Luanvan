"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("medicalrecords", {
      // diagnosis: DataTypes.STRING,
      // treatment: DataTypes.STRING,
      // create_at: DataTypes.DATE,

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      diagnosis: {
        type: Sequelize.STRING,
      },

      treatment: {
        type: Sequelize.STRING,
      },

      create_at: {
        type: Sequelize.DATE,
      },

      bookingID: {
        type: Sequelize.INTEGER,
        references: {
          model: "booking", // Tên bảng mà khóa ngoại tham chiếu
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
    await queryInterface.dropTable("medicalrecords");
  },
};
