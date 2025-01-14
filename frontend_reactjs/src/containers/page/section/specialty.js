import React from "react";
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

const Specialty = () => {
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
    <div className="section-specialty">
      <div className="specialty-container">
        <div className="specialty-header">
          <span className="title-section">Chuyên khoa</span>
          <button className="btn-section">Xem thêm</button>
        </div>
        <div className="specailty-body">
          <Slider {...settings}>
            <div className="specialty-customize">
              <img src={img1} />
              <div className="text-content">Cơ xương khớp</div>
            </div>
            <div className="specialty-customize">
              <img src={img2} />
              <div className="text-content">Thần kinh</div>
            </div>
            <div className="specialty-customize">
              <img src={img3} />
              <div className="text-content">Tiêu hóa</div>
            </div>
            <div className="specialty-customize">
              <img src={img4} />
              <div className="text-content">Tim mạch</div>
            </div>
            <div className="specialty-customize">
              <img src={img5} />
              <div className="text-content">Tai Mũi Họng</div>
            </div>
            <div className="specialty-customize">
              <img src={img6} />
              <div className="text-content">Cột sống</div>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Specialty;
