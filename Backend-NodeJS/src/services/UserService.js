const session = require("express-session");
const { format } = require("date-fns");
const { vi, el, ca } = require("date-fns/locale");
const crypto = require("crypto");
const db = require("../models");
const { getUserbyID } = require("../controllers/CRUDController");
const { where } = require("sequelize");
const { resolve } = require("path");
const { getAllUser } = require("./CRUD");
const { rejects } = require("assert");

const handelUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = {};
      const isExit = await checkUserEmail(email);
      if (isExit) {
        // Người dùng đã tồn tại
        const user = await db.User.findOne({
          attributes: [
            "email",
            "fullname",
            "password",
            "phone",
            "address",
            "gender",
            "role",
          ],

          where: {
            email: email,
          },
          raw: true,
        });

        if (user) {
          // Hash mật khẩu người dùng nhập vào
          const hashedPassword = crypto
            .createHash("sha1")
            .update(password)
            .digest("hex");

          // So sánh mật khẩu đã băm với mật khẩu trong DB
          if (hashedPassword === user.password) {
            userData.errCode = 0;
            userData.errMessage = "Đăng nhập thành công";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Sai mật khẩu";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "Tài khoản không tồn tại";
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = "Tài khoản không tồn tại";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

const checkUserEmail = (email) => {
  return new Promise(async (resolve, rejct) => {
    try {
      const User = await db.User.findOne({
        where: {
          email: email,
        },
      });
      if (User) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      rejct(e);
    }
  });
};

const getAllUsers = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (id === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (id && id !== "ALL") {
        const user = await db.User.findOne({
          where: {
            id: id,
          },
          attributes: {
            exclude: ["password"],
          },
        });
        // Trả về mảng dù chỉ có một người dùng
        users = user ? [user] : [];
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

const CreateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem email đã tồn tại chưa
      const existingUser = await db.User.findOne({
        where: {
          email: data.email,
        },
      });

      if (existingUser) {
        // Nếu email đã tồn tại, reject và thông báo lỗi
        reject("Email đã tồn tại.");
        return;
      }
      // Mã hóa mật khẩu bằng SHA-1
      const hashedPassword = crypto
        .createHash("sha1")
        .update(data.password)
        .digest("hex");
      await db.User.create({
        email: data.email,
        password: hashedPassword,
        fullname: data.fullname,
        phone: data.phone,
        address: data.address,
        gender: data.gender === "1" ? true : false,
        role: "0",
      });
      resolve({
        errCode: 0,
        message: "OK",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const DeleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: {
          id: id,
        },
      });
      if (user) {
        await user.destroy();
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const EditUser = (data) => {
  return new Promise(async (resolve, rejects) => {
    try {
      const user = await db.User.findOne({
        where: {
          id: data.id,
        },
      });
      if (user) {
        user.fullname = data.fullname;
        user.phone = data.phone;
        user.address = data.address;

        await user.save();
        resolve({
          errCode: 0,
          errMessage: "Sua thanh cong",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Khong tim thay user",
        });
      }
    } catch (e) {
      rejects(e);
    }
  });
};

//Booking lịch khám bệnh
const Booking = (data) => {
  return new Promise(async (resolve, reject) => {
    if (!data.userID || !data.doctorID || !data.date || !data.time) {
      return resolve({
        errCode: 3,
        errMessage: "Thiếu thông tin bắt buộc (userID, doctorID, date, time)",
      });
    }

    const transaction = await db.sequelize.transaction(); // Bắt đầu transaction

    try {
      // Kiểm tra xem bác sĩ có tồn tại không
      const doctor = await db.doctor.findOne({
        where: { id: data.doctorID },
        transaction,
      });

      if (!doctor) {
        await transaction.rollback();
        return resolve({
          errCode: 1,
          errMessage: "Không tìm thấy bác sĩ",
        });
      }

      // Kiểm tra xem user có tồn tại không
      const user = await db.User.findOne({
        where: { id: data.userID },
        transaction,
      });

      if (!user) {
        await transaction.rollback();
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy người dùng",
        });
      }

      // Kiểm tra xem đã có lịch hẹn với bác sĩ trong khung giờ đó chưa
      // const existingAppointment = await db.Appointment.findOne({
      //   where: { doctorID: data.doctorID, date: data.date, time: data.time },
      //   transaction,
      // });

      // if (existingAppointment) {
      //   await transaction.rollback();
      //   return resolve({
      //     errCode: 4,
      //     errMessage: "Khung giờ này đã có người đặt",
      //   });
      // }

      // Tạo lịch hẹn mới
      await db.booking.create(
        {
          userID: data.userID,
          doctorID: data.doctorID,
          date: data.date,
          time: data.time,
          status: "1", // Trạng thái mặc định
        },
        { transaction }
      );

      await transaction.commit(); // Lưu tất cả thay đổi nếu không có lỗi
      resolve({
        errCode: 0,
        errMessage: "Đặt lịch thành công",
      });
    } catch (e) {
      await transaction.rollback(); // Quay lại trạng thái ban đầu nếu có lỗi
      reject(e);
    }
  });
};

module.exports = {
  handelUserLogin,
  getAllUsers,
  CreateUser,
  DeleteUser,
  EditUser,
  Booking,
};
