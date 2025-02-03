const express = require("express");
const router = express.Router();
const session = require("express-session");
const { route } = require("express/lib/application");
const {
  gethome,
  Register,
  getAll,
  getUserbyID,
  editUser,
  Delete,
} = require("../controllers/CRUDController");

const {
  handelLogin,
  handleGetAll,
  handleCreate,
  handleDelete,
  handleEdit,
} = require("../controllers/Usercontroller");

const {
  LoginAdmin,
  handelgetSpecialty,
  handelgetSpecialtyByid,
  CreateDoctor,
  handelgetDoctorBySpecialtyID,
} = require("../controllers/Admin");
router.get("/", gethome);

router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", Register);

router.get("/list", getAll);

router.get("/edit", getUserbyID);

router.post("/edit", editUser);

router.get("/delete", Delete);

/*---------------- REACTJS USER-------------------------*/

router.post("/api/login", handelLogin);

router.get("/api/get-all-user", handleGetAll);

router.post("/api/create-user", handleCreate);

router.delete("/api/delete-user", handleDelete);

router.post("/api/edit-user", handleEdit);

/*-----------------REACT ADMIN---------------------- */
router.post("/api/login-admin", LoginAdmin);

router.get("/api/get-specialty", handelgetSpecialty);

router.get("/api/get-specialtyByid", handelgetSpecialtyByid);

router.post("/api/create-doctor", CreateDoctor);

router.get("/api/get-DoctorsBySpecialtyID", handelgetDoctorBySpecialtyID);
module.exports = router;
