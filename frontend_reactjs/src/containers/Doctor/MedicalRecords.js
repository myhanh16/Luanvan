import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaNotesMedical } from "react-icons/fa";
import emitter from "../../utils/emitter";
import DoctorHeader from "./DoctorHeader";
import DoctorService from "../../services/DoctorService";
import MedicalRecordModal from "./MedicalRecordModal";

const MedicalRecords = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showIframe, setShowIframe] = useState(false);
  const [selectedDate, setSelectedDate] = useState(""); // Ngày được chọn để lọc lịch hẹn

  const handleFetchAppointment = async () => {
    const doctorID = sessionStorage.getItem("doctorID");
    if (!doctorID) {
      console.log("Không tìm thấy doctorID");
      return;
    }
    try {
      const response = await DoctorService.handleGetMedicalRecords();
      if (response.data.errCode === 0) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.log(error);
      setError("Lỗi khi tải dữ liệu");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không có ngày";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    handleFetchAppointment();
    const listener = emitter.on("Appointment", () => {
      handleFetchAppointment();
    });
  }, []);

  const handleShowModal = (appointment) => {
    console.log("Meetlink nhận được:", appointment.schedules.meetlink);
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleShowIframe = (appointment) => {
    setSelectedAppointment(appointment);
    setShowIframe(true);
  };

  const toggleEditModal = () => {
    setShowModal(!showModal);
  };

  const handleMedicalRecord = async (formData) => {
    const { bookingID, diagnosis, treatment } = formData;
    try {
      const response = await DoctorService.handleCreateMedicalRecord({
        bookingID,
        diagnosis,
        treatment,
      });
      if (response.data.errCode === 0) {
        alert(response.data.errMessage);
        await handleFetchAppointment();
        emitter.emit("Appointment");
        toggleEditModal();
      } else {
        console.log("Lỗi khi tạo hồ sơ bệnh án:", response.data.errMessage);
      }
    } catch (e) {
      console.log("Lỗi gọi API: ", e);
    }
  };

  useEffect(() => {
    const name = sessionStorage.getItem("name") || "Bác sĩ";
    console.log("Tên lấy từ sessionStorage:", name);

    const iframe = document.getElementById("jitsiFrame");
    if (iframe) {
      iframe.onload = () => {
        setTimeout(() => {
          const inputField = iframe.contentWindow?.document?.querySelector(
            'input[aria-label="Nhập tên của bạn"]'
          );
          if (inputField) {
            inputField.value = name;
          } else {
            console.log("Không tìm thấy input đặt tên.");
          }
        }, 3000);
      };
    }
  }, []);

  // Lọc lịch hẹn theo ngày được chọn
  const filteredAppointments = selectedDate
    ? appointments.filter(
        (appointment) => appointment.booking.schedules.date === selectedDate
      )
    : appointments;

  return (
    <React.Fragment>
      <DoctorHeader />
      <div>
        <div className="users-container">
          <div className="title text-center" style={{ fontSize: "20px" }}>
            Danh Sách Hồ Sơ Bệnh Án
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Bộ lọc chọn ngày */}
          <div className="filter-section text-center mt-3">
            {/* <p style={{ whiteSpace: "nowrap" }}>
              <strong>Chọn ngày:</strong>
            </p> */}
            <input
              type="date"
              className="form-control w-25 d-inline-block mx-2"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedDate("")}
            >
              Xóa Lọc
            </button>
          </div>

          <div className="user-table mt-4 mx-3">
            <table id="customers">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Họ Tên</th>
                  <th>Số Điện Thoại</th>
                  <th>Địa chỉ</th>
                  <th>Giới tính</th>
                  <th>Năm sinh</th>
                  <th>Ngày khám</th>
                  <th>Thời gian khám</th>
                  <th>Ngày đặt lịch</th>
                  <th>Chuẩn đoán</th>
                  <th>Phương pháp điều trị</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment, index) => (
                    <tr key={index}>
                      <td>{appointment.booking?.User?.email || "N/A"}</td>
                      <td>{appointment.booking?.User?.fullname || "N/A"}</td>
                      <td>{appointment.booking?.User?.phone || "N/A"}</td>
                      <td>{appointment.booking?.User?.address || "N/A"}</td>
                      <td>
                        {appointment.booking?.User?.gender === "male"
                          ? "Nam"
                          : "Nữ"}
                      </td>
                      <td>{appointment.booking?.User?.birthYear || "N/A"}</td>
                      <td>
                        {formatDate(appointment.booking?.schedules?.date)}
                      </td>
                      <td>
                        {appointment.booking?.schedules?.Time
                          ? `${appointment.booking.schedules.Time.starttime} - ${appointment.booking.schedules.Time.endtime}`
                          : "Chưa có thời gian"}
                      </td>

                      <td>{formatDate(appointment.booking?.booking_date)}</td>
                      <td>{appointment.diagnosis || "Chưa có"}</td>
                      <td>{appointment.treatment || "Chưa có"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MedicalRecords;
