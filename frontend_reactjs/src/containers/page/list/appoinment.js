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
  const [paymentStatus, setPaymentStatus] = useState({});

  const fetchAppointment = async (userID) => {
    if (!userID) {
      console.warn("⚠️ Không có userID, không gọi API.");
      return;
    }

    try {
      const response = await UserService.Appointment(userID);
      console.log("📢 API Appointment Response:", response.data); // Kiểm tra API trả về gì

      if (response.data && response.data.errCode === 0) {
        const results = response.data.result;
        if (Array.isArray(results) && results.length > 0) {
          setAppointments(results);
          setFilteredAppointments(results);

          // 🔥 Kiểm tra trạng thái thanh toán ngay sau khi lấy danh sách lịch hẹn
          results.forEach((appointments) => {
            if (
              appointments.status?.id === 2 &&
              Number(appointments.schedules?.Doctor?.onlineConsultation) === 1
            ) {
              checkPaymentStatus(appointments.id);
            }
          });
        } else {
          console.warn("⚠️ Không có lịch hẹn nào.");
          setAppointments([]);
          setFilteredAppointments([]);
        }
      } else {
        console.error("❌ Lỗi lấy lịch hẹn:", response.data.errMessage);
        setAppointments([]);
        setFilteredAppointments([]);
      }
    } catch (error) {
      console.error("❌ Lỗi tải thông tin lịch hẹn:", error);
      setError("Lỗi tải thông tin lịch hẹn");
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

  const handleAbortAppointment = async (bookingID) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?"))
      return;
    try {
      const response = await UserService.AbortAppointment(bookingID);
      if (response.data.errCode === 0) {
        alert("Hủy lịch hẹn thành công!");
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === bookingID
              ? { ...appointment, status: { id: 3, name: "Lịch đã hủy" } }
              : appointment
          )
        );
        setFilteredAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === bookingID
              ? { ...appointment, status: { id: 3, name: "Lịch đã hủy" } }
              : appointment
          )
        );
      } else {
        alert(response.data.errMessage);
      }
    } catch (error) {
      alert("Lỗi khi hủy lịch hẹn, vui lòng thử lại!");
    }
  };

  const handelPayMent = async (bookingID, amount) => {
    try {
      const response = await UserService.handelPayMent(
        { bookingID, amount },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("📢 Phản hồi từ API thanh toán:", response.data);
      if (response.data.result) {
        window.open(response.data.result, "_blank");
        // window.location.href = response.data.result;
        setTimeout(() => checkPaymentStatus(bookingID), 2000);
      } else {
        alert("Lỗi khi tạo giao dịch thanh toán!");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Không thể thực hiện thanh toán, vui lòng thử lại!");
    }
  };

  const checkPaymentStatus = async (bookingID) => {
    if (!bookingID) {
      console.error("❌ bookingID bị null hoặc undefined!");
      return;
    }

    try {
      const response = await UserService.handelPaymentStatus(bookingID);
      console.log("📢 Trạng thái thanh toán API:", response.data);

      if (response.data.payment && response.data.payment.payments?.length > 0) {
        const isPaid = response.data.payment.payments.some(
          (p) => p.status === "SUCCESS"
        );

        console.log("🔍 bookingID:", bookingID);
        console.log("✅ Đã thanh toán:", isPaid);

        setPaymentStatus((prev) => {
          const updatedStatus = {
            ...prev,
            [bookingID]: isPaid ? "SUCCESS" : "PENDING",
          };
          console.log("🔄 Cập nhật paymentStatus:", updatedStatus);
          return updatedStatus;
        });
      }
    } catch (error) {
      console.error("Lỗi kiểm tra thanh toán:", error);
    }
  };

  useEffect(() => {
    console.log("🔥 paymentStatus mới nhất:", paymentStatus);
  }, [paymentStatus]);

  useEffect(() => {
    if (appointments.length > 0) {
      appointments.forEach((appointment) => {
        if (
          appointment.status?.id === 2 &&
          Number(appointment.schedules?.Doctor?.onlineConsultation) === 1
        ) {
          checkPaymentStatus(appointment.id);
        }
      });
    }
  }, [appointments]);

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
                      {Number(doctor?.onlineConsultation) === 1 && (
                        <span
                          style={{
                            color: "green",
                            fontWeight: "bold",
                            marginLeft: "8px",
                          }}
                        >
                          (Tư vấn trực tuyến)
                        </span>
                      )}
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
                      <button
                        className="abort"
                        onClick={() => handleAbortAppointment(appointment.id)}
                      >
                        Hủy lịch hẹn
                      </button>
                    )}

                    {appointment.status?.id === 2 &&
                      Number(doctor?.onlineConsultation) === 1 &&
                      (console.log(
                        "💡 Trạng thái thanh toán của lịch hẹn",
                        appointment.id,
                        paymentStatus[appointment.id]
                      ),
                      paymentStatus[appointment.id] === "SUCCESS" ? (
                        <span className="ribbon">Đã thanh toán</span>
                      ) : (
                        <button
                          className="payment"
                          onClick={() =>
                            handelPayMent(
                              appointment.id,
                              doctor?.specialty?.price?.price
                            )
                          }
                        >
                          {paymentStatus[appointment.id] === "PENDING"
                            ? "Đang xử lý..."
                            : "Thanh Toán"}
                        </button>
                      ))}
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
