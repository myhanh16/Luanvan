const session = require("express-session");
const { format } = require("date-fns");
const { vi } = require("date-fns/locale");
const {} = require("../services/User");

const gethome = (req, res) => {
  return res.render("home");
};

module.exports = {
  gethome,
};
