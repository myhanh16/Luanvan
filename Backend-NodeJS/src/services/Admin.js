const session = require("express-session");
const { format } = require("date-fns");
const { vi, el, ca } = require("date-fns/locale");
const crypto = require("crypto");
const db = require("../models");
const { getUserbyID } = require("../controllers/CRUDController");
const { where } = require("sequelize");
const { resolve } = require("path");
const { rejects } = require("assert");
const { Op } = require("sequelize");
const { ppid } = require("process");

const handelLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = {};
      const isExit = await checkUserEmail(email);
      if (isExit) {
        // Người dùng đã tồn tại
        const user = await db.User.findOne({
          attributes: ["email", "fullname", "password", "role", "isActive"],

          where: {
            email: email,
          },
          raw: true,
        });

        if (user) {
          if (!user.isActive) {
            userData.errCode = 4;
            userData.errMessage = "Tài khoản của bạn đã bị vô hiệu hóa";
          } else {
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

const getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const specialties = await db.specialty.findAll();
      if (specialties && specialties.length > 0) {
        console.log("data: ", specialties);
      }
      resolve(specialties);
    } catch (e) {
      reject(e);
    }
  });
};

const getSpecialtyByID = (id) => {
  return new Promise(async (resolve, rejects) => {
    try {
      const Detail = await db.specialty.findOne({
        where: { id: id },
        include: [
          {
            model: db.price, // Nếu giá được lưu trong bảng price
            as: "price",
            attributes: ["price"],
          },
        ],
      });

      if (Detail) {
        resolve(Detail);
      } else {
        Detail = {};
      }
    } catch (e) {
      rejects(e);
    }
  });
};

const createdoctor = (data) => {
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
      const newUser = await db.User.create({
        email: data.email,
        password: hashedPassword,
        fullname: data.fullname,
        phone: data.phone,
        address: data.address,
        gender: data.gender === "1" ? true : false,
        role: "2",
      });

      // const img = req.file
      //   ? `/img/doctor/${specialty}/${req.file.filename}`
      //   : "";
      // console.log("New user ID:", newUser.id);

      const img = data.img || null;

      // console.log("Image path:", img);

      const specialtyID = await db.specialty.findOne({
        where: { id: data.specialty },
      });
      console.log(specialtyID);

      const newDoctor = await db.doctor.create({
        experience_years: data.experience_years,
        workroom: data.workroom,
        description: data.description,
        img, // Lưu đường dẫn ảnh
        onlineConsultation: data.onlineConsultation,
        userID: parseInt(newUser.id),
        specialtyID: parseInt(data.specialty),
      });
      console.log(newDoctor);
      resolve({
        errCode: 0,
        message: "OK",
        doctor: newDoctor,
      });

      // console.log("Specialty ID from client:", data.specialty);
    } catch (e) {
      reject(e);
    }
  });
};

const getDoctorsBySpecialtyID = (specialtyID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doctors = await db.doctor.findAll({
        where: { specialtyID: specialtyID, onlineConsultation: 0 },
        include: [
          {
            model: db.User, // Kiểm tra lại tên và cách sử dụng model
            as: "User", // Kiểm tra xem alias có đúng không
            attributes: ["fullname", "email", "phone", "address", "gender"],
            where: { isActive: true },
          },
          {
            model: db.specialty, // Lấy chuyên khoa
            as: "specialty",
            include: [
              {
                model: db.price, // Lấy giá từ chuyên khoa
                as: "price",
                attributes: ["price"],
              },
            ],
          },
        ],
        order: [["experience_years", "DESC"]],
      });

      resolve(doctors);
    } catch (e) {
      reject(e);
    }
  });
};

//Lấy danh sach top experience doctor
const getTopExperiencedDoctor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const doctor = await db.doctor.findAll({
        where: {
          onlineConsultation: 1,
        },
        include: [
          {
            model: db.User,
            as: "User",
            attributes: ["fullname", "email", "phone", "address", "gender"],
            where: { isActive: true },
          },
          {
            model: db.specialty, // Thêm bảng chuyên khoa
            as: "specialty", // Đảm bảo alias đúng với model
            attributes: ["name"], // Lấy tên chuyên khoa
          },
        ],
        order: [["experience_years", "DESC"]],
      });
      resolve(doctor);
    } catch (e) {
      reject(e);
    }
  });
};

