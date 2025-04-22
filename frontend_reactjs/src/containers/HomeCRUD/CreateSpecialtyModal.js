import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const CreateSpecialtyModal = ({ isOpen, toggle, onConfirm }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Thêm preview ảnh

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(
        file.name // Lưu file chứ không chỉ lưu tên
      );

      setImagePreview(URL.createObjectURL(file)); // Xem trước ảnh
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setImg(null);
    setImagePreview(null);
  };

  const handleSubmit = () => {
    if (!name || !description || !img) {
      alert("Vui lòng điền đầy đủ thông tin và chọn ảnh.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("img", img);

    onConfirm(formData);
    resetForm();
    toggle(); // đóng modal sau khi tạo
  };

  const handleClose = () => {
    resetForm();
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Thêm Chuyên Khoa Mới</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="name">Tên chuyên khoa</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên chuyên khoa"
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Mô tả</Label>
            <Input
              type="textarea"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả"
            />
          </FormGroup>
          <FormGroup>
            <Label for="img">Ảnh chuyên khoa</Label>
            <Input
              type="file"
              id="img"
              accept="image/*"
              onChange={handleFileChange}
            />
          </FormGroup>
          {imagePreview && (
            <FormGroup>
              <img
                src={imagePreview}
                alt="Ảnh xem trước"
                className="img-thumbnail"
                style={{ width: "200px", height: "auto" }}
              />
            </FormGroup>
          )}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Lưu
        </Button>
        <Button color="secondary" onClick={handleClose}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateSpecialtyModal;
