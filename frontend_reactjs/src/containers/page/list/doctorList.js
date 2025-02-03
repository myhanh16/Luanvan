import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./doctorList.css";
import HomeFooter from "../homefooter";
import Homeheader from "../header";
import UserService from "../../../services/UserService";

const DoctorList = () => {
  const [detailSpecialty, setdetailSpecialty] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [doctors, setDoctor] = useState([]);

  //Lay thong tin chuyen khoa theo id
  const fetchSpecialtyByid = async () => {
    try {
      const response = await UserService.getSpecialtyByID(id);
      setdetailSpecialty(response.data.detail);
      console.log(response.data.detail);
    } catch (e) {
      console.log(e);
      setError("Loi: ", e);
    }
  };

  //Lay thong tin bac si theo id chuyen khoa
  const fectDoctorBySpecialtyID = async () => {
    try {
      const response = await UserService.getDoctorsBySpecialtyID(id);
      setDoctor(response.data.doctors);
    } catch (e) {
      console.log(e);
      setError("Loi tai danh sach bac si");
    }
  };

  useEffect(() => {
    fetchSpecialtyByid();
    fectDoctorBySpecialtyID();
  }, [id]);

  return (
    <React.Fragment>
      <Homeheader />
      <div class="specialty-page">
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
        {/* <ul class="doctor-info">
          <li>
            Các chuyên gia có quá trình đào tạo bài bản, nhiều kinh nghiệm
          </li>
          <li>
            Các giáo sư, phó giáo sư đang trực tiếp nghiên cứu và giảng dạy...
          </li>
          <li>Các bác sĩ đã, đang công tác tại các bệnh viện hàng đầu...</li>
        </ul> */}

        {/* <div class="filter">
          <select>
            <option value="all">Toàn quốc</option>
          </select>
        </div> */}

        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div className="doctor-card" key={doctor.id}>
              <img
                src={doctor.imageUrl || "doctor.jpg"}
                alt={doctor.User.fullname}
              />
              <div className="doctor-details">
                <h3>{doctor.User.fullname}</h3>
                {/* <p>Liên lạc: {doctor.User.phone}</p> */}
                <p>Kinh nghiệm: {doctor.experience_years} năm kinh nghiệm</p>
                <p>Giới thiệu: {doctor.description}</p>
                {/* <p>Chuyên khoa: {doctor.specialty}</p> */}
                <p>Phòng khám: {doctor.workroom}</p>
              </div>
              <div className="schedule">
                <h4>Lịch khám</h4>
                <div className="time-slots">
                  <div>09:00 - 09:30</div>
                  <div>09:30 - 10:00</div>
                </div>
                <button className="book-btn">Chọn & Đặt</button>
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
