import React, { useState, useEffect } from "react";
import "./login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import UserService from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import Homeheader from "../page/header";
import HomeFooter from "../page/homefooter";
import RegisterUserModal from "./modalUser";
import emitter from "../../utils/emitter";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // State để kiểm soát việc hiển thị modal

  // Lắng nghe sự kiện USER_ADDED để reset form
  useEffect(() => {
    const resetForm = () => {
      setEmail(""); // Reset email
      setPassword(""); // Reset password
    };

    // Đăng ký listener cho sự kiện USER_ADDED
    emitter.on("USER_ADDED", resetForm);

    // Cleanup khi component bị unmount
    return () => {
      emitter.off("USER_ADDED", resetForm); // Hủy đăng ký listener
    };
  }, []);

  // Hàm xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const response = await UserService.Login(email, password);
      console.log("Đăng nhập thành công:", response.data);
      setError("");
      sessionStorage.setItem("userToken", response.data.token);
      sessionStorage.setItem("userName", response.data.user.fullname);
      sessionStorage.setItem("userRole", response.data.user.role);
      console.log(response.data.user.fullname);
      console.log(response.data.user.role);
      if (response.data.user.role == 1) {
        console.log(response.data.user.role);
        navigate("/homeadmin"); // Điều hướng tới trang chủ sau khi đăng nhập thành công
      } else {
        setError("Bạn không có quyền truy cập vào trang này");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin.");
    }
  };

  // Hàm chuyển đổi trạng thái ẩn/hiện mật khẩu
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Hàm mở modal đăng ký
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <React.Fragment>
      <div className="login-container">
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              className="login-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="password-container">
            <label>Mật Khẩu:</label>
            <input
              className="login-input"
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="col-12" style={{ color: "red" }}>
            {error}
          </div>
          <button type="submit">Đăng Nhập</button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default Login;
