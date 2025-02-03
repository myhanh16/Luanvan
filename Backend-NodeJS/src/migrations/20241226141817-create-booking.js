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
          model: "doctor", // Đảm bảo tên bảng chính xác (nếu bảng tên là Doctors)
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: "user", // Đúng với tên bảng Users đã tạo
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      statusID: {
        type: Sequelize.INTEGER,
        references: {
          model: "status", // Đúng với tên bảng Users đã tạo
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
