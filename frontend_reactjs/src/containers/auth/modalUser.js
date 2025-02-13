import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FaTimes } from "react-icons/fa";
import emitter from "../../utils/emitter";
import "./login.css";

const RegisterUserModal = ({ isOpen, toggle, title, children, onConfirm }) => {
  const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => 1900 + i
  ).reverse(); // Tạo danh sách năm từ 1900 đến hiện tại

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",
    phone: "",
    address: "",
    gender: "0",
    birthYear: currentYear.toString(), // Mặc định là năm hiện tại
  });

  useEffect(() => {
    const resetForm = () => {
      setFormData({
        email: "",
        password: "",
        fullname: "",
        phone: "",
        address: "",
        gender: "0",
        birthYear: currentYear.toString(),
      });
    };

    emitter.on("USER_ADDED", resetForm);
    return () => {
      emitter.off("USER_ADDED", resetForm);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleComfirm = () => {
    if (checkInput()) {
      console.log("Dữ liệu form được gửi:", formData);
      onConfirm(formData);
    }
  };

  const checkInput = () => {
    let isValid = true;
    const arr = [
      "email",
      "password",
      "fullname",
      "phone",
      "address",
      "gender",
      "birthYear",
    ];
    for (let i = 0; i < arr.length; i++) {
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
          }}
        />
      </ModalHeader>
      <ModalBody>
        <p
          style={{
            fontWeight: "bold",
            color: "#d9534f",
            fontSize: "16px",
            backgroundColor: "#f8d7da",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #f5c6cb",
            marginBottom: "20px",
          }}
        >
          LƯU Ý: Thông tin anh/chị cung cấp sẽ được sử dụng làm hồ sơ khám bệnh.
          Điền đầy đủ, đúng và vui lòng kiểm tra lại thông tin trước khi ấn "Tạo
          tài khoản"
        </p>
        <form>
          <div className="row">
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

          <div className="mb-3">
            <label htmlFor="inputGender">Giới Tính</label>
            <select
              id="inputGender"
              className="form-control"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="0">Nam</option>
              <option value="1">Nữ</option>
            </select>
          </div>

          {/* Lựa chọn năm sinh */}
          <div className="mb-3">
            <label htmlFor="inputBirthYear">Năm Sinh</label>
            <select
              id="inputBirthYear"
              className="form-control"
              name="birthYear"
              value={formData.birthYear}
              onChange={handleChange}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
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

export default RegisterUserModal;
