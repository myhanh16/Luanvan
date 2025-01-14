import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FaTimes } from "react-icons/fa";

const UpdateUserModal = ({ isOpen, toggle, currentUser, onConfirm }) => {
  const [formData, setFormData] = useState({
    id: "",
    fullname: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        id: currentUser.id || "",
        fullname: currentUser.fullname || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    if (checkInput()) {
      console.log("Dữ liệu form được gửi:", formData);
      onConfirm(formData); // Truyền formData gồm cả id
    }
  };

  const checkInput = () => {
    const requiredFields = ["fullname", "phone", "address"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Hãy nhập: ${field}`);
        return false;
      }
    }
    return true;
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="modal-title">Cập Nhật Tài Khoản</span>
        <FaTimes
          onClick={toggle}
          className="close-icon"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            cursor: "pointer",
            textAlign: "center",
          }}
        />
      </ModalHeader>
      <ModalBody>
        <form>
          <div className="mb-3">
            <label>Họ Tên</label>
            <input
              type="text"
              className="form-control"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Số Điện Thoại</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Địa Chỉ</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleConfirm}>
          Cập Nhật Tài Khoản
        </Button>
        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateUserModal;
