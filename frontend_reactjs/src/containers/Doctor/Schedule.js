import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import emitter from "../../utils/emitter";
import DoctorHeader from "./DoctorHeader";
import UserService from "../../services/UserService";
import DoctorService from "../../services/DoctorService";

const Schedule = () => {
  const navigate = useNavigate();
  const [workSchedules, setWorkSchedules] = useState([]);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleFetchWorkSchedule = async () => {
    const doctorID = sessionStorage.getItem("doctorID");
    if (!doctorID) {
      console.log("Không tìm thấy doctorID");
      return;
    }
    try {
      const response = await DoctorService.handlegetScheduleBydoctorID(
        doctorID
      );
      if (response.data.errCode === 0) {
        setWorkSchedules(response.data.schedule);
      }
    } catch (error) {
      console.log(error);
      setError("Lỗi khi tải dữ liệu lịch làm việc");
    }
  };

  useEffect(() => {
    handleFetchWorkSchedule();
    const listener = emitter.on("WorkSchedule", () => {
      handleFetchWorkSchedule();
    });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Không có ngày";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Lọc lịch làm việc theo ngày được chọn
  const filteredWorkSchedules = selectedDate
    ? workSchedules.filter((schedule) => schedule.date === selectedDate)
    : [];

  return (
    <React.Fragment>
      <DoctorHeader />
      <div className="container mt-4">
        <h3 className="text-center">Lịch Làm Việc Của Bạn</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Bộ lọc chọn ngày */}
        <div className="text-center my-3">
          <input
            type="date"
            className="form-control w-25 d-inline-block mx-2"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button
            className="btn btn-secondary"
            onClick={() => setSelectedDate("")}
          >
            Xóa Lọc
          </button>
        </div>

        <div className="text-center">
          {filteredWorkSchedules.length > 0 ? (
            <div className="d-flex flex-wrap justify-content-center">
              {filteredWorkSchedules.map((schedule, index) => (
                <button key={index} className="btn btn-outline-primary m-2">
                  {schedule.Time.starttime} - {schedule.Time.endtime}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center">Không có lịch làm việc cho ngày này.</p>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Schedule;
