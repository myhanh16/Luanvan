import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaSignOutAlt,
  FaUserPlus,
  FaListAlt,
  FaFileMedical,
  FaCalendarAlt,
  FaNotesMedical,
  FaKey,
} from "react-icons/fa";
import UserService from "../../services/UserService";
import ChangePasswordModal from "../page/ChangePasswordModal"; // Import ChangePasswordModal

const DoctorHeader = () => {
  const [isDoctor, setIsDoctor] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false); // State để điều khiển modal

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    const name = sessionStorage.getItem("userName");

    if (role === "2") {
      setIsDoctor(true);
      setUserName(name);
    }
  }, []);

  const handleLogout = async () => {
    const userId = sessionStorage.getItem("userID");

    try {
      const response = await UserService.handleLogout(userId);
    } catch (error) {
      console.error("Lỗi khi logout phía BE:", error);
    }

    sessionStorage.clear();
    navigate("/login-admin-doctor");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Hàm mở/đóng modal đổi mật khẩu
  const toggleChangePasswordModal = () => {
    setIsChangePasswordModalOpen(!isChangePasswordModalOpen);
    setMenuOpen(false); // Đóng menu dropdown khi mở modal
  };

  // Hàm xử lý khi bác sĩ xác nhận đổi mật khẩu
  const handleConfirmChangePassword = async (formData) => {
    try {
      const userID = sessionStorage.getItem("userID");
      if (!userID) {
        alert("Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
        return;
      }

      const response = await UserService.handleChangePass({
        userId: userID,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (response.data.errCode === 0) {
        alert("Đổi mật khẩu thành công!");
        toggleChangePasswordModal();
      } else {
        alert(response.errMessage || "Đổi mật khẩu không thành công.");
      }
    } catch (e) {
      alert("Có lỗi xảy ra khi đổi mật khẩu.");
      console.error("Lỗi khi đổi mật khẩu:", e);
    }
  };

  // if (!isDoctor) return null; // Không hiển thị nếu không phải bác sĩ

  return (
    <div className="admin-header-container">
      <div className="admin-header-content">
        <div className="admin-left">
          <div className="admin-logo">Trang Bác Sĩ</div>
        </div>
        <div className="admin-center">
          <div
            className={`admin-menu-item ${isActive("/homedoctor")}`}
            onClick={() => navigate("/homedoctor")}
          >
            <FaListAlt className="admin-icon" /> Danh Sách Lịch Hẹn
          </div>
          <div
            className={`admin-menu-item ${isActive("/create-shedule")}`}
            onClick={() => navigate("/create-shedule")}
          >
            <FaFileMedical className="admin-icon" /> Tạo Lịch Làm Việc
          </div>
          <div
            className={`admin-menu-item ${isActive("/schedule")}`}
            onClick={() => navigate("/schedule")}
          >
            <FaCalendarAlt className="admin-icon" /> Lịch Làm Việc
          </div>
          <div
            className={`admin-menu-item ${isActive("/medicalrecords")}`}
            onClick={() => navigate("/medicalrecords")}
          >
            <FaNotesMedical className="admin-icon" /> Hồ Sơ Bệnh Án
          </div>
        </div>
        <div className="admin-right">
          <div className="admin-user">
            Xin chào, <b onClick={toggleMenu}>{userName}</b>
          </div>
          <div className="admin-logout" onClick={handleLogout}>
            <FaSignOutAlt className="admin-icon" /> Đăng xuất
          </div>
        </div>
        {menuOpen && (
          <div className="menu-dropdown">
            <div
              className="menu-item"
              onClick={toggleChangePasswordModal} // Mở modal khi nhấn "Đổi mật khẩu"
            >
              <FaKey className="fa-icon-menu" style={{ margin: "3px" }} /> Đổi
              mật khẩu
            </div>
          </div>
        )}
      </div>

      {/* Tích hợp ChangePasswordModal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        toggle={toggleChangePasswordModal}
        onConfirm={handleConfirmChangePassword}
      />
    </div>
  );
};

export default DoctorHeader;
