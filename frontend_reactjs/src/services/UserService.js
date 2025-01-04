import axios from "axios";

const Login = (email, password) => {
  return axios.post("/api/login", { email, password });
};

export default { Login }; // Đảm bảo rằng bạn xuất đối tượng này.
