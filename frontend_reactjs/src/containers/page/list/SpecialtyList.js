import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SpecialtyList.css";
import Homeheader from "../header";
import HomeFooter from "../homefooter";
import UserService from "../../../services/UserService";
import img1 from "../../../assets/specialty/co-xuong-khop.png";
import img2 from "../../../assets/specialty/than-kinh.png";
import img3 from "../../../assets/specialty/tieu-hoa.png";
import img4 from "../../../assets/specialty/tim-mach.png";
import img5 from "../../../assets/specialty/tai-mui-hong.png";
import img6 from "../../../assets/specialty/cot-song.png";

const imageMapping = {
  "Cơ xương khớp": img1,
  "Thần kinh": img2,
  "Tiêu hóa": img3,
  "Tim mạch": img4,
  "Tai Mũi Họng": img5,
  "Cột sống": img6,
};

const SpecialtyList = () => {
  const [specialties, setSpecialties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecialty = async () => {
      try {
        const response = await UserService.GetAllSpecialty();
        setSpecialties(response.data.specialty);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };
    fetchSpecialty();
  }, []);

  const handleToDoctor = (specialtyId) => {
    navigate(`/doctor/${specialtyId}`);
  };

  return (
    <React.Fragment>
      <Homeheader />
      <div className="specialty-page">
        <div className="specialty-grid-container">
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
            <span>Khám chuyên khoa</span>
          </div>
          <div className="specialty-grid">
            {specialties.length > 0 ? (
              specialties.map((specialty) => (
                <div
                  key={specialty.id}
                  className="specialty-item"
                  onClick={() => handleToDoctor(specialty.id)}
                >
                  <img
                    src={imageMapping[specialty.name] || img1}
                    alt={specialty.name}
                  />
                  <p>{specialty.name}</p>
                </div>
              ))
            ) : (
              <p className="no-data">Không có dữ liệu</p>
            )}
          </div>
        </div>
      </div>
      <HomeFooter />
    </React.Fragment>
  );
};

export default SpecialtyList;
