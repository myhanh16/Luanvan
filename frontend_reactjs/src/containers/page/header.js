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
  FaUser,
} from "react-icons/fa";
import "./homeheader.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import UserService from "../../services/UserService";

const Homeheader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [userName, setUserName] = useState("");
  const [serachTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    const name = sessionStorage.getItem("userName");
    if (token) {
      setIsLoggedIn(true);
      setUserName(name);
    }
  }, []);

  const handeleSearch = async () => {
    if (!serachTerm.trim()) {
      alert("Vui lòng nhập từ khóa tìm kiếm!");
      return;
    }
    try {
      const response = await UserService.handleSearchSpecialty(serachTerm);
      if (response.data.errCode === 0 && response.data.data.length > 0) {
        // setSearchResults(response.data);
        const specialtyID = response.data.data[0].id;
        navigate(`/doctor/${specialtyID}`);
      } else {
        alert("Không tìm thấy chuyên khoa phù hợp!");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handlefetchProfile = async () => {
    const userID = sessionStorage.getItem("userID");
    navigate(`/profile/${userID}`);
  };

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
    navigate("/");
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

  //Đi đến trang lịch hẹn, kiểm tra xem đã login chua
  const handleGoToAppointments = () => {
    if (isLoggedIn) {
      // alert("hello");
      navigate("/appointment"); // Đi đến trang lịch hẹn nếu đã đăng nhập
    } else {
      alert("Vui lòng đăng nhập để xem lịch hẹn của bản thân.");
      navigate("/login"); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    }
  };

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
            <div className="header-logo" onClick={handleGoToHome}></div>
          </div>
          <div className="center-content">
            <div className="child-content">
              <div>
                <b
                  className="item"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/specialty-list");
                  }}
                >
                  Chuyên Khoa
                </b>
              </div>
              <div className="subs-tilte">Tìm bác sĩ theo chuyên khoa</div>
            </div>
            <div className="child-content">
              <div>
                <b
                  className="item"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/Online-Consulting");
                  }}
                >
                  Bác Sĩ
                </b>
              </div>
              <div className="subs-tilte">Chọn bác sĩ tư vấn trực tuyến</div>
            </div>

            {/* Chỉ hiển thị phần này khi người dùng đã đăng nhập */}

            <div className="child-content" onClick={handleGoToAppointments}>
              <div>
                <b className="item">Lịch hẹn</b>
              </div>
              <div className="subs-tilte">Lịch hẹn đã đặt</div>
            </div>
          </div>
          <div className="right-content">
            <div className="child-content">
              <FaUser className="fa-bars" onClick={toggleMenu} />

              <div className="subs-tilte">Thông tin tài khoản</div>
              {/* <FaQuestionCircle className="fa-question" />
              Hỗ Trợ */}
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
              <input
                type="text"
                placeholder="Tìm chuyên khoa khám bệnh"
                value={serachTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handeleSearch()}
              />
            </div>
          </div>
          {/* <div className="content-down">
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
          </div> */}
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
              <div className="menu-item" onClick={handlefetchProfile}>
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
