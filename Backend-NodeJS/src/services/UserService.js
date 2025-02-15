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
const { atob } = require("buffer");

const handelUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = {};
      const isExit = await checkUserEmail(email);
      if (isExit) {
        // Người dùng đã tồn tại
        const user = await db.User.findOne({
          attributes: [
            "id",
            "email",
            "fullname",
            "password",
            "phone",
            "address",
            "gender",
            "birthYear",
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
        birthYear: data.birthYear,
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
// const Booking = (data) => {
//   return new Promise(async (resolve, reject) => {
//     if (!data.userID || !data.doctorID || !data.date || !data.time) {
//       return resolve({
//         errCode: 3,
//         errMessage: "Thiếu thông tin bắt buộc (userID, doctorID, date, time)",
//       });
//     }

//     const transaction = await db.sequelize.transaction(); // Bắt đầu transaction

//     try {
//       // Kiểm tra xem bác sĩ có tồn tại không
//       const doctor = await db.doctor.findOne({
//         where: { id: data.doctorID },
//         transaction,
//       });

//       if (!doctor) {
//         await transaction.rollback();
//         return resolve({
//           errCode: 1,
//           errMessage: "Không tìm thấy bác sĩ",
//         });
//       }

//       // Kiểm tra xem user có tồn tại không
//       const user = await db.User.findOne({
//         where: { id: data.userID },
//         transaction,
//       });

//       if (!user) {
//         await transaction.rollback();
//         return resolve({
//           errCode: 2,
//           errMessage: "Không tìm thấy người dùng",
//         });
//       }

//       // Kiểm tra xem đã có lịch hẹn với bác sĩ trong khung giờ đó chưa
//       // const existingAppointment = await db.Appointment.findOne({
//       //   where: { doctorID: data.doctorID, date: data.date, time: data.time },
//       //   transaction,
//       // });

//       // if (existingAppointment) {
//       //   await transaction.rollback();
//       //   return resolve({
//       //     errCode: 4,
//       //     errMessage: "Khung giờ này đã có người đặt",
//       //   });
//       // }

//       // Tạo lịch hẹn mới
//       await db.booking.create(
//         {
//           userID: data.userID,
//           doctorID: data.doctorID,
//           booking_date: new Date(),
//           scheduleID: data.scheduleID,
//           statusID: "1", // Trạng thái mặc định
//         },
//         { transaction }
//       );

//       await transaction.commit(); // Lưu tất cả thay đổi nếu không có lỗi
//       resolve({
//         errCode: 0,
//         errMessage: "Đặt lịch thành công",
//       });
//     } catch (e) {
//       await transaction.rollback(); // Quay lại trạng thái ban đầu nếu có lỗi
//       reject(e);
//     }
//   });
// };
const Booking = (data) => {
  return new Promise(async (resolve, reject) => {
    if (!data.userID || !data.scheduleID) {
      return resolve({
        errCode: 3,
        errMessage: "Thiếu thông tin bắt buộc (userID, scheduleID)",
      });
    }

    const transaction = await db.sequelize.transaction();

    try {
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

      const schedule = await db.schedules.findOne({
        where: { id: data.scheduleID },
        include: [
          {
            model: db.doctor,
            as: "Doctor",
            required: true,
          },
        ],
        attributes: ["id", "doctorID", "timeID", "date"],
        transaction,
      });

      if (!schedule) {
        await transaction.rollback();
        return resolve({
          errCode: 4,
          errMessage: "Không tìm thấy lịch trình phù hợp",
        });
      }

      // Tạo booking
      await db.booking.create(
        {
          userID: data.userID,
          booking_date: new Date(),
          scheduleID: data.scheduleID,
          statusID: 1,
        },
        { transaction }
      );

      // Commit transaction
      await transaction.commit();
      resolve({ errCode: 0, errMessage: "Đặt lịch thành công" });
    } catch (e) {
      await transaction.rollback();
      reject(e);
    }
  });
};

//Danh sach lich kham cua ban than
const GetAppointment = (userID) => {
  return new Promise(async (resolve, reject) => {
    if (!userID) {
      return resolve({
        errCode: 3,
        errMessage: "Thiếu thông tin bắt buộc (userID)",
      });
    }

    try {
      const booking = await db.booking.findAll({
        where: { userID: userID },
        include: [
          {
            model: db.schedules,
            as: "schedules",

            include: [
              {
                model: db.time,
                as: "Time",
                attributes: ["starttime", "endtime"],
              },
              {
                model: db.doctor,
                as: "Doctor",
                include: [
                  {
                    model: db.User,
                    as: "User",
                    attributes: ["id", "fullname"],
                  },
                  {
                    model: db.specialty,
                    as: "specialty",
                    include: [
                      {
                        model: db.price,
                        as: "price",
                        attributes: ["price"],
                      },
                    ],
                    attributes: ["id", "name"],
                  },
                ],
                attributes: ["id", "specialtyID", "img"],
              },
            ],
            attributes: ["id", "timeID", "date"],
          },
          {
            model: db.status,
            as: "status",
            attributes: ["id", "name"],
          },
        ],
        attributes: ["id", "booking_date", "statusID"],
        order: [
          ["booking_date", "DESC"], // Sắp xếp theo ngày đặt lịch
          [{ model: db.schedules, as: "schedules" }, "date", "DESC"], // Nếu đặt lịch cùng ngày, sắp xếp theo ngày khám
          [
            { model: db.schedules, as: "schedules" },
            { model: db.time, as: "Time" },
            "starttime",
            "ASC",
          ], // Nếu cùng ngày khám, sắp xếp theo giờ khám
        ],
      });

      resolve(booking);
    } catch (e) {
      console.error("Lỗi trong GetBooking:", e);
      reject({
        errCode: 500,
        errMessage: "Lỗi truy vấn dữ liệu",
      });
    }
  });
};

const AbortAppointment = (bookingID) => {
  return new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();
    try {
      // Tìm thông tin booking
      const booking = await db.booking.findOne({
        where: { id: bookingID },
        include: [
          {
            model: db.schedules,
            as: "schedules",
            attributes: ["id", "doctorID", "date", "timeID"],
            include: [
              {
                model: db.time,
                as: "Time",
                attributes: ["starttime", "endtime"],
              },
            ],
          },
        ],
        transaction,
      });

      if (!booking) {
        await transaction.rollback();
        return resolve({
          errCode: 1,
          errMessage: "Không tìm thấy lịch hẹn",
        });
      }

      if (booking.statusID !== 1) {
        await transaction.rollback();
        return resolve({
          errCode: 2,
          errMessage: "Lịch hẹn không thể hủy",
        });
      }
      // Lấy ngày giờ hiện tại
      const now = new Date();
      const appointmentDate = new Date(booking.schedules.date);
      const appointmentTime = booking.schedules.Time?.starttime || "00:00";

      // Chuyển đổi thời gian đặt lịch thành đúng định dạng
      const [hours, minutes] = appointmentTime.split(":").map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);

      // Kiểm tra nếu lịch hẹn chưa đến thời gian khám
      const diffInHours = (appointmentDate - now) / (1000 * 60 * 60);
      if (diffInHours < 24) {
        await transaction.rollback();
        return resolve({
          errCode: 3,
          errMessage: "Bạn chỉ có thể hủy lịch hẹn trước 24 giờ",
        });
      }

      // Cập nhật trạng thái thành
      booking.statusID = 3;
      await booking.save({ transaction });

      await transaction.commit();
      resolve({ errCode: 0, errMessage: "Hủy lịch hẹn thành công" });
    } catch (e) {
      await transaction.rollback();
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
  GetAppointment,
  AbortAppointment,
};
