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
export default { Login, GetAllUser, CreateUser, DeleteUser, EditUser };
