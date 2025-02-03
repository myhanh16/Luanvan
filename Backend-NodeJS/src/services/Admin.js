const session = require("express-session");
const { format } = require("date-fns");
const { vi, el, ca } = require("date-fns/locale");
const crypto = require("crypto");
const db = require("../models");
const { getUserbyID } = require("../controllers/CRUDController");
const { where } = require("sequelize");
const { resolve } = require("path");
const { rejects } = require("assert");

const handelLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = {};
      const isExit = await checkUserEmail(email);
      if (isExit) {
        // Người dùng đã tồn tại
        const user = await db.User.findOne({
          attributes: ["email", "fullname", "password", "role"],

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

// const getDoctorsBySpecialtyID = (specialtyID) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const doctors = await db.doctor.findAll({
//         where: { specialtyID: specialtyID },
//         include: [
//           {
//             model: db.User, // Kiểm tra lại tên và cách sử dụng model
//             as: "User", // Kiểm tra xem alias có đúng không
//             attributes: ["fullname", "email", "phone", "address", "gender"],
//           },
//         ],
//       });

//       resolve(doctors);
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

const getDoctorsBySpecialtyID = (specialtyID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doctors = await db.doctor.findAll({
        where: { specialtyID: specialtyID },
        include: [
          {
            model: db.User, // Kiểm tra lại tên và cách sử dụng model
            as: "User", // Kiểm tra xem alias có đúng không
            attributes: ["fullname", "email", "phone", "address", "gender"],
          },
        ],
        attributes: [
          "id",
          "experience_years",
          "workroom",
          "description",
          "img",
          "specialtyID",
        ], // Lấy thêm cột img từ bảng doctor
      });

      // Tạo đường dẫn đầy đủ cho ảnh
      const doctorsWithImages = doctors.map((doctor) => {
        const imageUrl = doctor.img
          ? `http://localhost:3000/public/img/doctor/${doctor.specialtyID}/${doctor.img}` // Cấu trúc đường dẫn tới ảnh
          : null;
        return {
          ...doctor.toJSON(), // Chuyển object sequelize thành plain object
          imageUrl, // Thêm đường dẫn ảnh
        };
      });

      resolve(doctorsWithImages);
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
};
