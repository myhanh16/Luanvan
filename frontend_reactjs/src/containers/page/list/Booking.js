import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserService from "../../../services/UserService";
import "./Booking.css"; // Import file CSS
import Homeheader from "../header";
import HomeFooter from "../homefooter";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor, user, selectedDate, selectedTime, scheduleID } =
    location.state;

  const handleBooking = async () => {
    const appointmentData = {
      userID: user.userID,
      doctorID: doctor.id,
      date: selectedDate,
      time: selectedTime,
      scheduleID: scheduleID,
      // scheduleID: selectedTime.scheduleID,
    };
    console.log(appointmentData);
    console.log(location.state);

    try {
      const response = await UserService.Booking(appointmentData);
      if (response.data.errCode === 0) {
        alert("Đặt lịch thành công!");
        navigate("/"); // Chuyển hướng về trang chủ sau khi đặt lịch thành công
      } else {
        console.log("ErrCode:", response.data.errCode); // Kiểm tra errCode
        console.log("ErrMessage:", response.data.errMessage); // Kiểm tra errMessage
        alert(response.data.errMessage || "Có lỗi xảy ra"); // Hiển thị lỗi nếu có
      }
    } catch (error) {
      console.error("Lỗi khi đặt lịch:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handelgetDoctorByid = (doctorID) => {
    navigate(`/detail/${doctorID}`);
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <React.Fragment>
      <Homeheader />
      <div className="specialty-page">
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

          <a
            href={`/specialty/${doctor.specialtyID}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/specialty/${doctor.specialtyID}`);
            }}
          >
            {doctor.specialty ? doctor.specialty.name : "Chuyên khoa"}
          </a>
          <span>/</span>

          <a
            href={`/detail/${doctor.id}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/detail/${doctor.id}`);
            }}
          >
            {doctor.User.fullname}
          </a>
          <span>/</span>

          <span>Thông tin lịch khám</span>
        </div>

        <div className="booking-container">
          <h1 className="booking-title">Thông tin đặt lịch khám</h1>
          <h3 className="section-title">Thông tin bác sĩ:</h3>
          <div className="booking-info">
            <img
              className="img-doctor"
              src={`${process.env.REACT_APP_BACKEND_URL}/img/doctor/${doctor.specialtyID}/${doctor.img}`}
              alt={doctor.User.fullname}
              onClick={() => handelgetDoctorByid(doctor.id)}
              style={{
                cursor: "pointer",
              }}
            />
            <p>
              <strong>Bác sĩ:</strong> {doctor.User.fullname}
            </p>
            <p>
              <strong>Chuyên khoa:</strong> {doctor?.specialty.name}
            </p>
            <p>
              <strong>Giới thiệu:</strong> {doctor.description}
            </p>
            <p>
              <strong>Ngày khám:</strong> {formatDate(selectedDate)}
            </p>
            <p>
              <strong>Giờ khám:</strong> {selectedTime?.Time.starttime} -{" "}
              {selectedTime?.Time.endtime}
            </p>
            <p>
              <strong>Giá khám bệnh:</strong>{" "}
              {doctor.specialty?.price?.price
                ? doctor.specialty.price.price + " VNĐ"
                : "Liên hệ"}
            </p>
            <p>
              <strong>Phòng khám:</strong>{" "}
              {doctor.workroom ? doctor.workroom : "Chưa có thông tin"}
            </p>
          </div>

          <h3 className="section-title">Thông tin cá nhân:</h3>
          <div className="user-info">
            <p>
              <strong>Họ và tên:</strong> {user.fullname}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {user.phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {user.address}
            </p>
            <p>
              <strong>Năm sinh:</strong> {user.birthYear}
            </p>
          </div>

          <button className="booking-button" onClick={handleBooking}>
            Đăng ký lịch khám
          </button>
        </div>
      </div>
      <HomeFooter />
    </React.Fragment>
  );
};

export default Booking;
