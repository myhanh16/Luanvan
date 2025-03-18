import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";
import "./createDoctor.css";
import AdminHeader from "./adminheader";
import AdminService from "../../services/AdminService";
import { useNavigate } from "react-router-dom";
import emitter from "../../utils/emitter";

const DoctorForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",
    phone: "",
    address: "",
    gender: "",
    experience_years: "",
    workroom: "",
    description: "",
    specialty: "1",
    img: null,
  });

  const [imagePreview, setImagePreview] = useState(null); // State to store the image preview URL

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "gender" ? value.toString() : value,
    });
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   setFormData({
  //     ...formData,
  //     img: file.name,
  //   });

  //   setImagePreview(URL.createObjectURL(file));
  // };
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("Form Data:", formData);
  //   const formDataObj = new FormData();
  //   Object.keys(formData).forEach((key) => {
  //     formDataObj.append(key, formData[key]);
  //   });

  //   try {
  //     const response = await AdminService.CreateDoctor(formDataObj);

  //     if (response && response.data && response.data.errCode !== 0) {
  //       alert("Tạo tài khoản thất bại: " + response.data.message);
  //     } else {
  //       alert("Tạo hồ sơ thành công.");

  //       // Phát sự kiện USER_ADDED để reset form
  //       emitter.emit("USER_ADDED", formDataObj);

  //       navigate("/homeadmin"); // Điều hướng về trang đăng nhập sau khi tạo tài khoản

  //       // Reset form và hình ảnh sau khi tạo thành công
  //       setFormData({
  //         email: "",
  //         password: "",
  //         fullname: "",
  //         phone: "",
  //         address: "",
  //         gender: "",
  //         experience_years: "",
  //         workroom: "",
  //         description: "",
  //         specialty: "",
  //         img: null,
  //       });

  //       setImagePreview(null); // Reset hình ảnh preview
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi tạo tài khoản:", error);
  //     alert("Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại.");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data:", formData);

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await AdminService.CreateDoctor(formDataObj); // Gửi request

      if (response && response.data && response.data.errCode !== 0) {
        alert("Tạo tài khoản thất bại: " + response.data.message);
      } else {
        alert("Tạo hồ sơ thành công.");
        navigate("/homeadmin");

        setFormData({
          email: "",
          password: "",
          fullname: "",
          phone: "",
          address: "",
          gender: "",
          experience_years: "",
          workroom: "",
          description: "",
          specialty: "",
          img: null,
          onlineConsultation: "",
        });

        setImagePreview(null);
      }
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      alert("Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại.");
    }
  };

  return (
    <React.Fragment>
      <AdminHeader />
      <div className="doctor-form-container">
        <div className="title text-center" style={{ fontSize: "20px" }}>
          Tạo Hồ Sơ Bác Sĩ
        </div>

        <form onSubmit={handleSubmit}>
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

          {/* Experience Years */}
          <div className="mb-3">
            <label htmlFor="inputexperience_years">Số Năm Kinh Nghiệm</label>
            <input
              type="number"
              className="form-control"
              name="experience_years"
              value={formData.experience_years}
              onChange={handleChange}
              required
            />
          </div>

          {/* Specialty */}
          <div className="mb-3">
            <label htmlFor="inputSpecialty">Chuyên Kkhoa</label>
            <select
              id="inputSpecialty"
              className="form-control"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
            >
              <option value="1">Cơ xương khớp</option>
              <option value="2">Thần kinh</option>
              <option value="3">Tiêu hóa</option>
              <option value="4">Tim mạch</option>
              <option value="5">Tai Mũi Họng</option>
              <option value="6">Cột sống</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="inputDescription">Mô tả</label>
            <input
              type="text"
              className="form-control"
              id="inputDescription"
              placeholder="Nhập mô tả"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Workroom */}
          <div className="mb-3">
            <label htmlFor="inputworkroom">Số phòng Khám</label>
            <input
              type="text"
              name="workroom"
              className="form-control"
              value={formData.workroom}
              onChange={handleChange}
              placeholder="Nhập phòng khám"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-3">
            <label htmlFor="inputimg">Hình Ảnh</label>
            <input
              type="file"
              name="img"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

          {/* Display Image Preview */}
          {imagePreview && (
            <div className="mb-3">
              <img
                src={imagePreview}
                alt="Image Preview"
                className="img-thumbnail"
                style={{ width: "200px", height: "auto" }}
              />
            </div>
          )}

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
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary">
            Tạo Hồ Sơ
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default DoctorForm;
