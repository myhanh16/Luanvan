import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./appointment.css";
import Homeheader from "../header";
import HomeFooter from "../homefooter";
import UserService from "../../../services/UserService";
import { FaCalendarTimes, FaFilter } from "react-icons/fa";

const AppointmentGrid = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // Trạng thái lọc
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchAppointment = async (userID) => {
    if (!userID) return;
    try {
      const response = await UserService.Appointment(userID);
      if (response.data.errCode === 0) {
        setAppointments(response.data.result);
        setFilteredAppointments(response.data.result); // Đặt dữ liệu mặc định khi không có lọc
        console.log(response.data.result);
      } else {
        console.error("Lỗi lấy lịch hẹn:", response.errMessage);
        setAppointments([]);
        setFilteredAppointments([]);
      }
    } catch (error) {
      setError("Lỗi tải thông tin lich hen");
    }
  };

  const handelgetDoctorByid = (doctorID) => {
    navigate(`/detail/${doctorID}`);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    // Lọc lại lịch hẹn dựa trên trạng thái được chọn
    if (e.target.value === "") {
      setFilteredAppointments(appointments); // Hiển thị tất cả
    } else {
      setFilteredAppointments(
        appointments.filter(
          (appointment) => appointment.status?.id === parseInt(e.target.value)
        )
      );
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    const name = sessionStorage.getItem("userName");
    const userID = sessionStorage.getItem("userID");
    const email = sessionStorage.getItem("userEmail");
    const phone = sessionStorage.getItem("userPhone");
    const address = sessionStorage.getItem("userAddress");
    const birthYear = sessionStorage.getItem("userbirthYear");
    if (token && userID) {
      setIsLoggedIn(true);
      setUser({
        fullname: name,
        userID: userID,
        email: email,
        phone: phone,
        address: address,
        birthYear: birthYear,
      });
      fetchAppointment(userID);
    }
  }, []);

  return (
    <React.Fragment>
      <Homeheader />
      <div className="appointment-page">
        <div className="appointment-grid-container">
          <div className="breadcrumb">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              Trang chủ
            </a>
            <span>/</span>
            <span>Lịch hẹn của bạn</span>
          </div>

          {/* Bộ lọc trạng thái */}
          <div className="status-filter">
            <select onChange={handleStatusFilterChange} value={statusFilter}>
              <option value="">Tất cả</option>
              <option value="1">Lịch mới đặt</option>
              <option value="2">Lịch đã khám xong</option>
              <option value="3">Lịch đã hủy</option>
            </select>
          </div>

          <div className="appointment-grid">
            {Array.isArray(filteredAppointments) &&
            filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => {
                const schedule = appointment.schedules;
                const doctor = schedule?.Doctor;
                return (
                  <div
                    key={appointment.id}
                    className={`appointment-item status-${appointment.status?.id}`}
                  >
                    <img
                      className="img-doctor"
                      src={
                        doctor?.img
                          ? `${process.env.REACT_APP_BACKEND_URL}/img/doctor/${doctor.specialtyID}/${doctor.img}`
                          : "/default-avatar.png"
                      }
                      alt={doctor?.User?.fullname || "Bác sĩ"}
                      onClick={() =>
                        doctor?.id && handelgetDoctorByid(doctor.id)
                      }
                      style={{
                        cursor: doctor?.id ? "pointer" : "default",
                      }}
                    />
                    <p className="appointment-doctor">
                      <strong>Bác sĩ:</strong>{" "}
                      {doctor?.User?.fullname || "Chưa có thông tin"}
                    </p>
                    <p className="appointment-specialty">
                      <strong>Chuyên khoa:</strong>{" "}
                      {doctor?.specialty?.name || "Chưa có thông tin"}
                    </p>
                    <p className="appointment-date">
                      <strong>Ngày khám:</strong>{" "}
                      {formatDate(schedule?.date) || "N/A"}
                    </p>
                    <p className="appointment-time">
                      <strong>Thời gian:</strong>{" "}
                      {schedule?.Time?.starttime || "N/A"} -{" "}
                      {schedule?.Time?.endtime || "N/A"}
                    </p>
                    <p className="appointment-status">
                      <strong>Trạng thái:</strong>{" "}
                      {appointment.status?.name || "N/A"}
                    </p>
                    <p className="appointment-price">
                      <strong>Giá khám bệnh:</strong>{" "}
                      {doctor?.specialty?.price?.price?.toLocaleString() ||
                        "N/A"}{" "}
                      VNĐ
                    </p>
                    <p className="appointment-status">
                      <strong>Ngày đặt lịch hẹn:</strong>{" "}
                      {formatDate(appointment.booking_date) || "N/A"}
                    </p>

                    {appointment.status?.id === 1 && (
                      <button className="abort">Hủy lịch hẹn</button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="no-data">
                <span className="no-data-icon">
                  <FaCalendarTimes /> Bạn chưa đặt lịch khám bệnh
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <HomeFooter />
    </React.Fragment>
  );
};

export default AppointmentGrid;
