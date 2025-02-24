import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./doctorList.css";
import HomeFooter from "../homefooter";
import Homeheader from "../header";
import UserService from "../../../services/UserService";

const TopDoctor = () => {
  const [doctor, setDoctor] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fectgetDotor = async () => {
    try {
      const response = await UserService.getTopExperiencedDoctor();
      setDoctor(response.data.doctor);
      console.log(response.data.doctor);
    } catch (e) {
      console.log(e);
    }
  };

  //Chon de hien thi chi tiet bac si
  const handelgetDoctorByid = (doctorID) => {
    navigate(`/detail/${doctorID}`);
  };

  useEffect(() => {
    fectgetDotor();
  }, []);

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
          <span>Tư Vấn Trực Tuyến</span>
        </div>

        {doctor.length > 0 ? (
          doctor.map((doctor) => (
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
                <div
                  className="text-content"
                  onClick={() => handelgetDoctorByid(doctor.id)}
                >
                  {doctor.User.fullname}
                </div>
                <div className="text">Chuyên khoa: {doctor.specialty.name}</div>
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

export default TopDoctor;
