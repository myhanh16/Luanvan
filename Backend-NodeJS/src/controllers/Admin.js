const session = require("express-session");
const { format } = require("date-fns");
const { vi } = require("date-fns/locale");
const {
  handleLogin,
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
  const userData = await handleLogin(email, password);

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

const handlegetSpecialty = async (req, res) => {
  const specialty = await getAllSpecialty();
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    specialty,
  });
};

const handlegetSpecialtyByid = async (req, res) => {
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

const handlegetDoctorBySpecialtyID = async (req, res) => {
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

//Lấy danh sach doctor có experince cao nhất để hiển thị bác sĩ nổi bật
const handlegetTopExperiencedDoctor = async (req, res) => {
  const doctor = await getTopExperiencedDoctor();
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    doctor,
  });
};

//Lay thoi gian lam viec cua tung bac si
const handlegetSchedule = async (req, res) => {
  try {
    const doctorID = req.query.doctorID;
    const schedule = await getSchedule(doctorID);
    res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      errCode: 1,
      errMessage: error,
    });
  }
};

//Lay thong tin bac si theo id
const handlegetDoctorByid = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required parameter: id",
      });
    } else {
      const doctor = await getDoctorByid(id);
      return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        doctor,
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

const handleEditDoctor = async (req, res) => {
  try {
    const data = req.body;
    const message = await EditDoctor(data);
    return res.status(200).json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Internal Server Error",
    });
  }
};

// lấy toàn bộ danh sách bác sĩ
const handlegetAllDoctors = async (req, res) => {
  try {
    // Gọi hàm lấy bác sĩ từ service
    const doctors = await getAlltDoctors();

    // Nếu không có bác sĩ
    if (doctors.length === 0) {
      return res.status(404).json({ message: "Không có bác sĩ nào." });
    }

    // Trả về danh sách bác sĩ
    return res.status(200).json({
      message: "Danh sách bác sĩ",
      doctors,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bác sĩ:", error);
    return res.status(500).json({
      message: "Có lỗi xảy ra khi lấy danh sách bác sĩ.",
    });
  }
};

//Vô hiệu hóa tài khoản
const handledisableDoctorAccount = async (req, res) => {
  try {
    const userID = req.query.id;
    const data = await disableDoctorAccount(userID);
    return res.status(200).json({
      errCode: data.errCode,
      errMessage: data.errMessage,
      data,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Internal Server Error",
    });
  }
};

//Tinh so ngay lam viec vua bac si tren thanh
const handlegetWorkingDaysByDoctor = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ message: "Vui lòng cung cấp tháng." });
    }

    const doctorStats = await getWorkingDaysByDoctor(parseInt(month));
    return res.status(200).json(doctorStats);
  } catch (e) {
    console.error("Lỗi khi lấy số ngày làm việc của bác sĩ:", e);
    return res
      .status(500)
      .json({
        errMessage: "Lỗi khi lấy số ngày làm việc của bác sĩ",
        error: e.message,
      });
  }
};
module.exports = {
  LoginAdmin,
  handlegetSpecialty,
  handlegetSpecialtyByid,
  CreateDoctor,
  handlegetDoctorBySpecialtyID,
  handlegetTopExperiencedDoctor,
  handlegetSchedule,
  handlegetDoctorByid,
  handleEditDoctor,
  handlegetAllDoctors,
  handledisableDoctorAccount,
  handlegetWorkingDaysByDoctor,
};
