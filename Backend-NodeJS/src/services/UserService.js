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
          attributes: ["email", "fullname", "password"],

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

module.exports = {
  handelUserLogin,
  getAllUsers,
  CreateUser,
  DeleteUser,
  EditUser,
};
