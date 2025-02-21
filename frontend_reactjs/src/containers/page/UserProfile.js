import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserService from "../../services/UserService";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Homeheader from "./header";
import HomeFooter from "./homefooter";
import emitter from "../../utils/emitter";
import UpdateUserModal from "./modalEditUser";

const UserProfile = () => {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchUserInfo = async () => {
    const userID = sessionStorage.getItem("userID");
    if (!userID) {
      console.error("Không tìm thấy ID người dùng");
      return;
    }
    try {
      const response = await UserService.UserProfile(userID);
      if (response.data.errCode === 0) {
        console.log("Thông tin người dùng:", response.data.user);
        setUserInfo(response.data.user);
      } else {
        console.log("Loi lay thong tin");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleConfirmUpdate = async (formData) => {
    try {
      const response = await UserService.EditUser(formData);

      if (response && response.data && response.data.errCode === 0) {
        alert("Cập nhật thành công!");
        await fetchUserInfo();
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

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  useEffect(() => {
    fetchUserInfo();
  }, [id]);

  if (!userInfo) return <p>Đang tải...</p>;

  return (
    <React.Fragment>
      <Homeheader />
      <div className="specialty-page">
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

          <span>Thông tin lịch khám</span>
        </div>

        <div className="booking-container">
          <UpdateUserModal
            isOpen={isEditModalOpen}
            toggle={toggleEditModal}
            currentUser={selectedUser}
            onConfirm={handleConfirmUpdate}
          />
          <h1 className="booking-title">Thông tin cá nhân</h1>
          <div className="user-info">
            <p>
              <strong>Họ và tên:</strong> {userInfo.fullname}
            </p>
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {userInfo.phone}
            </p>
            <p>
              <strong>Giới tính:</strong>{" "}
              {Number(userInfo.gender) === 0 ? "Nam" : "Nữ"}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {userInfo.address}
            </p>
            <p>
              <strong>Năm sinh:</strong> {userInfo.birthYear}
            </p>
          </div>

          <button
            className="abort"
            onClick={() => {
              setSelectedUser(userInfo); // Đặt thông tin user trước khi mở modal
              toggleEditModal();
            }}
          >
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>
      <HomeFooter />
    </React.Fragment>
  );
};

export default UserProfile;
