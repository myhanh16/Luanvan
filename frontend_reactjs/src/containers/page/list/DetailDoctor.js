import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DetailDoctor.css";
import HomeFooter from "../homefooter";
import Homeheader from "../header";
import UserService from "../../../services/UserService";

const DetailDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [detailSpecialty, setDetailSpecialty] = useState(null);
  const [error, setError] = useState("");
  const [doctorSchedules, setDoctorSchedules] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState({});

  // Lấy thông tin bác sĩ theo ID
  const fetchDoctorByid = async () => {
    try {
      const response = await UserService.getDoctorByid(id);
      if (response.data && response.data.doctor) {
        setDoctor(response.data.doctor);
        fetchSpecialtyById(response.data.doctor.specialtyID);
      } else {
        setError("Không có dữ liệu bác sĩ");
      }
    } catch (e) {
      setError("Lỗi tải thông tin bác sĩ");
    }
  };

  // Lấy thông tin chuyên khoa theo ID
  const fetchSpecialtyById = async (specialtyID) => {
    try {
      const response = await UserService.getSpecialtyByID(specialtyID);
      setDetailSpecialty(response.data.detail);
    } catch (e) {
      console.log(e);
      setError("Lỗi tải thông tin chuyên khoa");
    }
  };

  // Lấy lịch làm việc của bác sĩ
  const fetchDoctorSchedule = async (doctorID) => {
    try {
      const response = await UserService.getSchedule(doctorID);
      setDoctorSchedules((prevSchedules) => ({
        ...prevSchedules,
        [doctorID]: response.data.schedule,
      }));
    } catch (e) {
      console.log(e);
    }
  };

  const handleDateChange = (event, doctorID) => {
    const selected = event.target.value;
    setSelectedDate(selected);

    const doctorSchedule = doctorSchedules[doctorID] || [];
    const timesForSelectedDate = doctorSchedule.filter(
      (s) => s.date === selected
    );

    setAvailableTimes((prev) => ({
      ...prev,
      [doctorID]: timesForSelectedDate,
    }));
  };

  const getUniqueDates = (doctorID) => {
    const doctorSchedule = doctorSchedules[doctorID] || [];
    const uniqueDates = [...new Set(doctorSchedule.map((s) => s.date))];
    return uniqueDates;
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    fetchDoctorByid();
  }, [id]);

  useEffect(() => {
    if (doctor) {
      fetchDoctorSchedule(doctor.id);
    }
  }, [doctor]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!doctor) {
    return <p>Đang tải thông tin bác sĩ...</p>;
  }

  return (
    <React.Fragment>
      <Homeheader />{" "}
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
          <span>
            <a
              href={`/doctor/${detailSpecialty ? detailSpecialty.id : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(
                  `/doctor/${detailSpecialty ? detailSpecialty.id : ""}`
                );
              }}
            >
              {detailSpecialty ? detailSpecialty.name : "Chuyên khoa"}
            </a>
          </span>
          <span>/</span>
          <span>{doctor.User?.fullname}</span>
        </div>
        <div className="container  mt-4">
          <div className="card shadow p-4">
            <div className="card-body">
              <div className="row">
                {/* Ảnh bác sĩ */}
                <div className="col-lg-4 col-md-5 col-sm-6 text-center">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/img/doctor/${doctor.specialtyID}/${doctor.img}`}
                    className="img-fluid rounded-circle"
                    alt={doctor.User.fullname}
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Thông tin bác sĩ */}
                <div className="col-lg-8 col-md-7 col-sm-6">
                  <h3 className="doctor-name">
                    {doctor.User?.fullname || "Chưa có tên bác sĩ"}
                  </h3>
                  <p>
                    <strong>Kinh nghiệm:</strong> {doctor.experience_years} năm
                  </p>
                  <p>
                    <strong>Giới thiệu:</strong> {doctor.description}
                  </p>
                  <p>
                    <strong>Phòng khám:</strong> {doctor.workroom}
                  </p>
                  <p>
                    <strong>Giá khám bệnh:</strong>{" "}
                    {detailSpecialty?.price?.price
                      ? detailSpecialty.price.price + " VNĐ"
                      : "Liên hệ"}
                  </p>

                  {/* Chọn ngày khám */}
                  <div className="mt-4">
                    <label>
                      <strong>Lịch khám</strong>
                    </label>
                    <select
                      className="form-select"
                      onChange={(e) => handleDateChange(e, doctor.id)}
                    >
                      <option value="">Chọn ngày khám</option>
                      {getUniqueDates(doctor.id).length > 0 ? (
                        getUniqueDates(doctor.id).map((date, index) => (
                          <option
                            key={index}
                            value={date}
                            className="option-date"
                          >
                            {formatDate(date)}
                          </option>
                        ))
                      ) : (
                        <option disabled>Không có lịch khám</option>
                      )}
                    </select>

                    <small className="text-muted">
                      Chọn ngày để hiển thị giờ khám
                    </small>
                  </div>

                  {/* Hiển thị giờ khám */}
                  {selectedDate && availableTimes[doctor.id]?.length > 0 ? (
                    <div className="mt-3">
                      <p>
                        <strong>Giờ khám:</strong>
                      </p>
                      {availableTimes[doctor.id].map((s, index) => (
                        <button
                          key={index}
                          className="time-button"
                          onClick={() => {
                            // Hành động khi người dùng nhấn chọn giờ
                            console.log(
                              `Chọn giờ: ${s.Time.starttime} - ${s.Time.endtime}`
                            );
                          }}
                        >
                          {s.Time.starttime} - {s.Time.endtime}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3">Chưa có giờ khám cho ngày đã chọn</p>
                  )}

                  {/* Nút đặt lịch */}
                  {/* <button className="btn btn-primary mt-3">Chọn & Đặt</button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HomeFooter />
    </React.Fragment>
  );
};

export default DetailDoctor;
