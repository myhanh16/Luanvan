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
      sessionStorage.setItem("userID", response.data.user.id);
      sessionStorage.setItem("userPhone", response.data.user.phone);
      sessionStorage.setItem("userAddress", response.data.user.address);
      sessionStorage.setItem("userGender", response.data.user.gender);
      sessionStorage.setItem("userEmail", response.data.user.email);
      sessionStorage.setItem("userbirthYear", response.data.user.birthYear);
      // sessionStorage.setItem("userData", JSON.stringify(response.data.user)); // Lưu toàn bộ user
      console.log(
        "User Session Data:",
        sessionStorage.getItem("userID"),
        sessionStorage.getItem("userAddress"),
        sessionStorage.getItem("userEmail"),
        sessionStorage.getItem("userbirthYear")
      );

      if (response.data.user.role == 0) {
        console.log(response.data.user.role);
        navigate("/"); // Điều hướng tới trang chủ sau khi đăng nhập thành công
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

  // Hàm xử lý đăng ký người dùng mới
  const handleConfirmCreate = async (formData) => {
    try {
      const response = await UserService.CreateUser(formData);
      if (response && response.data && response.data.errCode !== 0) {
        alert("Tạo tài khoản thất bại: " + response.data.message);
      } else {
        alert("Tạo tài khoản thành công.");

        emitter.emit("USER_ADDED", formData); // Phát sự kiện USER_ADDED để reset form
        toggleModal(); // Đóng modal sau khi tạo tài khoản thành công
        navigate("/login"); // Điều hướng về trang đăng nhập sau khi tạo tài khoản
      }
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      alert("Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại.");
    }
  };

  return (
    <React.Fragment>
      <Homeheader />
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
          <div className="register-link">
            <p>
              Bạn chưa có tài khoản?{" "}
              <span
                onClick={toggleModal}
                style={{ color: "#007bff", cursor: "pointer" }}
              >
                Đăng ký ngay
              </span>
            </p>
          </div>
          <div className="col-12" style={{ color: "red" }}>
            {error}
          </div>
          <button type="submit">Đăng Nhập</button>
        </form>
      </div>
      <HomeFooter />

      {/* Hiển thị Modal khi nhấp vào Đăng ký ngay */}
      <RegisterUserModal
        isOpen={modalOpen}
        toggle={toggleModal}
        onConfirm={handleConfirmCreate}
      />
    </React.Fragment>
  );
};

export default Login;
