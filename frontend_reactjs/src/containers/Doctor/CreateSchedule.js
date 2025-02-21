import React, { useEffect, useState } from "react";
import DoctorHeader from "./DoctorHeader";
import DoctorService from "../../services/DoctorService";
import "./CreateSchedule.css";

const CreateSchedules = () => {
  const [times, setTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimes, setSelectedTimes] = useState([]); // Cho phép chọn nhiều khung giờ

  const fetchTimeSlots = async () => {
    try {
      const response = await DoctorService.handleGetAllTimeSlot();
      if (response.data.errCode === 0) {
        setTimes(response.data.data);
      }
    } catch (e) {
      console.error("Lỗi khi tải dữ liệu:", e);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time.id)
        ? prev.filter((t) => t !== time.id)
        : [...prev, time.id]
    );
  };

  const handleSubmit = async () => {
    if (!selectedDate || selectedTimes.length === 0) {
      alert("Vui lòng chọn ngày và ít nhất một khung giờ!");
      return;
    }
    try {
      const doctorID = sessionStorage.getItem("doctorID");
      console.log("Dữ liệu gửi lên:", {
        doctorID,
        date: selectedDate,
        timeID: selectedTimes,
      });

      const response = await DoctorService.handleCreateSchedules({
        doctorID,
        date: selectedDate,
        timeID: selectedTimes,
      });

      if (response.data.errCode === 0) {
        alert("Lịch làm việc đã được lưu!");
        setSelectedTimes([]);
      } else {
        alert("Lỗi khi lưu lịch làm việc!");
      }
    } catch (e) {
      console.error("Lỗi server:", e);
    }
  };

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  return (
    <React.Fragment>
      <DoctorHeader />
      <div className="container-schedule">
        <h2>Tạo lịch làm việc cá nhân</h2>

        <label>Chọn ngày:</label>
        <input
          type="date"
          value={selectedDate}
          min={
            new Date(new Date().setDate(new Date().getDate() + 1))
              .toISOString()
              .split("T")[0]
          }
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <div className="section-title">Chọn thời gian làm việc: </div>

        <div className="time-buttons">
          {times.map((time) => (
            <button
              key={time.id}
              className={`time-btn ${
                selectedTimes.includes(time.id) ? "selected" : ""
              }`}
              onClick={() => handleTimeSelect(time)}
            >
              {time.starttime} - {time.endtime}
            </button>
          ))}
        </div>

        <button className="submit" onClick={handleSubmit}>
          Lưu lịch làm việc
        </button>
      </div>
    </React.Fragment>
  );
};

export default CreateSchedules;
