import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FaTimes } from "react-icons/fa";
import emitter from "../../utils/emitter";
import "./login.css";
const EditUserModal = ({ isOpen, toggle, title, children, onConfirm }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",
    phone: "",
    address: "",
    gender: "0",
  });

  // Reset form khi nhận được sự kiện USER_ADDED
  useEffect(() => {
    const resetForm = () => {
      setFormData({
        email: "",
        password: "",
        fullname: "",
        phone: "",
        address: "",
        gender: "0",
      });
    };

    emitter.on("USER_ADDED", resetForm);

    return () => {
      emitter.off("USER_ADDED", resetForm); // Cleanup listener khi component unmount
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(`Đang thay đổi trường: ${name}, Giá trị: ${value}`); // Debug

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const handleComfirm = () => {
  //   console.log("Dữ liệu form được gửi:", formData);
  //   onConfirm(formData); // Gửi formData tới Home
  // };
  const handleComfirm = () => {
    if (checkInput()) {
      console.log("Dữ liệu form được gửi:", formData);
      onConfirm(formData); // Gửi formData tới Home
    }
  };

  const checkInput = () => {
    let isValid = true;
    const arr = ["email", "password", "fullname", "phone", "address", "gender"];
    for (let i = 0; i < arr.length; i++) {
      console.log("check", arr[i]);
      if (!formData[arr[i]]) {
        isValid = false;
        alert("Hãy Nhập: " + arr[i]);
        break;
      }
    }
    return isValid;
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="lg"
      centered
      className="registerModal"
    >
      <ModalHeader toggle={toggle}>
        <span className="modal-title">Tạo Tài Khoản</span>
        <FaTimes
          onClick={toggle}
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
        <form>
          <div className="row">
            {/* Email */}
            <div className="col-md-6 mb-3">
              <label htmlFor="inputEmail">Email</label>
              <input
                type="email"
                className="form-control"
                id="inputEmail"
                placeholder="Nhập email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="col-md-6 mb-3">
              <label htmlFor="inputPassword">Mật Khẩu</label>
              <input
                type="password"
                className="form-control"
                id="inputPassword"
                placeholder="Nhập mật khẩu"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="mb-3">
            <label htmlFor="inputFullname">Họ Tên</label>
            <input
              type="text"
              className="form-control"
              id="inputFullname"
              placeholder="Nhập họ tên"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
            />
          </div>

          {/* Phone Number */}
          <div className="mb-3">
            <label htmlFor="inputPhone">Số Điện Thoại</label>
            <input
              type="text"
              className="form-control"
              id="inputPhone"
              placeholder="Nhập số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <div className="mb-3">
            <label htmlFor="inputAddress">Địa Chỉ</label>
            <input
              type="text"
              className="form-control"
              id="inputAddress"
              placeholder="Nhập địa chỉ"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Gender */}
          <div className="mb-3">
            <label htmlFor="inputGender">Giới Tính</label>
            <select
              id="inputGender"
              className="form-control"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="0" defaultValue>
                Nam
              </option>
              <option value="1">Nữ</option>
            </select>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleComfirm}>
          Tạo Tài Khoản
        </Button>

        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditUserModal;
