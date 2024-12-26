const express = require("express");
const router = express.Router();
const session = require("express-session");
const { route } = require("express/lib/application");
const { gethome } = require("../controllers/User");

router.get("/", gethome);

module.exports = router;
