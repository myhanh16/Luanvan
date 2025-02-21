import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FaTimes } from "react-icons/fa";
import emitter from "../../utils/emitter";
import DoctorService from "../../services/DoctorService";

const MedicalRecordModal = ({ isOpen, toggle, onConfirm, appointment }) => {
  const [formData, setFormData] = useState({
    bookingID: "",
    diagnosis: "",
    treatment: "",
  });

  const [medicalHistory, setMedicalHistory] = useState([]);

  useEffect(() => {
    console.log("Dữ liệu appointmment: ", appointment);

    if (appointment) {
      setFormData({
        bookingID: appointment.id,
        diagnosis: appointment.diagnosis,
        treatment: appointment.treatment,
      });
      if (appointment.User?.id) {
        fetchMedicalHistory(appointment.User.id);
      }
    }
  }, [appointment]);

  const fetchMedicalHistory = async (userID) => {
    try {
      const response = await DoctorService.handleGetMedicalRecordsByUserID(
        userID
      );
      console.log(response.data.data);

      if (response.data.errCode === 0) {
        setMedicalHistory(response.data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    if (checkInput()) {
      console.log("Dữ liệu hồ sơ bệnh án được gửi:", formData);
      onConfirm(formData);
    }
  };

  const checkInput = () => {
    if (!formData.diagnosis || !formData.treatment) {
      alert("Vui lòng nhập đầy đủ chẩn đoán và phương pháp điều trị");
      return false;
    }
    return true;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không có ngày"; // Kiểm tra nếu `dateString` bị undefined
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="modal-title">Lập Hồ Sơ Bệnh Án</span>
        <FaTimes
          onClick={toggle}
          className="close-icon"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            cursor: "pointer",
          }}
        />
      </ModalHeader>
      <ModalBody>
        {appointment && (
          <div>
            <p>
              <strong>Họ Tên:</strong> {appointment.User?.fullname}
            </p>
            <p>
              <strong>Email:</strong> {appointment.User?.email}
            </p>
            <p>
              <strong>Giới Tính:</strong>{" "}
              {appointment.User?.gender === 0 ? "Nam" : "Nữ"}
            </p>
            <p>
              <strong>Ngày Khám:</strong>{" "}
              {appointment.schedules?.date
                ? formatDate(appointment.schedules.date)
                : ""}
            </p>

            <p>
              <strong>Thời Gian Khám:</strong>{" "}
              {appointment.schedules.Time.starttime} -{" "}
              {appointment.schedules.Time.endtime}
            </p>
          </div>
        )}

        {medicalHistory.length > 0 && (
          <div className="medical-history">
            <h5>Lịch Sử Khám Trước Đó</h5>

            {medicalHistory.map((record, index) => (
              <div key={index}>
                <h6>Lần khám {index + 1}</h6>
                <p>
                  <strong>Chẩn đoán:</strong>{" "}
                  {record.diagnosis || "Không có thông tin"}
                </p>
                <p>
                  <strong>Phương pháp điều trị:</strong>{" "}
                  {record.treatment || "Không có thông tin"}
                </p>
                <hr />
              </div>
            ))}
          </div>
        )}

        <form>
          <div className="mb-3">
            <label>Chẩn Đoán</label>
            <input
              type="text"
              className="form-control"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Phương Pháp Điều Trị</label>
            <input
              type="text"
              className="form-control"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
            />
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleConfirm}>
          Lưu Hồ Sơ
        </Button>
        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default MedicalRecordModal;
