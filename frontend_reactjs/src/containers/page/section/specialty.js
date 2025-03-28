import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Slider from "react-slick";
import specialty from "./specialty.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import img1 from "../../../assets/specialty/co-xuong-khop.png";
import img2 from "../../../assets/specialty/than-kinh.png";
import img3 from "../../../assets/specialty/tieu-hoa.png";
import img4 from "../../../assets/specialty/tim-mach.png";
import img6 from "../../../assets/specialty/cot-song.png";
import img5 from "../../../assets/specialty/tai-mui-hong.png";
import UserService from "../../../services/UserService";
import doctorList from "../list/doctorList";

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

// Anh xa hinh anh theo ten chuyen khoa
const imageMapping = {
  "Cơ xương khớp": img1,
  "Thần kinh": img2,
  "Tiêu hóa": img3,
  "Tim mạch": img4,
  "Tai Mũi Họng": img5,
  "Cột sống": img6,
};

const Specialty = () => {
  const [specailty, setSpecialty] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //Slider cho section specialty
  const settings = {
    dots: true, //An dau . neu la false
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  //Lay du lieu specialty
  const fetchSpecialty = async () => {
    try {
      const response = await UserService.GetAllSpecialty();
      setSpecialty(response.data.specialty);
      console.log(response.data.specialty);
    } catch (e) {
      console.log(e);
      setError("Loi: ", e);
    }
  };

  //Chuyen sang trang danh sach doctor khi chon vao 1 chuyen khoan cu the
  const handleToDoctor = (specialtyId) => {
    navigate(`/doctor/${specialtyId}`);
  };

  useEffect(() => {
    fetchSpecialty();
  }, []);

  return (
    <div className="section-specialty">
      <div className="specialty-container">
        <div className="specialty-header">
          <span className="title-section">Chuyên khoa</span>
          <button
            className="btn-section"
            onClick={(e) => {
              e.preventDefault();
              navigate("/specialty-list");
            }}
          >
            Xem thêm
          </button>
        </div>
        <div className="specialty-body">
          <Slider {...settings}>
            {specailty.length > 0 ? (
              specailty.map((specialties, index) => (
                <div
                  className="specialty-customize"
                  key={index}
                  onClick={() => handleToDoctor(specialties.id)}
                >
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/img/doctor/${specialties.id}/${specialties.img}`}
                  />
                  <div className="text-content">{specialties.name}</div>
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

export default Specialty;
