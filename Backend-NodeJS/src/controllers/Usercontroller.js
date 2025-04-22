const session = require("express-session");
const { format } = require("date-fns");
const { vi } = require("date-fns/locale");
// const { handle } = require("express/lib/application");
const {
  handleUserLogin,
  getAllUsers,
  CreateUser,
  DeleteUser,
  EditUser,
  Booking,
  GetAppointment,
  AbortAppointment,
  getUserInfo,
  searchSpecialty,
  createPayment,
  processZaloPayCallback,
  PaymentStatus,
  Logout,
  changeUserPassword,
} = require("../services/UserService");

const handleLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      errCode: 1,
      message: "Email hoặc mật khẩu không được để trống",
    });
  }
  const userData = await handleUserLogin(email, password);

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

const handleGetAll = async (req, res) => {
  const userID = req.query.id; //truyen vao all or id

  console.log("Received ID:", userID);
  const Users = await getAllUsers(userID);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    Users,
  });
};

const handleCreate = async (req, res) => {
  try {
    const message = await CreateUser(req.body);
    console.log(req.body);
    return res.status(200).json(message); // Gọi res.json một lần khi không có lỗi
  } catch (error) {
    // Kiểm tra xem lỗi có phải do email đã tồn tại không
    if (error === "Email đã tồn tại.") {
      return res.status(400).json({
        errCode: 1,
        message: "Email đã tồn tại. Vui lòng sử dụng email khác.",
      });
    } else {
      // Nếu có lỗi khác, trả về lỗi chung
      return res.status(500).json({
        errCode: 1,
        message: error || "Có lỗi xảy ra",
      });
    }
  }
};

const handleDelete = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Khong thay id",
    });
  }
  try {
    const id = req.body.id;
    console.log(id);
    const result = await DeleteUser(id);
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Xoa thanh cong",
      });
    } else {
      return res.status(400).json({
        errCode: 0,
        errMessage: "Khong tim thay id cung cap",
      });
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 3,
      errMessage: "Internal server error",
      error: e.message,
    });
  }
};

const handleEdit = async (req, res) => {
  const data = req.body;
  const message = await EditUser(data);
  return res.status(200).json(message);
};

const handleBooking = async (req, res) => {
  try {
    const message = await Booking(req.body);
    console.log("Dữ liệu yêu cầu:", req.body);
    return res.status(200).json(message);
  } catch (error) {
    console.error("Lỗi khi xử lý đặt lịch:", error);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Có lỗi xảy ra, vui lòng thử lại",
    });
  }
};

const handleGetAppointment = async (req, res) => {
  try {
    const userID = req.query.userID;
    console.log("UserID nhận được:", userID);

    if (!userID) {
      return res.status(400).json({
        errCode: 3,
        errMessage: "Thiếu thông tin bắt buộc (userID)",
      });
    }

    const result = await GetAppointment(userID);
    console.log("Dữ liệu trả về từ GetAppointment:", result); // 🛑 In ra để kiểm tra

    if (!result || result.length === 0) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Không có lịch hẹn",
        data: [],
      });
    }

    return res.status(200).json({
      errCode: 0,
      errMessage: "Lấy lịch hẹn thành công",
      result,
    });
  } catch (error) {
    console.error("Lỗi trong handleGetAppointment:", error);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Có lỗi xảy ra, vui lòng thử lại",
    });
  }
};

const handleAbortAppointment = async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);
    const response = await AbortAppointment(id);
    return res.status(200).json({
      errCode: response.errCode,
      errMessage: response.errMessage,
      response,
    });
  } catch (error) {
    console.error("Lỗi trong handleGetAppointment:", error);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Có lỗi xảy ra, vui lòng thử lại",
    });
  }
};

const handleGetUserInfo = async (req, res) => {
  try {
    const user = await getUserInfo(req.query.id);
    return res.status(200).json({
      errCode: 0,
      errMessage: "Lay du lieu thanh cong",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 1,
      errMessage: "Có lỗi xảy ra, vui lòng thử lại",
    });
  }
};

const handleSearchSpecialty = async (req, res) => {
  try {
    const data = await searchSpecialty(req.query.name);
    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chuyên khoa nào" });
    } else {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Truy van thanh cong",
        data,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Loi",
    });
  }
};

const changePassword = async (req, res) => {
  const userID = req.body.userId;
  const { oldPassword, newPassword } = req.body;

  if (!userID || !oldPassword || !newPassword) {
    return res.status(400).json({
      errCode: 1,
      errMessage: "Vui lòng cung cấp đầy đủ thông tin.",
    });
  }

  try {
    // Gọi dịch vụ đổi mật khẩu
    const result = await changeUserPassword(userID, oldPassword, newPassword);

    // Trả về kết quả
    if (result.errCode === 0) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      errCode: 3,
      errMessage: "Lỗi server. Vui lòng thử lại.",
    });
  }
};

//--------------------PAYMENT------------------------------
const handlecreatePayment = async (req, res) => {
  try {
    console.log("Du lieu nhan tu Frontend:", req.body);

    const result = await createPayment(req.body);
    // console.log(result);
    console.log("🟢 Kết quả trả về cho Frontend:", result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const handleZaloPayCallback = async (req, res) => {
  console.log("📢 Headers từ ZaloPay:", req.headers);
  console.log("📢 Nhận callback từ ZaloPay:", req.body);

  if (!req.body || typeof req.body !== "object") {
    return res
      .status(400)
      .json({ returncode: -1, returnmessage: "Invalid request format" });
  }

  let { data, mac } = req.body;

  if (!data || !mac) {
    return res
      .status(400)
      .json({ returncode: -1, returnmessage: "Invalid callback data" });
  }

  try {
    const result = await processZaloPayCallback(data, mac);
    res.json(result);
  } catch (error) {
    console.error("❌ Lỗi xử lý callback:", error);
    res.status(500).json({ returncode: 0, returnmessage: "Server error" });
  }
};

const handelPayment = async (req, res) => {
  try {
    const bookingID = req.query.bookingID;
    console.log("📌 Nhận request get-payment với bookingID:", bookingID);

    if (!bookingID) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Thiếu bookingID",
      });
    }

    const payment = await PaymentStatus(bookingID);
    console.log("✅ Kết quả PaymentStatus:", payment);

    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      payment,
    });
  } catch (e) {
    console.error("❌ Lỗi trong handelPayment:", e);
    return res.status(500).json(e);
  }
};

const handleLogout = async (req, res) => {
  try {
    const id = req.body.userID;
    const results = await Logout(id);
    console.log("ID tu FE: ", id);

    return res.status(200).json(results);
  } catch (e) {
    return res.status(500).json(e);
  }
};

module.exports = {
  handleLogin,
  handleGetAll,
  handleCreate,
  handleDelete,
  handleEdit,
  handleBooking,
  handleGetAppointment,
  handleAbortAppointment,
  handleGetUserInfo,
  handleSearchSpecialty,
  handlecreatePayment,
  handleZaloPayCallback,
  handelPayment,
  handleLogout,
  changePassword,
};
