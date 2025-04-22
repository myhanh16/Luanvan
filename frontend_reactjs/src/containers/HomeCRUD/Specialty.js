import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./specialty.css";
import AdminService from "../../services/AdminService";
import { FaEdit, FaPlus } from "react-icons/fa";
import UpdateSpecialtyModal from "./modalEditSpecialty";
import AdminHeader from "./adminheader";
import Slider from "react-slick";
import CreateSpecialtyModal from "./CreateSpecialtyModal";

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
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [error, setError] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hoveredSpecialtyId, setHoveredSpecialtyId] = useState(null); // Chỉnh lại state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (!token) {
      navigate("/login-admin");
    } else {
      fetchSpecialties();
    }
  }, [navigate]);

  const fetchSpecialties = async () => {
    try {
      const response = await AdminService.handlegetSpecialty();
      setSpecialties(response.data.specialty || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách chuyên khoa:", err);
      setError("Không thể tải danh sách chuyên khoa.");
    }
  };

  const handleUpdate = (specialty) => {
    const selectedSpecialty = {
      id: specialty.id,
      name: specialty.name,
      description: specialty.description,
      img:
        `${process.env.REACT_APP_BACKEND_URL}/img/doctor/${specialty.id}/${specialty.img}` ||
        0,
    };
    setSelectedSpecialty(selectedSpecialty);
    setIsEditModalOpen(true);
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleConfirmUpdate = async (formData) => {
    try {
      const response = await AdminService.handleEditSpecialty(formData);
      if (response?.data?.errCode === 0) {
        alert("Cập nhật thành công!");
        await fetchSpecialties();
        toggleEditModal();
      } else {
        alert("Cập nhật không thành công.");
      }
    } catch (e) {
      alert("Có lỗi xảy ra khi cập nhật.");
      console.error(e);
    }
  };

  const handleMouseEnter = useCallback((specialtyId) => {
    setHoveredSpecialtyId(specialtyId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredSpecialtyId(null);
  }, []);

  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  // const handleConfirmCreate = async (formData) => {
  //   try {
  //     const response = await AdminService.handleCreateSpecialty(formData);
  //     if (response?.data?.errCode === 0) {
  //       alert("Thêm chuyên khoa thành công!");
  //       await fetchSpecialties();
  //       toggleCreateModal();
  //     } else {
  //       alert("Thêm chuyên khoa không thành công.");
  //     }
  //   } catch (e) {
  //     alert("Có lỗi xảy ra khi thêm chuyên khoa.");
  //     console.error(e);
  //   }
  // };

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
        <h2 className="text-center">Danh Sách Chuyên Khoa</h2>
        {/* <div className="text-end mb-3">
          <button className="btn btn-success" onClick={toggleCreateModal}>
            <FaPlus /> Thêm Chuyên Khoa
          </button>
        </div> */}

        {/* <CreateSpecialtyModal
          isOpen={isCreateModalOpen}
          toggle={toggleCreateModal}
          onConfirm={handleConfirmCreate}
        /> */}

        <UpdateSpecialtyModal
          isOpen={isEditModalOpen}
          toggle={toggleEditModal}
          currentSpecialty={selectedSpecialty}
          onConfirm={handleConfirmUpdate}
        />

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="grid-container">
          <Slider {...settings}>
            {specialties.length > 0 ? (
              specialties.map((specialty) => (
                <div className="doctor-card-01" key={specialty.id}>
                  <div className="card-header">
                    <img
                      className="img-doctor"
                      src={`${process.env.REACT_APP_BACKEND_URL}/img/doctor/${specialty.id}/${specialty.img}`}
                      alt={specialty.name}
                      onMouseEnter={() => handleMouseEnter(specialty.id)}
                      onMouseLeave={handleMouseLeave}
                    />
                    <h5
                      className="doctor-name"
                      onMouseEnter={() => handleMouseEnter(specialty.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {specialty.name}
                    </h5>
                    <button
                      className="btn btn-sm btn-primary edit-btn"
                      onClick={() => handleUpdate(specialty)}
                    >
                      <FaEdit /> Cập nhật
                    </button>
                  </div>

                  {hoveredSpecialtyId === specialty.id && (
                    <div className="doctor-info-tooltip">
                      <p>
                        <strong>Mô tả:</strong> {specialty.description}
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

export default Specialty;
