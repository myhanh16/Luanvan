import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./doctor.css";
import UserService from "../../../services/UserService";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

const Doctor = () => {
  const [doctor, setDoctor] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const settings = {
    dots: true, //An dau . neu la false
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
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
  return (
    <div className="section-doctor">
      <div className="doctor-container">
        <div className="doctor-header">
          <span className="title-section">Bác sĩ nổi bật</span>
          <button
            className="btn-section"
            onClick={(e) => {
              e.preventDefault();
              navigate("/topdoctor");
            }}
          >
            Xem thêm
          </button>
        </div>
        <div className="specailty-body">
          <Slider {...settings}>
            {doctor.length > 0 ? (
              doctor.slice(0, 6).map((doctors, index) => (
                <div className="specialty-customize" key={index}>
                  <img
                    className="doctor-img"
                    src={`${process.env.REACT_APP_BACKEND_URL}/img/doctor/${doctors.specialtyID}/${doctors.img}`}
                    alt={doctors.User.fullname}
                    onClick={() => handelgetDoctorByid(doctors.id)}
                  />
                  <div
                    className="text-content"
                    onClick={() => handelgetDoctorByid(doctors.id)}
                  >
                    {doctors.User.fullname}
                  </div>
                  <div className="text-specialty">
                    Chuyên khoa: {doctors.specialty.name}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-content">Không có dữ liệu</div>
            )}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
