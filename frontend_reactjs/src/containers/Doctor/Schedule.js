import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import emitter from "../../utils/emitter";
import DoctorHeader from "./DoctorHeader";
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

  // Tính toán 7 ngày tiếp theo từ ngày được chọn (hoặc từ ngày mai nếu chưa chọn)
  const calculateNext7Days = () => {
    const start = selectedDate ? new Date(selectedDate) : new Date();
    if (!selectedDate) start.setDate(start.getDate()); // Nếu chưa chọn, bắt đầu từ ngày hom nay

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
    });
  };

  const displayedDates = calculateNext7Days();

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

        {/* Bảng lịch làm việc */}
        <table className="table table-bordered text-center">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Khung Giờ</th>
            </tr>
          </thead>
          <tbody>
            {displayedDates.map((date) => {
              const schedulesForDate = workSchedules.filter(
                (schedule) => schedule.date === date
              );
              return (
                <tr key={date}>
                  <td>{formatDate(date)}</td>
                  <td>
                    {schedulesForDate.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {schedulesForDate.map((schedule, index) => (
                          <li
                            key={index}
                            className="btn btn-outline-primary m-1"
                          >
                            {schedule.Time.starttime} - {schedule.Time.endtime}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted">Không có lịch</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default Schedule;
