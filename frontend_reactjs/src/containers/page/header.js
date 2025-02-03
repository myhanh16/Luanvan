import React, { useEffect, useState, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaBars,
  FaQuestionCircle,
  FaHome,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaSearch,
  FaHospital,
  FaMobileAlt,
  FaStethoscope,
  FaMicroscope,
} from "react-icons/fa";
import "./homeheader.css";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Homeheader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    const name = sessionStorage.getItem("userName");
    if (token) {
      setIsLoggedIn(true);
      setUserName(name);
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    sessionStorage.clear();
    setMenuOpen(false);
  };

  const handleGoToHome = () => {
    setMenuOpen(false);
    navigate("/");
  };

  // Hàm đóng menu khi người dùng nhấn ra ngoài
  const closeMenuIfClickOutside = useCallback((event) => {
    const menuElement = document.querySelector(".menu-dropdown");
    const barsElement = document.querySelector(".fa-bars");
    if (
      menuElement &&
      !menuElement.contains(event.target) &&
      !barsElement.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", closeMenuIfClickOutside);
    return () => {
      document.removeEventListener("click", closeMenuIfClickOutside);
    };
  }, [closeMenuIfClickOutside]);

  return (
    <React.Fragment>
      <div className="home-header-container">
        <div className="home-header-content">
          <div className="left-content">
            <FaBars className="fa-bars" onClick={toggleMenu} />
            <div className="header-logo" onClick={handleGoToHome}></div>
          </div>
          <div className="center-content">
            <div className="child-content">
              <div>
                <b>Chuyên Khoa</b>
              </div>
              <div className="subs-tilte">Tìm bác sĩ theo chuyên khoa</div>
            </div>
            <div className="child-content">
              <div>
                <b>Bác Sĩ</b>
              </div>
              <div className="subs-tilte">Chọn bác sĩ giỏi</div>
            </div>
            <div className="child-content">
              <div>
                <b>Gói Khám</b>
              </div>
              <div className="subs-tilte">Khám sức khỏe tổng quát</div>
            </div>
            {/* Chỉ hiển thị phần này khi người dùng đã đăng nhập */}
            {isLoggedIn && (
              <div className="child-content">
                <div>
                  <b>Lịch hẹn</b>
                </div>
                <div className="subs-tilte">Lịch hẹn đã đặt</div>
              </div>
            )}
          </div>
          <div className="right-content">
            <div className="support">
              <FaQuestionCircle className="fa-question" />
              Hỗ Trợ
            </div>
          </div>
        </div>
      </div>

      {/* Chỉ hiển thị banner khi không ở trang login */}
      {location.pathname === "/" && (
        <div className="home-header-banner">
          <div className="content-up">
            <div className="title1">ĐẶT LỊCH DỄ DÀNG</div>
            <div className="title2">AN TÂM SỨC KHỎE MỖI NGÀY</div>
            <div className="search">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Tìm chuyên khoa khám bệnh" />
            </div>
          </div>
          <div className="content-down">
            <div className="options">
              <div className="option-child">
                <div className="icon-child">
                  <FaHospital className="hospital-icon" />
                </div>
                <div className="text-child">Khám chuyên khoa</div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <FaMobileAlt className="phone-icon" />
                </div>
                <div className="text-child">Khám từ xa</div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <FaStethoscope className="Stethoscope-icon" />
                </div>
                <div className="text-child">Khám tổng quát</div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <FaMicroscope className="microscope-icon" />
                </div>
                <div className="text-child">Xét nghiệm y học</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="menu-dropdown">
          <div className="menu-item" onClick={handleGoToHome}>
            <FaHome className="fa-icon-menu" /> Trang Chủ
          </div>
          {!isLoggedIn && (
            <div className="menu-item" onClick={handleLogin}>
              <FaSignInAlt className="fa-icon-menu" /> Đăng nhập
            </div>
          )}
          {isLoggedIn && (
            <>
              <div className="menu-item">
                <FaUserCircle className="fa-icon-menu" /> {userName}
              </div>
              <div className="menu-item" onClick={handleLogout}>
                <FaSignOutAlt className="fa-icon-menu" /> Đăng Xuất
              </div>
            </>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default Homeheader;
