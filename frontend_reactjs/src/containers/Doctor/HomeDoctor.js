import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaNotesMedical } from "react-icons/fa";
import emitter from "../../utils/emitter";
import DoctorHeader from "./DoctorHeader";
import DoctorService from "../../services/DoctorService";
import MedicalRecordModal from "./MedicalRecordModal";

const HomeDoctor = () => {
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
      const response = await DoctorService.handleGetAppointmentByDoctorID(
        doctorID
      );
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
        (appointment) => appointment.schedules.date === selectedDate
      )
    : appointments;

  return (
    <React.Fragment>
      <DoctorHeader />
      <div>
        <div className="users-container">
          <MedicalRecordModal
            isOpen={showModal}
            toggle={toggleEditModal}
            onConfirm={handleMedicalRecord}
            appointment={selectedAppointment}
          />

          <div className="title text-center" style={{ fontSize: "20px" }}>
            Danh Sách Lịch Hẹn
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
                  <th>Trạng thái</th>
                  <th>Lập hồ sơ bệnh án</th>
                  <th>Link cuộc hẹn</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment, index) => (
                    <tr key={index}>
                      <td>{appointment.User?.email || "Không có dữ liệu"}</td>
                      <td>
                        {appointment.User?.fullname || "Không có dữ liệu"}
                      </td>
                      <td>{appointment.User?.phone || "Không có dữ liệu"}</td>
                      <td>{appointment.User?.address || "Không có dữ liệu"}</td>
                      <td>
                        {Number(appointment.User?.gender) === 0 ? "Nam" : "Nữ"}
                      </td>
                      <td>
                        {appointment.User?.birthYear || "Không có dữ liệu"}
                      </td>
                      <td>{formatDate(appointment.schedules.date)}</td>
                      <td>
                        {appointment.schedules.Time.starttime} -{" "}
                        {appointment.schedules.Time.endtime}
                      </td>
                      <td>{formatDate(appointment.booking_date)}</td>
                      <td>{appointment.status.name}</td>
                      <td>
                        {appointment.statusID !== 2 && (
                          // new Date(appointment.schedules.date) >=
                          //   new Date() &&
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleShowModal(appointment)}
                          >
                            <FaNotesMedical />
                          </button>
                        )}
                      </td>

                      {Number(
                        appointment.schedules.Doctor.onlineConsultation
                      ) === 1 &&
                        appointment.statusID !== 2 && (
                          <td>
                            {appointment.schedules.meetlink ? (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleShowIframe(appointment)}
                              >
                                Xem Cuộc Họp
                              </button>
                            ) : (
                              "Chưa tạo"
                            )}
                          </td>
                        )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center">
                      Không có lịch hẹn cho ngày này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {showIframe && selectedAppointment.schedules.meetlink && (
              <div className="meeting-container text-center mt-4">
                <h4>Cuộc họp trực tuyến</h4>
                <iframe
                  id="jitsiFrame"
                  src={selectedAppointment.schedules.meetlink}
                  allow="camera; microphone; fullscreen"
                  className="meeting-frame"
                ></iframe>
                <button
                  className="close-button"
                  onClick={() => setShowIframe(false)}
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HomeDoctor;
