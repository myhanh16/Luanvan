import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";
import AdminService from "../../services/AdminService";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";
import EditUserModal from "../auth/modalUser";
import emitter from "../../utils/emitter";
import UpdateUserModal from "./modalEdit";
import AdminHeader from "./adminheader";
import UserService from "../../services/UserService";

const Home = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // Lưu trữ người dùng
  const [doctors, setDoctors] = useState([]); // Lưu trữ danh sách bác sĩ
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (!token) {
      navigate("/login-admin");
    } else {
      fetchUsers();
    }
    const listener = emitter.on("USER_ADDED", () => {
      fetchUsers();
    });

    return () => {
      listener.removeAllListeners("USER_ADDED");
    };
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await AdminService.GetAllDoctors();

      setDoctors(response.data.doctors);
      console.log(response.data.doctors);
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng:", err);
      setError("Không thể tải danh sách người dùng.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userToken");
    navigate("/login-admin");
  };

  const handleAddUser = () => {
    setIsCreateModalOpen(true);
  };

  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  const handleConfirmCreate = async (formData) => {
    try {
      const response = await AdminService.CreateUser(formData);
      if (response && response.data && response.data.errCode !== 0) {
        alert("Tạo tài khoản thất bại: " + response.data.message);
      } else {
        alert("Tạo tài khoản thành công.");
        await fetchUsers();
        emitter.emit("USER_ADDED");
        toggleCreateModal();
      }
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      alert("Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (user) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa người dùng này không?"
    );
    if (!confirmDelete) return;

    try {
      const res = await UserService.DeleteUser(user.id);
      if (res && res.data && res.data.errCode === 0) {
        alert("Xóa người dùng thành công");
        await fetchUsers();
      } else {
        alert("Không thể xóa người dùng");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Cập nhật tài khoản
  const handleUpdate = (doctor) => {
    if (!doctor || !doctor.User) {
      console.error("Lỗi: Dữ liệu bác sĩ không hợp lệ", doctor);
      return;
    }

    const selectedDoctor = {
      id: doctor.User.id,
      email: doctor.User.email || "",
      fullname: doctor.User.fullname || "",
      phone: doctor.User.phone || "",
      address: doctor.User.address || "",
      gender: doctor.User.gender || 0,
      isActive: doctor.User.isActive || false,
      specialty: doctor.specialty?.name || "",
      experience_years: doctor.experience_years || 0,
      onlineConsultation: doctor.onlineConsultation || 0,
      img:
        `${process.env.REACT_APP_BACKEND_URL}/img/doctor/${doctor.specialty.id}/${doctor.img}` ||
        0,
    };

    console.log("Dữ liệu cập nhật:", selectedDoctor);
    setSelectedUser(selectedDoctor);
    setIsEditModalOpen(true);
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleConfirmUpdate = async (formData) => {
    try {
      const response = await AdminService.EditDoctor(formData);

      if (response && response.data && response.data.errCode === 0) {
        alert("Cập nhật thành công!");
        await fetchUsers();
        emitter.emit("USER_ADDED");
        toggleEditModal();
      } else {
        alert("Cập nhật không thành công.");
      }
    } catch (e) {
      alert("Có lỗi xảy ra khi cập nhật.");
      console.error(e);
    }
  };

  const handleToggleStatus = async (doctor) => {
    const confirmMessage = doctor.User.isActive
      ? `Bạn có chắc chắn muốn vô hiệu hóa tài khoản của ${doctor.User.fullname}?`
      : `Bạn có chắc chắn muốn kích hoạt lại tài khoản của ${doctor.User.fullname}?`;

    const confirmAction = window.confirm(confirmMessage);
    if (!confirmAction) return;

    try {
      const response = await AdminService.disableDoctorAccount(doctor.User.id);
      if (response && response.data && response.data.errCode === 0) {
        alert(response.data.errMessage);
        fetchUsers(); // Load lại danh sách bác sĩ
      } else if (response.data.errCode === 2) {
        alert(response.data.errMessage);
      } else {
        alert("Cập nhật tài khoản thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  return (
    <React.Fragment>
      <AdminHeader />
      <div>
        <div className="users-container">
          <UpdateUserModal
            isOpen={isEditModalOpen}
            toggle={toggleEditModal}
            currentUser={selectedUser} // Đảm bảo truyền đúng dữ liệu
            onConfirm={handleConfirmUpdate}
          />
          <div className="title text-center" style={{ fontSize: "20px" }}>
            Danh Sách Bác Sĩ
          </div>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="user-table mt-4 mx-3">
            <table id="customers">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Họ Tên</th>
                  <th>Số Điện Thoại</th>
                  <th>Địa chỉ</th>
                  <th>Giới tính</th>
                  <th>Chuyên khoa</th>
                  <th>Phòng làm việc</th>
                  <th>Năm kinh nghiệm</th>
                  <th>Tư vấn trực tuyến</th>
                  {/* <th>Trạng Thái</th> */}
                  <th>Cập nhật hồ sơ</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <tr key={doctor.User.id}>
                      <td>{doctor.User.email}</td>
                      <td>{doctor.User.fullname}</td>
                      <td>{doctor.User.phone}</td>
                      <td>{doctor.User.address}</td>
                      <td>{Number(doctor.User.gender) === 0 ? "Nam" : "Nữ"}</td>

                      <td>{doctor.specialty.name}</td>
                      <td>{doctor.workroom}</td>
                      <td>{doctor.experience_years}</td>
                      <td>
                        {Number(doctor.onlineConsultation) === 0
                          ? "Không"
                          : "Có"}
                      </td>

                      {/* <td>
                        <button
                          className="btn btn-sm"
                          onClick={() => handleToggleStatus(doctor)}
                          style={{
                            backgroundColor: doctor.User.isActive
                              ? "green"
                              : "red",
                            color: "white",
                          }}
                        >
                          {doctor.User.isActive ? (
                            <>
                              <FaUserCheck style={{ marginRight: "5px" }} />{" "}
                              Đang hoạt động
                            </>
                          ) : (
                            <>
                              <FaUserTimes style={{ marginRight: "5px" }} /> Vô
                              hiệu hóa
                            </>
                          )}
                        </button>
                      </td> */}

                      <td>
                        {doctor.User.isActive && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleUpdate(doctor)}
                          >
                            <FaEdit />
                          </button>
                        )}
                      </td>
                      {/* <button
                          className="btn btn-danger btn-sm mx-2"
                          onClick={() => handleDelete(doctor.User)}
                        >
                          <FaTrashAlt />
                        </button> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Không có dữ liệu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
