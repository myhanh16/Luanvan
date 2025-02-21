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
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [selectedDates, setSelectedDates] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Lấy thông tin bác sĩ
  useEffect(() => {
    const fetchDoctorById = async () => {
      try {
        const response = await UserService.getDoctorByid(id);
        if (response.data && response.data.doctor) {
          setDoctor(response.data.doctor);
          fetchSpecialtyById(response.data.doctor.specialtyID);
          fetchDoctorSchedule(response.data.doctor.id);
        }
      } catch (e) {
        console.error("Lỗi tải thông tin bác sĩ", e);
      }
    };
    fetchDoctorById();
  }, [id]);

  // Lấy thông tin chuyên khoa
  const fetchSpecialtyById = async (specialtyID) => {
    try {
      const response = await UserService.getSpecialtyByID(specialtyID);
      setDetailSpecialty(response.data.detail);
    } catch (e) {
      console.error("Lỗi tải thông tin chuyên khoa", e);
    }
  };

  // Lấy lịch làm việc của bác sĩ
  const fetchDoctorSchedule = async (doctorID) => {
    try {
      const response = await UserService.getSchedule(doctorID);
      setDoctorSchedules(response.data.schedule);
    } catch (e) {
      console.error("Lỗi tải lịch khám", e);
    }
  };

  // Khi người dùng chọn ngày, cập nhật danh sách giờ khám
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDates(selectedDate);

    // Lọc danh sách giờ khám dựa trên ngày đã chọn
    const filteredTimes = doctorSchedules.filter(
      (s) => s.date === selectedDate
    );
    setAvailableTimes(filteredTimes);
  };

  // Đặt lịch khi chọn giờ khám
  const handleTimeSelect = (schedule, doctor) => {
    console.log("Selected Schedule ID:", schedule);
    if (isLoggedIn) {
      setSelectedTime(schedule); // Truyền toàn bộ đối tượng lịch
      navigate("/booking", {
        state: {
          doctor: doctor,
          user: {
            userID: user.userID,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            address: user.address,
            birthYear: user.birthYear,
          },
          selectedDate: selectedDates,
          selectedTime: schedule, // Truyền toàn bộ đối tượng lịch
          scheduleID: schedule.id, // Truyền ID của lịch
        },
      });
      console.log(selectedTime);
    } else {
      alert(
        "Vui lòng đăng nhập để tiếp tục đặt lịch. Việc đăng nhập giúp chúng tôi lấy thông tin cá nhân của bạn, giúp quá trình đặt lịch nhanh chóng và thuận tiện hơn!"
      );
      navigate("/login");
    }
  };

  // Lấy danh sách ngày khám duy nhất
  const getUniqueDates = () => {
    return [...new Set(doctorSchedules.map((s) => s.date))];
  };

  // Định dạng ngày từ YYYY-MM-DD -> DD/MM/YYYY
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Kiểm tra đăng nhập từ sessionStorage
  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (token) {
      setIsLoggedIn(true);
      setUser({
        userID: sessionStorage.getItem("userID"),
        fullname: sessionStorage.getItem("userName"),
        email: sessionStorage.getItem("userEmail"),
        phone: sessionStorage.getItem("userPhone"),
        address: sessionStorage.getItem("userAddress"),
        birthYear: sessionStorage.getItem("userbirthYear"),
      });
    }
  }, []);

  if (!doctor) {
    return <p>Đang tải thông tin bác sĩ...</p>;
  }

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
            href={`/doctor/${detailSpecialty?.id}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/doctor/${detailSpecialty?.id}`);
            }}
          >
            {detailSpecialty?.name || "Chuyên khoa"}
          </a>
          <span>/</span>
          <span>{doctor.User?.fullname}</span>
        </div>

        <div className="container mt-4">
          <div className="card shadow p-4">
            <div className="card-body">
              <div className="row">
                {/* Ảnh bác sĩ */}
                <div className="col-lg-4 text-center" key={doctor.id}>
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/img/doctor/${doctor.specialtyID}/${doctor.img}`}
                    className="img-fluid rounded-circle"
                    alt={doctor.User?.fullname}
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Thông tin bác sĩ */}
                <div className="col-lg-8">
                  <h3>{doctor.User?.fullname}</h3>

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
                    <strong>Giá khám:</strong>{" "}
                    {detailSpecialty?.price?.price
                      ? `${detailSpecialty.price.price} VNĐ`
                      : "Liên hệ"}
                  </p>

                  {/* Chọn ngày khám */}
                  <div className="mt-4">
                    <label>
                      <strong>Lịch khám</strong>
                    </label>
                    <select
                      className="form-select"
                      onChange={handleDateChange}
                      value={selectedDates}
                    >
                      <option value="">Chọn ngày khám</option>
                      {getUniqueDates().map((date, index) => (
                        <option key={index} value={date}>
                          {formatDate(date)}
                        </option>
                      ))}
                    </select>

                    {/* Chọn giờ khám */}
                    {selectedDates && availableTimes.length > 0 ? (
                      <div className="mt-3">
                        <h5>Giờ khám:</h5>
                        <div className="times-buttons">
                          {availableTimes.map((s, index) => (
                            <button
                              key={index}
                              className="time-button"
                              onClick={() => handleTimeSelect(s, doctor)}
                            >
                              {s.Time.starttime} - {s.Time.endtime}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p>Chọn ngày để hiển thị giờ khám</p>
                    )}
                  </div>
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
