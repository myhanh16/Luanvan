import axios from "../axios";

const Login = (useremail, userpassword) => {
  return axios.post("/api/login", { email: useremail, password: userpassword });
};

const GetAllUser = (userid) => {
  return axios.get("/api/get-all-user", { params: { id: userid } });
};

const CreateUser = (data) => {
  console.log("Du lieu: ", data);
  return axios.post("/api/create-user", data);
};

const DeleteUser = (userid) => {
  // return axios.delete("/api/delete-user", { data: { id: userid } });
  return axios.delete("/api/delete-user", { data: { id: userid } });
};

const EditUser = (Inputdata) => {
  return axios.post("/api/edit-user", Inputdata);
};

const GetAllSpecialty = () => {
  return axios.get("/api/get-specialty");
};

const getSpecialtyByID = (id) => {
  return axios.get(`/api/get-specialtyByid?id=${id}`);
};

const getDoctorsBySpecialtyID = (specialtyID) => {
  return axios.get(`/api/get-DoctorsBySpecialtyID?specialtyID=${specialtyID}`);
};

const getTopExperiencedDoctor = () => {
  return axios.get("/api/get-TopExperienceDoctor");
};

const getSchedule = (doctorID) => {
  return axios.get(`/api/get-schedule?doctorID=${doctorID}`);
};

const getDoctorByid = (doctorID) => {
  return axios.get(`/api/get-doctorByid?id=${doctorID}`);
};

const Booking = (data) => {
  return axios.post("api/booking", data);
};
export default {
  Login,
  GetAllUser,
  CreateUser,
  DeleteUser,
  EditUser,
  GetAllSpecialty,
  getSpecialtyByID,
  getDoctorsBySpecialtyID,
  getTopExperiencedDoctor,
  getSchedule,
  getDoctorByid,
  Booking,
};
