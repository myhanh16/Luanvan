import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FaTimes } from "react-icons/fa";

const UpdateUserModal = ({ isOpen, toggle, currentUser, onConfirm }) => {
  const [formData, setFormData] = useState({
    id: "",
    fullname: "",
    phone: "",
    address: "",
    userID: "",
    experience_years: "",
    onlineConsultation: "",
    img: "",
    newImg: null,
  });

  useEffect(() => {
    if (currentUser) {
      console.log("Dữ liệu currentUser:", currentUser);
      setFormData({
        id: currentUser.id || "",
        fullname: currentUser.fullname || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        userID: currentUser.id || "",
        // experience_years: currentUser.experience_years || "",
        experience_years: currentUser.experience_years
          ? Number(currentUser.experience_years)
          : 0,

        onlineConsultation: Number(currentUser.onlineConsultation) || 0, // Đảm bảo là kiểu số
        img: currentUser.img || "",

        newImg: null,
      });
      setImagePreview(currentUser.img ? currentUser.img : null);
    }
  }, [currentUser]);

  const [imagePreview, setImagePreview] = useState(null); // State to store the image preview URL

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        img: file.name, // Lưu file chứ không chỉ lưu tên
      });

      setImagePreview(URL.createObjectURL(file)); // Xem trước ảnh
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      // [name]: value,
      [name]: name === "onlineConsultation" ? Number(value) : value, // Ép kiểu thành số,
      // [name]: name === "experience_years" ? Number(value) : value, // Ép kiểu số
    }));
  };

  const handleConfirm = () => {
    console.log("Dữ liệu form được gửi:", formData);
    if (checkInput()) {
      // onConfirm(formData); // Truyền formData gồm cả id
      const updatedData = { ...formData };
      if (formData.newImg) {
        updatedData.img = formData.newImg; // Chỉ cập nhật nếu có ảnh mới
      }
      delete updatedData.newImg; // Xóa trường tạm
      onConfirm(updatedData);
    }
  };

  const checkInput = () => {
    const requiredFields = ["fullname", "phone", "address", "experience_years"];
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
          <div className="mb-3">
            <label>Năm Kinh Nghiệm</label>
            <input
              type="number"
              className="form-control"
              name="experience_years"
              value={formData.experience_years}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="inputonlineConsultation">Tư vấn trực tuyến</label>
            <select
              id="inputonlineConsultation"
              className="form-control"
              name="onlineConsultation"
              value={formData.onlineConsultation}
              onChange={handleChange}
            >
              <option value="0" defaultValue>
                Tư vấn tại sơ sở
              </option>
              <option value="1">Tư vấn trực tuyến</option>
            </select>
            {formData.img && !formData.newImg && (
              <div className="mt-2">
                <label>Ảnh hiện tại:</label>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Doctor Avatar"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                ) : formData.img ? (
                  <img
                    src={formData.img}
                    alt="Doctor Avatar"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <p>Chưa tải ảnh...</p>
                )}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="inputimg">Hình Ảnh</label>
              <input
                type="file"
                name="img"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
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
