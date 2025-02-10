import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserService from "../../../services/UserService";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor, user, selectedDate, selectedTime } = location.state;

  const handleBooking = async () => {
    const appointmentData = {
      userID: user.userID,
      doctorID: doctor.id,
      date: selectedDate,
      time: selectedTime,
    };

    try {
      const response = await UserService.Booking(appointmentData);
      if (response.errCode === 0) {
        alert("Đặt lịch thành công!");
        navigate("/"); // Chuyển hướng về trang chủ sau khi đặt lịch thành công
      } else {
        alert(response.errMessage); // Hiển thị lỗi nếu có
      }
    } catch (error) {
      console.error("Lỗi khi đặt lịch:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <h1>Thông tin lịch khám</h1>
      <p>
        <strong>Bác sĩ:</strong> {doctor.User.fullname}
      </p>
      <p>
        <strong>Chuyên khoa:</strong> {doctor.specialty.name}
      </p>
      <p>
        <strong>Ngày khám:</strong> {selectedDate}
      </p>
      <p>
        <strong>Giờ khám:</strong> {selectedTime.starttime} -{" "}
        {selectedTime.endtime}
      </p>

      <h3>Thông tin cá nhân:</h3>
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
      <button onClick={handleBooking}>Đăng ký lịch khám</button>
    </div>
  );
};

export default Booking;
