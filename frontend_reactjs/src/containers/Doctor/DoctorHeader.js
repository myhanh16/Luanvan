import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaSignOutAlt,
  FaUserPlus,
  FaListAlt,
  FaFileMedical,
  FaCalendarAlt,
  FaNotesMedical,
} from "react-icons/fa";

const DoctorHeader = () => {
  const [isDoctor, setIsDoctor] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Hook để lấy đường dẫn hiện tại

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    const name = sessionStorage.getItem("userName");

    if (role === "2") {
      setIsDoctor(true);
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login-admin-doctor");
  };

  if (!isDoctor) return null; // Không hiển thị nếu không phải admin

  // Hàm kiểm tra xem link có khớp với đường dẫn hiện tại hay không
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div className="admin-header-container">
      <div className="admin-header-content">
        <div className="admin-left">
          <div className="admin-logo">Trang Bác Sĩ</div>
        </div>
        <div className="admin-center">
          <div
            className={`admin-menu-item ${isActive("/homedoctor")}`} // Thêm class active nếu đang ở trang này
            onClick={() => navigate("/homedoctor")}
          >
            <FaListAlt className="admin-icon" /> Danh Sách Lịch Hẹn
          </div>
          <div
            className={`admin-menu-item ${isActive("/create-shedule")}`} // Thêm class active nếu đang ở trang này
            onClick={() => navigate("/create-shedule")}
          >
            <FaFileMedical className="admin-icon" /> Tạo Lịch Làm Việc
          </div>
          <div
            className={`admin-menu-item ${isActive("/schedule")}`} // Thêm class active nếu đang ở trang này
            onClick={() => navigate("/schedule")}
          >
            <FaCalendarAlt className="admin-icon" /> Lịch Làm Việc
          </div>
          <div
            className={`admin-menu-item ${isActive("/medicalrecords")}`} // Thêm class active nếu đang ở trang này
            onClick={() => navigate("/medicalrecords")}
          >
            <FaNotesMedical className="admin-icon" /> Hồ Sơ Bệnh Án
          </div>
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

export default DoctorHeader;
