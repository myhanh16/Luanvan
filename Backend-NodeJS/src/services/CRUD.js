const session = require("express-session");
const { format } = require("date-fns");
const { vi, el } = require("date-fns/locale");
const crypto = require("crypto");
const db = require("../models");
const { getUserbyID } = require("../controllers/CRUDController");
const { where } = require("sequelize");

const register = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
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
      resolve("Tao thanh cong");
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const Users = await db.User.findAll();
      resolve(Users);
    } catch (e) {
      reject(e);
    }
  });
};

const getUserbyid = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const UserData = await db.User.findOne({
        where: {
          id: id,
        },
      });
      if (UserData) {
        resolve(UserData);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

const edit = (data) => {
  return new Promise(async (resolve, reject) => {
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
        resolve();
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: {
          id: id,
        },
      });
      if (user) {
        await user.destroy();
        resolve();
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  register,
  getAllUser,
  getUserbyid,
  edit,
  deleteUser,
};
