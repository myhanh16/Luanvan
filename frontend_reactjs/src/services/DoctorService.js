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
export default {
  handleGetAppointmentByDoctorID,
  handleCreateMedicalRecord,
  handleGetMedicalRecordsByUserID,
  handleGetAllTimeSlot,
  handleCreateSchedules,
};
