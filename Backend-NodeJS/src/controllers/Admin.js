const session = require("express-session");
const { format } = require("date-fns");
const { vi } = require("date-fns/locale");
const {
  handelLogin,
  getAllSpecialty,
  getSpecialtyByID,
  createdoctor,
  getDoctorsBySpecialtyID,
} = require("../services/Admin");

const LoginAdmin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      errCode: 1,
      message: "Email hoặc mật khẩu không được để trống",
    });
  }
  const userData = await handelLogin(email, password);

  if (userData.errCode === 0) {
    // Đăng nhập thành công
    return res.status(200).json({
      errCode: 0,
      message: userData.errMessage,
      user: userData.user,
    });
  } else {
    // Sai thông tin đăng nhập
    return res.status(400).json({
      errCode: userData.errCode,
      message: userData.errMessage,
    });
  }
};

const handelgetSpecialty = async (req, res) => {
  const specialty = await getAllSpecialty();
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    specialty,
  });
};

const handelgetSpecialtyByid = async (req, res) => {
  try {
    const id = req.query.id; // Lấy ID từ query string
    if (!id) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required parameter: id",
      });
    }
    const detail = await getSpecialtyByID(id);

    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      detail,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Internal Server Error",
    });
  }
};

const CreateDoctor = async (req, res) => {
  const data = req.body; // Dữ liệu từ client (bao gồm thông tin bác sĩ)
  console.log("Received data:", data);
  try {
    const result = await createdoctor(data, req); // Gọi hàm createdoctor và truyền dữ liệu
    res.status(201).json(result); // Trả về kết quả thành công
  } catch (error) {
    console.error(error); // In lỗi ra console để kiểm tra
    res.status(500).json({
      message: "Tạo bác sĩ thất bại",
      error: error.message || error, // Lấy thông tin lỗi chi tiết
    });
  }
};

const handelgetDoctorBySpecialtyID = async (req, res) => {
  try {
    const id = req.query.specialtyID;
    if (!id) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required parameter: id",
      });
    } else {
      const doctors = await getDoctorsBySpecialtyID(id);
      return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        doctors,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Internal Server Error",
    });
  }
};
module.exports = {
  LoginAdmin,
  handelgetSpecialty,
  handelgetSpecialtyByid,
  CreateDoctor,
  handelgetDoctorBySpecialtyID,
};
