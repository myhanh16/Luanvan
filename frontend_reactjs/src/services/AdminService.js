import axios from "../axios";

const GetAllUser = (userid) => {
  return axios.get("/api/get-all-user", { params: { id: userid } });
};

const Login = (useremail, userpassword) => {
  return axios.post("/api/login-admin", {
    email: useremail,
    password: userpassword,
  });
};

const CreateDoctor = (data) => {
  return axios.post("/api/create-doctor", data);
};

const GetAllDoctors = () => {
  return axios.get("/api/get-alldoctor");
};

const EditDoctor = (data) => {
  return axios.post("/api/edit-doctor", data);
};

const disableDoctorAccount = (userID) => {
  return axios.post(`/api/disableDoctorAccount?id=${userID}`);
};

const handlegetWorkroom = () => {
  return axios.get("/api/get-workroom");
};
export default {
  Login,
  GetAllUser,
  CreateDoctor,
  EditDoctor,
  GetAllDoctors,
  disableDoctorAccount,
  handlegetWorkroom,
};
