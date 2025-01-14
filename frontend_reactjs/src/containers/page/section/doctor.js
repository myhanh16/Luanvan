import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./doctor.css";
import img1 from "../../../assets/specialty/co-xuong-khop.png";
import img2 from "../../../assets/specialty/than-kinh.png";
import img3 from "../../../assets/specialty/tieu-hoa.png";
import img4 from "../../../assets/specialty/tim-mach.png";
import img6 from "../../../assets/specialty/cot-song.png";
import img5 from "../../../assets/specialty/tai-mui-hong.png";

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
  const settings = {
    dots: true, //An dau . neu la false
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="section-doctor">
      <div className="doctor-container">
        <div className="doctor-header">
          <span className="title-section">Bác sĩ</span>
          <button className="btn-section">Xem thêm</button>
        </div>
        <div className="specailty-body">
          <Slider {...settings}>
            <div className="doctor-customize">
              <img src={img1} className="doctor-img" />
              <div className="text-content">Bác sĩ 1</div>
              <div className="">Chuyên khoa: Cơ xương khớp</div>
            </div>
            <div className="doctor-customize">
              <img src={img2} className="doctor-img" />
              <div className="text-content">Bác sĩ 2</div>
              <div className="">Chuyên khoa: Cơ xương khớp</div>
            </div>
            <div className="doctor-customize">
              <img src={img3} className="doctor-img" />
              <div className="text-content">Bác sĩ 3</div>
              <div className="">Chuyên khoa: Cơ xương khớp</div>
            </div>
            <div className="doctor-customize">
              <img src={img4} className="doctor-img" />
              <div className="text-content">Bác sĩ 4</div>
              <div className="">Chuyên khoa: Cơ xương khớp</div>
            </div>
            <div className="doctor-customize">
              <img src={img5} className="doctor-img" />
              <div className="text-content">Bác sĩ 5</div>
              <div className="">Chuyên khoa: Cơ xương khớp</div>
            </div>
            <div className="doctor-customize">
              <img src={img6} className="doctor-img" />
              <div className="text-content">Bác sĩ 6</div>
              <div className="">Chuyên khoa: Cơ xương khớp</div>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
