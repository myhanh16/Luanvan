import axios from "../axios";
const handleGetAppointmentByDoctorID = (doctorID) => {
  return axios.get(`/api/get-appointentByDoctorID?id=${doctorID}`);
};

const handleCreateMedicalRecord = (data) => {
  return axios.post("/api/create-medicalrecord", data);
};
const handleGetMedicalRecordsByUserID = (userID) => {
  return axios.get(`/api/handle-getgetMedicalRecordsByUserID?id=${userID}`);
};

const handleGetAllTimeSlot = () => {
  return axios.get("/api/get-AllTimeSlots");
};

const handleCreateSchedules = (data) => {
  return axios.post("/api/create-schedules", data);
};

const handlegetScheduleBydoctorID = (doctorID) => {
  return axios.get(`/api/get-scheduleByDoctorID?doctorID=${doctorID}`);
};

const handlegetjitsi = (data) => {
  return axios.post("/api/jitsi-token", data);
};

const handleGetMedicalRecords = () => {
  return axios.get("/api/get-MedicalRecords");
};

const handleMarkAbsent = (bookingID) => {
  console.log("Gửi bookingID đến server:", bookingID);
  return axios.post("/api/mark-absent", { bookingID });
};
export default {
  handleGetAppointmentByDoctorID,
  handleCreateMedicalRecord,
  handleGetMedicalRecordsByUserID,
  handleGetAllTimeSlot,
  handleCreateSchedules,
  handlegetScheduleBydoctorID,
  handlegetjitsi,
  handleGetMedicalRecords,
  handleMarkAbsent,
};
