const session = require("express-session");
const { format } = require("date-fns");
const { vi } = require("date-fns/locale");
const {
  register,
  getAllUser,
  getUserbyid,
  edit,
  deleteUser,
} = require("../services/CRUD");

const gethome = (req, res) => {
  return res.render("home");
};

const Register = async (req, res) => {
  const message = await register(req.body);
  console.log(message);
  return res.send("Post thanh cong");
};

const getAll = async (req, res) => {
  const data = await getAllUser();
  return res.render("list", { data: data });
};

const getUserbyID = async (req, res) => {
  const Userid = req.query.id;
  // console.log("ID received from req.query:", Userid);
  if (Userid) {
    const UserData = await getUserbyid(Userid);
    console.log(UserData);
    return res.render("edit", { data: UserData });
  } else {
    return res.send("Khong tim Thay");
  }
};

const editUser = async (req, res) => {
  const data = req.body;
  await edit(data);
  return res.send("Chinh sua thanh cong");
};

const Delete = async (req, res) => {
  const id = req.query.id;
  await deleteUser(id);
  return res.send("Xoa thanh cong");
};

module.exports = {
  gethome,
  Register,
  getAll,
  getUserbyID,
  editUser,
  Delete,
};
