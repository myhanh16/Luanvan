const session = require("express-session");
const { format } = require("date-fns");
const { vi } = require("date-fns/locale");
// const { handle } = require("express/lib/application");
const { handelUserLogin } = require("../services/UserService");

const handelLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "That bai",
    });
  }
  const userData = await handelUserLogin(email, password);

  return res.status(200).json({
    // errCode: 0,
    // message: "OK",
    // userData,
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

module.exports = {
  handelLogin,
};
