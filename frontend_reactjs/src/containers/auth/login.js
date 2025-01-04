import React, { useState } from "react";
import "./login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import UserService from "../../services/UserService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State để kiểm soát việc hiển thị mật khẩu
  const [error, setError] = useState(""); // Để lưu thông báo lỗi từ server

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    try {
      // Gọi API đăng nhập và xử lý kết quả
      const response = await UserService.Login(email, password);
      console.log("Đăng nhập thành công:", response.data);
      // Bạn có thể chuyển hướng người dùng đến trang khác nếu đăng nhập thành công
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); // Thay đổi trạng thái mật khẩu hiển thị
  };

  return (
    <div className="login-container">
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="password-container">
          <label>Mật Khẩu:</label>
          <input
            type={passwordVisible ? "text" : "password"} // Hiển thị mật khẩu nếu passwordVisible là true
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="eye-icon" onClick={togglePasswordVisibility}>
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}{" "}
          </span>
        </div>
        <button type="submit">Đăng Nhập</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
