import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaNotesMedical, FaTimesCircle, FaVideo } from "react-icons/fa";
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
  const [hovered, setHovered] = useState(null);

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
      } else {
        setAppointments([]); // Đặt rỗng nếu không có dữ liệu
      }
    } catch (error) {
      // setError(
      //   error.response?.data?.errMessage || "Lỗi khi tải dữ liệu từ server."
      // );
      setAppointments([]); // Đặt rỗng để hiển thị thông báo "Không có lịch hẹn"
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

  const handleMarkAbsent = async (bookingID) => {
    try {
      const response = await DoctorService.handleMarkAbsent(bookingID);

      if (response.data.errCode === 0) {
        alert(response.data.errMessage);
        await handleFetchAppointment(); // Cập nhật lại danh sách lịch hẹn
        emitter.emit("Appointment");
      } else {
        console.log("Lỗi: ", response.data.errMessage);
      }
    } catch (e) {
      console.log("Lỗi gọi API:", e);
    }
  };

  useEffect(() => {
    const name = sessionStorage.getItem("name") || "Bác sĩ";
    console.log("Tên lấy từ sessionStorage:", name);
    console.log("Tên trong iframe:", name);

    const iframe = document.getElementById("jitsiFrame");
    if (iframe) {
      iframe.onload = () => {
        setTimeout(() => {
          const inputField = iframe.contentWindow?.document?.querySelector(
            'input[aria-label="Nhập tên của bạn"]'
          );
          if (inputField) {
            inputField.value = sessionStorage.getItem("name");
          } else {
            console.log("Không tìm thấy input đặt tên.");
          }
        }, 3000);
      };
    }
  }, []);

  const today = new Date().toISOString().split("T")[0]; // Chuẩn hóa ngày hiện tại

  // Lọc lịch hẹn theo ngày được chọn
  const filteredAppointments = selectedDate
    ? appointments.filter(
        (appointment) => appointment.schedules.date === selectedDate
      )
    : appointments.filter((appointment) => {
        const appointmentDate = appointment.schedules.date;
        return appointmentDate === today;
      });

  // Lưu trữ các khung giờ đã render
  const renderedTimeSlots = new Set();

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
                  <th>STT</th>
                  <th>Họ Tên</th>
                  <th>Số Điện Thoại</th>
                  <th>Địa chỉ</th>
                  <th>Giới tính</th>
                  <th>Năm sinh</th>
                  <th>Thời gian khám</th>
                  <th>Ngày đặt lịch</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment, index) => {
                    const timeSlotKey = `${appointment.schedules.Time.starttime}-${appointment.schedules.Time.endtime}`;
                    const isOnline =
                      Number(
                        appointment.schedules.Doctor.onlineConsultation
                      ) === 1;
                    const canJoin =
                      appointment.statusID === 1 &&
                      appointment.schedules.meetlink;
                    const shouldRenderJoinButton =
                      isOnline &&
                      canJoin &&
                      !renderedTimeSlots.has(timeSlotKey);

                    if (shouldRenderJoinButton) {
                      renderedTimeSlots.add(timeSlotKey);
                    }

                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {appointment.User?.fullname || "Không có dữ liệu"}
                        </td>
                        <td>{appointment.User?.phone || "Không có dữ liệu"}</td>
                        <td>
                          {appointment.User?.address || "Không có dữ liệu"}
                        </td>
                        <td>
                          {Number(appointment.User?.gender) === 0
                            ? "Nam"
                            : "Nữ"}
                        </td>
                        <td>
                          {appointment.User?.birthYear || "Không có dữ liệu"}
                        </td>
                        <td>
                          {appointment.schedules.Time.starttime} -{" "}
                          {appointment.schedules.Time.endtime}
                        </td>
                        <td>{formatDate(appointment.booking_date)}</td>
                        <td>{appointment.status.name}</td>

                        <td>
                          {appointment.statusID === 1 && (
                            <button
                              className="btn btn-primary btn-sm btn-sm me-1"
                              onClick={() => handleShowModal(appointment)}
                              onMouseEnter={() => setHovered("Lập bệnh án")}
                              onMouseLeave={() => setHovered(null)}
                            >
                              <FaNotesMedical />
                              {hovered === "Lập bệnh án" && (
                                <span className="tooltip-text">
                                  Lập bệnh án
                                </span>
                              )}
                            </button>
                          )}

                          {appointment.statusID === 1 && (
                            <button
                              className="btn btn-warning btn-sm "
                              onClick={() => handleMarkAbsent(appointment.id)}
                              onMouseEnter={() =>
                                setHovered("Không đến khám bệnh")
                              }
                              onMouseLeave={() => setHovered(null)}
                            >
                              <FaTimesCircle />
                              {hovered === "Không đến khám bệnh" && (
                                <span className="tooltip-text">
                                  Không đến khám bệnh
                                </span>
                              )}
                            </button>
                          )}

                          {shouldRenderJoinButton ? (
                            <button
                              className="btn btn-success btn-sm "
                              onClick={() => handleShowIframe(appointment)}
                              onMouseEnter={() =>
                                setHovered("Tư vấn trực tuyến")
                              }
                              onMouseLeave={() => setHovered(null)}
                            >
                              <FaVideo />
                              {hovered === "Tư vấn trực tuyến" && (
                                <span className="tooltip-text">
                                  Tư vấn trực tuyến
                                </span>
                              )}
                            </button>
                          ) : (
                            <button
                              className="btn btn-success btn-sm me-1 invisible"
                              disabled
                            >
                              "-"
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
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
                  src={`${
                    selectedAppointment.schedules.meetlink
                  }#userInfo.displayName="${encodeURIComponent(
                    sessionStorage.getItem("name") || "Bác sĩ"
                  )}"&config.prejoinPageEnabled=false`}
                  allow="camera; microphone; fullscreen; display-capture"
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
