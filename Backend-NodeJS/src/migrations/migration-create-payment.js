"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payment", {
      //     bookingID: DataTypes.INTEGER,
      //   amount: DataTypes.DECIMAL(10, 2),
      //   status: DataTypes.STRING,
      //   transactionID: DataTypes.STRING,
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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

      amount: {
        type: Sequelize.DECIMAL(10, 2), // Số tiền thanh toán
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING(50), // 'PENDING', 'PAID', 'FAILED'
        allowNull: false,
        defaultValue: "PENDING",
      },

      transactionID: {
        type: Sequelize.STRING(255), // ID giao dịch từ cổng thanh toán
        allowNull: true,
        unique: true,
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
    await queryInterface.dropTable("payment");
  },
};
