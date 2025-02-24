import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSignOutAlt, FaUserPlus, FaListAlt, FaBook } from "react-icons/fa";
import "./adminheader.css";

const AdminHeader = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Hook để lấy đường dẫn hiện tại

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    const name = sessionStorage.getItem("userName");

    if (role === "1") {
      setIsAdmin(true);
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login-admin-doctor");
  };

  if (!isAdmin) return null; // Không hiển thị nếu không phải admin

  // Hàm kiểm tra xem link có khớp với đường dẫn hiện tại hay không
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div className="admin-header-container">
      <div className="admin-header-content">
        <div className="admin-left">
          <div className="admin-logo">Trang Quản Trị Viên</div>
        </div>
        <div className="admin-center">
          <div
            className={`admin-menu-item ${isActive("/homeadmin")}`} // Thêm class active nếu đang ở trang này
            onClick={() => navigate("/homeadmin")}
          >
            <FaListAlt className="admin-icon" /> Danh Sách Bác Sĩ
          </div>
          <div
            className={`admin-menu-item ${isActive("/create-doctor")}`} // Thêm class active nếu đang ở trang này
            onClick={() => navigate("/create-doctor")}
          >
            <FaUserPlus className="admin-icon" /> Tạo Hồ Sơ Bác Sĩ
          </div>
          {/* <div
            className={`admin-menu-item ${isActive("/create-handbook")}`} // Thêm class active nếu đang ở trang này
            onClick={() => navigate("/create-handbook")}
          >
            <FaBook className="admin-icon" /> Thêm Cẩm Nang
          </div> */}
        </div>
        <div className="admin-right">
          <div className="admin-user">
            Xin chào, <b>{userName}</b>
          </div>
          <div className="admin-logout" onClick={handleLogout}>
            <FaSignOutAlt className="admin-icon" /> Đăng xuất
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
