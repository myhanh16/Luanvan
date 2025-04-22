import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FaTimes } from "react-icons/fa";
// Import CSS để sử dụng các lớp như form-control

const ChangePasswordModal = ({ isOpen, toggle, onConfirm }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu mới có khớp không
    if (newPassword !== confirmNewPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    // Gửi dữ liệu qua prop onConfirm
    onConfirm({ oldPassword, newPassword });
  };

  const handleClose = () => {
    // Reset form khi đóng modal
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setError("");
    toggle();
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleClose}
      size="lg"
      centered
      className="registerModal"
    >
      <ModalHeader toggle={handleClose}>
        <span className="modal-title">Đổi Mật Khẩu</span>
        <FaTimes
          onClick={handleClose}
          className="close-icon"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            cursor: "pointer",
            textAlign: "center",
            display: "block",
            visibility: "visible",
          }}
        />
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          {/* Old Password */}
          <div className="mb-3">
            <label htmlFor="inputOldPassword">Mật khẩu cũ</label>
            <input
              type="password"
              className="form-control"
              id="inputOldPassword"
              placeholder="Nhập mật khẩu cũ"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label htmlFor="inputNewPassword">Mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              id="inputNewPassword"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm New Password */}
          <div className="mb-3">
            <label htmlFor="inputConfirmNewPassword">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              className="form-control"
              id="inputConfirmNewPassword"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Hiển thị lỗi nếu có */}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </ModalBody>
      <ModalFooter>
        <Button type="submit" color="primary" onClick={handleSubmit}>
          Xác nhận
        </Button>
        <Button color="secondary" onClick={handleClose}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ChangePasswordModal;