//Lay thoi gian lam viec cua bac si
// const getSchedule = (doctorID) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const schedules = await db.schedules.findAll({
//         where: { doctorID: doctorID },
//         attributes: ["id", "doctorID", "timeID", "date"],
//         include: [
//           {
//             model: db.time,
//             as: "Time",
//             attributes: ["starttime", "endtime"],
//           },
//         ],
//         order: [["date", "ASC"]],
//       });
//       resolve(schedules);
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
const getSchedule = (doctorID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Đưa về đầu ngày

      const startDate = new Date(today);
      startDate.setDate(today.getDate() + 1); // Bắt đầu từ ngày mai

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7); // Chỉ lấy trong 7 ngày tới

      const schedules = await db.schedules.findAll({
        where: {
          doctorID: doctorID,
          date: {
            [db.Sequelize.Op.between]: [startDate, endDate], // Lọc theo khoảng thời gian
          },
        },
        attributes: ["id", "doctorID", "timeID", "date"],
        include: [
          {
            model: db.time,
            as: "Time",
            attributes: ["starttime", "endtime"],
          },
        ],
        order: [
          ["date", "ASC"],
          [{ model: db.time, as: "Time" }, "starttime", "ASC"],
        ], // Sắp xếp theo ngày tăng dần
      });

      resolve(schedules);
    } catch (e) {
      reject(e);
    }
  });
};

//Thông tin bac si theo id
const getDoctorByid = (doctorID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doctor = await db.doctor.findOne({
        where: { id: doctorID },
        include: [
          {
            model: db.User, // Kiểm tra lại tên và cách sử dụng model
            as: "User", // Kiểm tra xem alias có đúng không
            attributes: ["fullname", "email", "phone", "address", "gender"],
            where: { isActive: true },
          },
          {
            model: db.specialty, // Thêm bảng chuyên khoa
            as: "specialty", // Đảm bảo alias đúng với model
            include: [
              {
                model: db.price, // Lấy giá từ chuyên khoa
                as: "price",
                attributes: ["price"],
              },
            ],
            attributes: ["name"], // Lấy tên chuyên khoa
          },
          // {
          //   model: db.schedules, // Include lịch khám bệnh
          //   as: "schedules",
          //   attributes: ["date"], // Lấy ngày khám bệnh
          // },
        ],
      });

      resolve(doctor);
    } catch (e) {
      reject(e);
    }
  });
};

//Lấy toàn bộ danh sách bác sĩ để admind chỉnh sửa
const getAlltDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const doctors = await db.doctor.findAll({
        include: [
          {
            model: db.User, // Kiểm tra lại tên và cách sử dụng model
            as: "User", // Kiểm tra xem alias có đúng không
            attributes: [
              "id",
              "fullname",
              "email",
              "phone",
              "address",
              "gender",
              "isActive",
            ],
          },
          {
            model: db.specialty, // Lấy chuyên khoa
            as: "specialty",
            include: [
              {
                model: db.price, // Lấy giá từ chuyên khoa
                as: "price",
                attributes: ["price"],
              },
            ],
          },
        ],
        attributes: ["id", "experience_years", "onlineConsultation"],
      });

      resolve(doctors);
    } catch (e) {
      reject(e);
    }
  });
};

