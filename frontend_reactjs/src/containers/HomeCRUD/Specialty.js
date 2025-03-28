import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";
import AdminService from "../../services/AdminService";
import { FaEdit } from "react-icons/fa";
import UpdateSpecialtyModal from "./modalEditSpecialty";
import AdminHeader from "./adminheader";

const Specialty = () => {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]); // Lưu danh sách chuyên khoa
  const [error, setError] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleUpdate = (specialties) => {
    const selectedSpecialty = {
      id: specialties.id,
      name: specialties.name,
      description: specialties.description,
      img:
        `${process.env.REACT_APP_BACKEND_URL}/img/doctor/${specialties.id}/${specialties.img}` ||
        0,
    };

    console.log("Dữ liệu cập nhật:", selectedSpecialty);
    setSelectedSpecialty(selectedSpecialty);
    setIsEditModalOpen(true);
  };

  //   const handleUpdate = (specialty) => {
  //     setSelectedSpecialty(specialty);
  //     setIsEditModalOpen(true);
  //   };

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

  return (
    <>
      <AdminHeader />
      <div className="users-container">
        <UpdateSpecialtyModal
          isOpen={isEditModalOpen}
          toggle={toggleEditModal}
          currentSpecialty={selectedSpecialty} // Truyền đúng dữ liệu chuyên khoa
          onConfirm={handleConfirmUpdate}
        />

        <div className="title text-center" style={{ fontSize: "20px" }}>
          Danh Sách Chuyên Khoa
        </div>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="user-table mt-4 mx-3">
          <table id="customers">
            <thead>
              <tr>
                <th>Tên chuyên khoa</th>
                <th>Mô tả</th>
                {/* <th>Hình ảnh</th> */}
                <th>Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {specialties.length > 0 ? (
                specialties.map((specialty) => (
                  <tr key={specialty.id}>
                    <td>{specialty.name}</td>
                    <td>{specialty.description}</td>
                    {/* <td>
                      {specialty.img ? (
                        <img
                          src={`${process.env.REACT_APP_BACKEND_URL}/img/specialty/${specialty.id}/${specialty.img}`}
                          alt={specialty.name}
                          style={{ width: "100px", height: "60px" }}
                        />
                      ) : (
                        "Không có ảnh"
                      )}
                    </td> */}
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleUpdate(specialty)}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Không có dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Specialty;
