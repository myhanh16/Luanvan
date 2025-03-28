import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FaTimes } from "react-icons/fa";

const UpdateSpecialtyModal = ({
  isOpen,
  toggle,
  currentSpecialty,
  onConfirm,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    img: "",
    newImg: null,
  });

  useEffect(() => {
    if (currentSpecialty) {
      setFormData({
        id: currentSpecialty.id || "",
        name: currentSpecialty.name || "",
        description: currentSpecialty.description || "",
        img: currentSpecialty.img || "",
        newImg: null,
      });
      setImagePreview(currentSpecialty.img ? currentSpecialty.img : null);
    }
  }, [currentSpecialty]);

  const [imagePreview, setImagePreview] = useState(null);

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
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    if (!formData.name || !formData.description) {
      alert("Vui lòng nhập đầy đủ thông tin chuyên khoa.");
      return;
    }
    const updatedData = { ...formData };
    if (formData.newImg) {
      updatedData.img = formData.newImg;
    }
    delete updatedData.newImg;
    onConfirm(updatedData);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="modal-title">Cập Nhật Chuyên Khoa</span>
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
        <form>
          <div className="mb-3">
            <label>Tên Chuyên Khoa</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Mô Tả</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Hình Ảnh</label>
            {imagePreview && (
              <div className="mb-2">
                <img
                  src={imagePreview}
                  alt="Specialty Preview"
                  style={{
                    width: "150px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleConfirm}>
          Cập Nhật
        </Button>
        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateSpecialtyModal;
