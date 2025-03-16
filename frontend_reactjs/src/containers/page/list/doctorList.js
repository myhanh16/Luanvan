import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./doctorList.css";
import HomeFooter from "../homefooter";
import Homeheader from "../header";
import UserService from "../../../services/UserService";

const DoctorList = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [detailSpecialty, setdetailSpecialty] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [doctors, setDoctor] = useState([]);
  const [schedule, setSchedule] = useState([]);
  // const [selectedDate, setSelectedDate] = useState("");
  const [selectedDates, setSelectedDates] = useState("");
  const [selectedTime, setSelectedTime] = useState(null); // Lưu giờ khám đã chọn
  const [availableTimes, setAvailableTimes] = useState("");
  const [doctorSchedules, setDoctorSchedules] = useState({});

  const fetchSpecialtyByid = async () => {
    try {
      const response = await UserService.getSpecialtyByID(id);
      setdetailSpecialty(response.data.detail);
      console.log(response.data.detail);
    } catch (e) {
      console.log(e);
      setError("Lỗi: ", e);
    }
  };

  const fetchDoctorBySpecialtyID = async () => {
    try {
      const response = await UserService.getDoctorsBySpecialtyID(id);
      setDoctor(response.data.doctors);
    } catch (e) {
      console.log(e);
      setError("Lỗi tại danh sách bác sĩ");
    }
  };

  const fetchDoctorSchedule = async (doctorID) => {
    try {
      const response = await UserService.getSchedule(doctorID);
      setDoctorSchedules((prevSchedules) => ({
        ...prevSchedules,
        [doctorID]: response.data.schedule,
      }));

      // Kiểm tra cấu trúc dữ liệu của response
      if (response.data.schedule && Array.isArray(response.data.schedule)) {
        response.data.schedule.forEach((schedule) => {
          console.log("Schedule ID:", schedule.id);
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // const handleDateChange = (event, doctorID) => {
  //   const selected = event.target.value;
  //   setSelectedDate(selected);

  //   const doctorSchedule = doctorSchedules[doctorID] || [];
  //   const timesForSelectedDate = doctorSchedule.filter(
  //     (s) => s.date === selected
  //   );

  //   setAvailableTimes((prev) => ({
  //     ...prev,
  //     [doctorID]: timesForSelectedDate,
  //   }));
  // };
  const handleDateChange = (event, doctorID) => {
    const selected = event.target.value;

    // Lưu ngày chọn riêng cho từng bác sĩ
    setSelectedDates((prevDates) => ({
      ...prevDates,
      [doctorID]: selected,
    }));

    const doctorSchedule = doctorSchedules[doctorID] || [];
    const timesForSelectedDate = doctorSchedule.filter(
      (s) => s.date === selected
    );

    setAvailableTimes((prev) => ({
      ...prev,
      [doctorID]: timesForSelectedDate, // Chỉ cập nhật cho bác sĩ hiện tại
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

  const handelgetDoctorByid = (doctorID) => {
    navigate(`/detail/${doctorID}`);
  };

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
          selectedDate: selectedDates[doctor.id],
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

  useEffect(() => {
    fetchSpecialtyByid();
    fetchDoctorBySpecialtyID();
  }, [id]);

  useEffect(() => {
    if (doctors.length > 0) {
      doctors.forEach((doctor) => {
        fetchDoctorSchedule(doctor.id);
      });
    }
  }, [doctors]);

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    const name = sessionStorage.getItem("userName");
    const userID = sessionStorage.getItem("userID");
    const email = sessionStorage.getItem("userEmail");
    const phone = sessionStorage.getItem("userPhone");
    const address = sessionStorage.getItem("userAddress");
    const birthYear = sessionStorage.getItem("userbirthYear");
    // const userData = JSON.parse(sessionStorage.getItem("userData"));
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
    }
  }, []);
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
          <span>{detailSpecialty ? detailSpecialty.name : "Loading..."}</span>
        </div>

        <h1>{detailSpecialty ? detailSpecialty.name : "Loading..."}</h1>
        {detailSpecialty ? (
          <p>{detailSpecialty.description}</p>
        ) : (
          <p>Đang tải thông tin chuyên khoa...</p>
        )}

        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div className="doctor-card" key={doctor.id}>
              <img
                className="img-doctor"
                src={`${process.env.REACT_APP_BACKEND_URL}/img/doctor/${doctor.specialtyID}/${doctor.img}`}
                alt={doctor.User.fullname}
                onClick={() => handelgetDoctorByid(doctor.id)}
                style={{
                  cursor: "pointer",
                }}
              />
              <div className="doctor-details">
                <h3
                  className=""
                  onClick={() => handelgetDoctorByid(doctor.id)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  {doctor.User.fullname}
                </h3>

                <p>Kinh nghiệm: {doctor.experience_years} năm kinh nghiệm</p>
                <p>Giới thiệu: {doctor.description}</p>
                <p>Phòng khám: {doctor.workroom}</p>
                <p>
                  <strong>Giá khám bệnh:</strong>{" "}
                  {doctor.specialty?.price?.price
                    ? doctor.specialty.price.price + " VNĐ"
                    : "Liên hệ"}
                </p>
              </div>

              <div className="schedule">
                <h4>Lịch khám</h4>
                <select
                  onChange={(e) => handleDateChange(e, doctor.id)}
                  value={selectedDates[doctor.id] || ""}
                >
                  <option value="">Chọn ngày khám</option>
                  {getUniqueDates(doctor.id).map((date, index) => (
                    <option key={index} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>

                {selectedDates[doctor.id] &&
                availableTimes[doctor.id]?.length > 0 ? (
                  <div>
                    <h5>Giờ khám:</h5>
                    <div className="times-buttons">
                      {availableTimes[doctor.id].map((s, index) => (
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
          ))
        ) : (
          <p>Không có bác sĩ nào trong chuyên khoa này.</p>
        )}
      </div>

      <HomeFooter />
    </React.Fragment>
  );
};

export default DoctorList;
