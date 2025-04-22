import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";
import AdminService from "../../services/AdminService";
import { FaEdit } from "react-icons/fa";
import UpdateUserModal from "./modalEdit";
import AdminHeader from "./adminheader";
import emitter from "../../utils/emitter";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const Home = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hoveredDoctorId, setHoveredDoctorId] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (!token) navigate("/login-admin");
    else fetchUsers();

    const listener = emitter.on("USER_ADDED", fetchUsers);
    return () => listener.removeAllListeners("USER_ADDED");
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const res = await AdminService.GetAllDoctors();
      setDoctors(res.data.doctors);
    } catch {
      setError("Không thể tải danh sách người dùng.");
    }
  };

  const handleUpdate = (d) => {
    if (!d || !d.User) return;
    setSelectedUser({
      id: d.User.id,
      email: d.User.email || "",
      fullname: d.User.fullname || "",
      phone: d.User.phone || "",
      address: d.User.address || "",
      gender: d.User.gender || 0,
      isActive: d.User.isActive || false,
      specialty: d.specialty?.name || "",
      experience_years: d.experience_years || 0,
      onlineConsultation: d.onlineConsultation || 0,
      img:
        `${process.env.REACT_APP_BACKEND_URL}/img/doctor/${d.specialty.id}/${d.img}` ||
        "",
    });
    setIsEditModalOpen(true);
  };

  const toggleEditModal = () => setIsEditModalOpen(!isEditModalOpen);

  const handleConfirmUpdate = async (formData) => {
    try {
      const res = await AdminService.EditDoctor(formData);
      if (res.data.errCode === 0) {
        alert("Cập nhật thành công!");
        fetchUsers();
        emitter.emit("USER_ADDED");
        toggleEditModal();
      } else alert("Cập nhật không thành công.");
    } catch {
      alert("Có lỗi xảy ra khi cập nhật.");
    }
  };

  const handleSearch = async (name) => {
    try {
      const response = await AdminService.handleSearchDoctor(name);
      if (response.data.errCode === 0) {
        setDoctors(response.data.data);
      } else {
        setDoctors([]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <>
      <AdminHeader />
      <div className="container mt-4">
        <h2 className="text-center">Danh Sách Bác Sĩ</h2>

        <UpdateUserModal
          isOpen={isEditModalOpen}
          toggle={toggleEditModal}
          currentUser={selectedUser}
          onConfirm={handleConfirmUpdate}
        />

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="grid-container">
          <Slider {...settings}>
            {doctors.length > 0 ? (
              doctors.map((doc) => (
                <div className="doctor-card-01" key={doc.User.id}>
                  <div className="card-header">
                    <img
                      className="img-doctor"
                      src={`${process.env.REACT_APP_BACKEND_URL}/img/doctor/${doc.specialty.id}/${doc.img}`}
                      alt={doc.User.fullname}
                      onMouseEnter={() => setHoveredDoctorId(doc.User.id)}
                      onMouseLeave={() => setHoveredDoctorId(null)}
                    />
                    <h5
                      className="doctor-name"
                      onMouseEnter={() => setHoveredDoctorId(doc.User.id)}
                      onMouseLeave={() => setHoveredDoctorId(null)}
                    >
                      {doc.User.fullname}
                    </h5>
                    <button
                      className="btn btn-sm btn-primary edit-btn"
                      onClick={() => handleUpdate(doc)}
                    >
                      <FaEdit /> Cập nhật
                    </button>
                  </div>

                  {hoveredDoctorId === doc.User.id && (
                    <div className="doctor-info-tooltip">
                      <p>
                        <strong>Điện thoại:</strong> {doc.User.phone}
                      </p>
                      <p>
                        <strong>Địa chỉ:</strong> {doc.User.address}
                      </p>
                      <p>
                        <strong>Chuyên khoa:</strong> {doc.specialty?.name}
                      </p>
                      <p>
                        <strong>Kinh nghiệm:</strong> {doc.experience_years} năm
                      </p>
                      <p>
                        <strong>Mô tả:</strong> {doc.description}
                      </p>
                      <p>
                        <strong>Tư vấn online:</strong>{" "}
                        {doc.onlineConsultation ? "Có" : "Không"}
                      </p>
                      <p>
                        <strong>Trạng thái hoạt động:</strong>{" "}
                        <span
                          className={
                            Number(doc.User.isActive) === 0
                              ? "text-danger"
                              : "text-success"
                          }
                        >
                          {Number(doc.User.isActive) === 0
                            ? "Không hoạt động"
                            : "Đang hoạt động"}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center w-100">Không có dữ liệu.</div>
            )}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default Home;
