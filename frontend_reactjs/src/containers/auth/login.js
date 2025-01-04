// src/container/auth/login.js

import React, { useState } from "react";
import "./login.css";
// import { UserService } from "../../services";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic đăng nhập ở đây (gửi yêu cầu API, xác thực, v.v.)
    console.log("Email:", email);
    console.log("Password:", password);
  };

  const handelLogin = () => {
    alert("Hello");
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
        <div>
          <label>Mật Khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" onClick={() => handelLogin()}>
          Đăng Nhập
        </button>
      </form>
    </div>
  );
};

export default Login;
