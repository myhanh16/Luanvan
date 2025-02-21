const session = require("express-session");
const { format } = require("date-fns");
const { vi } = require("date-fns/locale");
const {} = require("../services/Doctor");
const {
  GetAppointmentByDoctorID,
  CreateMedicalRecord,
  GetMedicalRecordsByUserID,
  GetAllTimeSlot,
  CreateSchedules,
} = require("../services/Doctor");

const handleGetAppointmentByDoctorID = async (req, res) => {
  try {
    const data = await GetAppointmentByDoctorID(req.query.id);
    if (data.length == 0) {
      return res.status(404).json({ erMessage: "Không có lịch hẹn nào." });
    }
    return res.status(200).json({
      errCode: 0,
      errMessage: "Lấy danh sách thành công",
      data,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Loi tai danh sach",
    });
  }
};

const handleCreateMedicalRecord = async (req, res) => {
  const { bookingID, diagnosis, treatment } = req.body;
  console.log("Dữ liệu nhận được từ frontend:", req.body);
  try {
    const data = await CreateMedicalRecord(bookingID, diagnosis, treatment);
    return res.status(200).json({
      errCode: 0,
      errMessage: "Tạo hồ sơ bệnh án thành công!",
      data,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Lỗi khi tạo hồ sơ bệnh án",
    });
  }
};

const handleGetMedicalRecordsByUserID = async (req, res) => {
  try {
    const medicalRecords = await GetMedicalRecordsByUserID(req.query.id);

    if (!medicalRecords || medicalRecords.length === 0) {
      return res.status(200).json({
        errCode: 0,
        erMessag: "Bệnh nhân chưa có hồ sơ bệnh án.",
        data: [],
      });
    }
    return res.status(200).json({
      errCode: 0,
      errMessage: "Lấy hồ sơ bệnh án thành công.",
      data: medicalRecords,
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      errCode: 1,
      errMessage: "Lỗi server, vui lòng thử lại sau.",
    });
  }
};

const handleGetAllTimeSlot = async (req, res) => {
  try {
    const data = await GetAllTimeSlot();
    return res.status(200).json({
      errCode: 0,
      errMessage: "Lay thanh cong",
      data,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Loi",
    });
  }
};

const handleCreateSchedules = async (req, res) => {
  try {
    // const {doctorID, date, timeID} = req.body;
    const data = await CreateSchedules(req.body);
    return res.status(200).json({
      errCode: data.errCode,
      errMessage: data.errMessage,
      data,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Loi",
    });
  }
};
module.exports = {
  handleGetAppointmentByDoctorID,
  handleCreateMedicalRecord,
  handleGetMedicalRecordsByUserID,
  handleGetAllTimeSlot,
  handleCreateSchedules,
};