//Chỉnh sửa thông tin bác sĩ
const EditDoctor = (data) => {
  return new Promise(async (resolve, reject) => {
    if (!data.userID) {
      return resolve({
        errCode: 3,
        errMessage: "userID là bắt buộc",
      });
    }

    const transaction = await db.sequelize.transaction(); // Bắt đầu transaction

    try {
      // Tìm thông tin User của bác sĩ
      const user = await db.User.findOne({
        where: { id: data.id },
        transaction,
      });

      if (!user) {
        await transaction.rollback();
        return resolve({
          errCode: 1,
          errMessage: "Không tìm thấy User của bác sĩ",
        });
      }

      // Cập nhật thông tin User
      user.fullname = data.fullname || user.fullname;
      user.phone = data.phone || user.phone;
      user.address = data.address || user.address;
      await user.save({ transaction });

      // Tìm thông tin Doctor của bác sĩ
      const doctor = await db.doctor.findOne({
        where: { userID: data.userID },
        transaction,
      });

      if (!doctor) {
        await transaction.rollback();
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy hồ sơ bác sĩ",
        });
      }

      // Cập nhật thông tin bác sĩ (nếu có)
      doctor.experience_years =
        data.experience_years || doctor.experience_years;
      doctor.onlineConsultation = Number(data.onlineConsultation); // Chuyển thành số
      await doctor.save({ transaction });

      await transaction.commit(); // Lưu tất cả thay đổi nếu không có lỗi
      resolve({
        errCode: 0,
        errMessage: "Cập nhật thành công",
      });
    } catch (e) {
      await transaction.rollback(); // Quay lại trạng thái ban đầu nếu có lỗi
      reject(e);
    }
  });
};

//Vô hiệu hóa tài khoản
const disableDoctorAccount = (userID) => {
  return new Promise(async (resolve, reject) => {
    if (!userID) {
      return resolve({
        errCode: 3,
        errMessage: "UserID bat buoc",
      });
    }
    try {
      const user = await db.User.findOne({
        where: { id: userID },
      });
      if (!user) {
        return resolve({
          errCode: 1,
          errMessage: "Khong tim thay tai khoan bac si",
        });
      }

      // user.isActive = false;
      // await user.save();
      user.isActive = !user.isActive; // Đảo trạng thái từ true -> false hoặc ngược lại
      await user.save();

      resolve({
        errCode: 0,
        errMessage: `Cập nhật thành công! Trạng thái mới: ${
          user.isActive ? "Đang hoạt động" : "Vô hiệu hóa"
        }`,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//Tinh so ngay lam viec cua bac si theo thang
const getWorkingDaysByDoctor = (month) => {
  return new Promise(async (resolve, reject) => {
    try {
      const startDate = new Date(new Date().getFullYear(), month - 1, 1); //Ngay dau thang
      const endDate = new Date(new Date().getFullYear(), month, 0); //Ngay cuoi thang

      const schedules = await db.schedules.findAll({
        where: {
          date: {
            [db.Sequelize.Op.between]: [startDate, endDate],
          },
        },
        attributes: ["id", "doctorID", "timeID", "date"],
        include: [
          {
            model: db.doctor,
            as: "Doctor",
            attributes: ["id", "experience_years", "onlineConsultation"],
            include: [
              {
                model: db.User,
                as: "User",
                attributes: ["fullname"],
              },
              {
                model: db.specialty, // Lấy chuyên khoa
                as: "specialty",
                attributes: ["name"],
              },
            ],
          },
          {
            model: db.time,
            as: "Time",
            attributes: ["starttime", "endtime"],
          },
        ],
      });

      //Tinh tong gio lam viec
      const doctorStats = {};
      schedules.forEach((schedule) => {
        const doctorID = schedule.Doctor.id;
        const doctorName = schedule.Doctor.User.fullname;
        const startTime = schedule.Time.starttime;
        const endTime = schedule.Time.endtime;

        // Chuyển đổi thời gian sang số giờ
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        const hoursWorked = (end - start) / (1000 * 60 * 60);

        if (!doctorStats[doctorID]) {
          doctorStats[doctorID] = {
            name: doctorName,
            totalHours: 0,
            workingDays: 0,
          };
        }
        doctorStats[doctorID].totalHours += hoursWorked;
      });

      // Chuyển tổng số giờ thành số ngày công
      Object.keys(doctorStats).forEach((doctorID) => {
        doctorStats[doctorID].workingDays = (
          doctorStats[doctorID].totalHours / 8
        ).toFixed(2);
      });

      resolve(doctorStats);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handelLogin,
  getAllSpecialty,
  getSpecialtyByID,
  createdoctor,
  getDoctorsBySpecialtyID,
  getTopExperiencedDoctor,
  getSchedule,
  getDoctorByid,
  EditDoctor,
  getAlltDoctors,
  disableDoctorAccount,
  getWorkingDaysByDoctor,
};
