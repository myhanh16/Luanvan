const session = require("express-session");
const { format } = require("date-fns");
const { vi, el, ca } = require("date-fns/locale");
const crypto = require("crypto");
const db = require("../models");
// const { getUserbyID } = require("../controllers/CRUDController");
const { where } = require("sequelize");
const { resolve } = require("path");
const { rejects } = require("assert");
const nodemailer = require("nodemailer");

// const GetAppointmentByDoctorID = (doctorID) => {
//   return new Promise(async (resolve, reject) => {
//     if (!doctorID) {
//       return resolve({
//         errCode: 3,
//         errMessage: "Thiếu thông tin bắt buộc (doctorID)",
//       });
//     }

//     try {
//       const bookings = await db.booking.findAll({
//         include: [
//           {
//             model: db.User, // Lấy thông tin bệnh nhân từ bảng User
//             as: "User",
//             attributes: [
//               "id",
//               "fullname",
//               "email",
//               "phone",
//               "address",
//               "gender",
//               "birthYear",
//             ],
//           },
//           {
//             model: db.schedules,
//             as: "schedules",
//             where: { doctorID: doctorID }, // Lọc theo bác sĩ
//             include: [
//               {
//                 model: db.time,
//                 as: "Time",
//                 attributes: ["starttime", "endtime"],
//               },
//               {
//                 model: db.doctor,
//                 as: "Doctor",
//                 attributes: ["id"],
//               },
//             ],
//             attributes: ["id", "timeID", "date"],
//           },
//           {
//             model: db.status,
//             as: "status",
//             attributes: ["id", "name"],
//           },
//         ],
//         attributes: ["id", "booking_date", "statusID"],
//         order: [
//           ["booking_date", "DESC"], // Sắp xếp theo ngày đặt lịch
//           [{ model: db.schedules, as: "schedules" }, "date", "DESC"], // Sắp xếp theo ngày khám
//           [
//             { model: db.schedules, as: "schedules" },
//             { model: db.time, as: "Time" },
//             "starttime",
//             "ASC",
//           ],
//         ],
//       });

//       resolve(bookings);
//     } catch (e) {
//       console.error("Lỗi trong GetAppointmentsByDoctor:", e);
//       reject({ errCode: 500, errMessage: "Lỗi truy vấn dữ liệu" });
//     }
//   });
// };

const GetAppointmentByDoctorID = (doctorID) => {
  return new Promise(async (resolve, reject) => {
    if (!doctorID) {
      return resolve({
        errCode: 3,
        errMessage: "Thiếu thông tin bắt buộc (doctorID)",
      });
    }

    try {
      const bookings = await db.booking.findAll({
        include: [
          {
            model: db.User, // Lấy thông tin bệnh nhân
            as: "User",
            attributes: [
              "id",
              "fullname",
              "email",
              "phone",
              "address",
              "gender",
              "birthYear",
            ],
          },
          {
            model: db.schedules,
            as: "schedules",
            where: { doctorID: doctorID }, // Lọc theo bác sĩ
            include: [
              {
                model: db.time,
                as: "Time",
                attributes: ["starttime", "endtime"],
              },
              {
                model: db.doctor,
                as: "Doctor",
                attributes: ["id", "onlineConsultation"],
              },
            ],
            attributes: ["id", "timeID", "date", "meetlink"],
          },
          {
            model: db.status,
            as: "status",
            attributes: ["id", "name"],
          },
          {
            model: db.medicalrecords, // Lấy hồ sơ bệnh án từ bảng booking
            as: "medicalrecords",
            attributes: ["id", "diagnosis", "treatment", "create_at"],
            order: [["create_at", "DESC"]], // Lấy hồ sơ gần nhất
          },
        ],
        attributes: ["id", "booking_date", "statusID"],
        order: [
          ["booking_date", "ASC"], // Sắp xếp theo ngày đặt lịch
          [{ model: db.schedules, as: "schedules" }, "date", "DESC"], // Sắp xếp theo ngày khám
          [
            { model: db.schedules, as: "schedules" },
            { model: db.time, as: "Time" },
            "starttime",
            "ASC",
          ],
        ],
      });

      resolve(bookings);
    } catch (e) {
      console.error("Lỗi trong GetAppointmentsByDoctor:", e);
      reject({ errCode: 500, errMessage: "Lỗi truy vấn dữ liệu" });
    }
  });
};

const CreateMedicalRecord = async (bookingID, diagnosis, treatment) => {
  return new Promise(async (resolve, reject) => {
    // if (!bookingID || !diagnosis || !treatment) {
    //   return reject({
    //     errCode: 3,
    //     errMessage:
    //       "Thiếu thông tin bắt buộc (bookingID, diagnosis, treatment)",
    //   });
    // }

    try {
      const booking = await db.booking.findOne({
        where: { id: bookingID },
        include: [
          {
            model: db.User,
            as: "User",
            attributes: [
              "id",
              "email",
              "fullname",
              "password",
              "phone",
              "address",
              "gender",
              "birthYear",
            ],
          },
          {
            model: db.schedules,
            as: "schedules",
            include: [
              {
                model: db.time,
                as: "Time",
                attributes: ["starttime", "endtime"],
              },
            ],
            attributes: ["date"],
          },
        ],
      });

      if (!booking) {
        return reject({
          errCode: 2,
          errMessage: "Không tìm thấy đặt lịch",
        });
      }
      // Tạo mới hồ sơ bệnh án
      const newMedicalRecord = await db.medicalrecords.create({
        bookingID, // Liên kết với bookingID
        diagnosis, // Chẩn đoán
        treatment, // Phương pháp điều trị
        create_at: new Date(), // Ngày tạo hồ sơ bệnh án
      });

      // Cập nhật trạng thái đặt lịch thành "Hoàn thành"
      await db.booking.update(
        {
          statusID: 2,
        },
        {
          where: { id: bookingID },
        }
      );

      //Lấy thông tin User
      const patientName = booking.User.fullname;
      const patientEmail = booking.User.email;
      const appointmentDate = booking.schedules.date;
      const appointmentTime = `${booking.schedules.Time.starttime} - ${booking.schedules.Time.endtime}`;

      const email = await sendEmailMedicalRecord(
        patientName,
        patientEmail,
        diagnosis,
        treatment,
        appointmentDate,
        appointmentTime
      );

      resolve(newMedicalRecord);
    } catch (error) {
      console.error("Lỗi trong CreateMedicalRecord:", error);
      reject(error);
    }
  });
};

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const sendEmailMedicalRecord = async (
  patientName,
  patientEmail,
  diagnosis,
  treatment,
  appointmentDate,
  appointmentTime
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patientEmail,
      subject: "📄 Kết quả khám bệnh & phác đồ điều trị - MyDoctor",
      html: ` 
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h3>Xin chào ${patientName},</h3>
        <p>Hồ sơ bệnh án của bạn đã được cập nhật. Dưới đây là thông tin chi tiết:</p>

        <table border="1" cellpadding="8" cellspacing="0" 
          style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <th style="background-color: #f2f2f2; text-align: left;">🗓 Ngày khám</th>
            <td>${formatDate(appointmentDate)}</td>
          </tr>
          <tr>
            <th style="background-color: #f2f2f2; text-align: left;">⏰ Giờ khám</th>
            <td>${appointmentTime}</td>
          </tr>
          <tr>
            <th style="background-color: #f2f2f2; text-align: left;">🔎 Chẩn đoán</th>
            <td>${diagnosis}</td>
          </tr>
          <tr>
            <th style="background-color: #f2f2f2; text-align: left;">💊 Phương pháp điều trị</th>
            <td>${treatment}</td>
          </tr>
        </table>

        <p>Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với phòng khám.</p>
        <p>Trân trọng,</p>
        <p><strong>Phòng khám MyDoctor</strong></p>
      </div>`,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email xác nhận đã được gửi!");
  } catch (e) {
    console.log(e);
    // return {success: false, me}
  }
};

const GetMedicalRecordsByUserID = async (userID) => {
  return new Promise(async (resolve, rejects) => {
    try {
      const user = await db.User.findOne({ where: { id: userID } });

      //Lay all ho so benh an
      const medicalrecords = await db.medicalrecords.findAll({
        include: [
          {
            model: db.booking,
            as: "booking",
            where: {
              userID,
            },
            include: [
              {
                model: db.schedules,
                as: "schedules",
                include: [
                  {
                    model: db.time,
                    as: "Time",
                    attributes: ["starttime", "endtime"],
                  },
                  {
                    model: db.doctor,
                    as: "Doctor",
                    include: [
                      {
                        model: db.User,
                        as: "User",
                        attributes: ["id", "fullname"],
                      },
                      {
                        model: db.specialty,
                        as: "specialty",
                        include: [
                          {
                            model: db.price,
                            as: "price",
                            attributes: ["price"],
                          },
                        ],
                        attributes: ["id", "name"],
                      },
                    ],
                    attributes: ["id", "specialtyID", "img"],
                  },
                ],
                attributes: ["date"],
              },
            ],
          },
        ],
        order: [["create_at", "DESC"]],
      });

      if (!medicalrecords || medicalrecords === 0) {
        return resolve();
      }

      const formattedRecords = medicalrecords.map((record) => ({
        id: record.id,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        createdAt: record.create_at,
        appointmentDate: record.booking?.schedules?.date || null, // Check schedules trước
        appointmentTime: record.booking?.schedules?.Time
          ? `${record.booking.schedules.Time.starttime} - ${record.booking.schedules.Time.endtime}`
          : null,
        doctor: record.booking?.schedules?.Doctor
          ? {
              id: record.booking.schedules.Doctor.id,
              name: record.booking.schedules.Doctor.User.fullname,
              specialty: record.booking.schedules.Doctor.specialty,
            }
          : null,
      }));

      resolve(formattedRecords);
    } catch (e) {
      console.log(e);
      rejects(e);
    }
  });
};

const GetAllTimeSlot = async () => {
  return new Promise(async (resolve, rejects) => {
    try {
      const timeslot = await db.time.findAll();
      resolve(timeslot);
    } catch (e) {
      console.log(e);
      rejects(e);
    }
  });
};

const CreateSchedules = (data) => {
  return new Promise(async (resolve, rejects) => {
    try {
      if (!data.timeID || data.timeID.length < 8) {
        return resolve({
          errCode: 2,
          errMessage: "Bạn phải chọn ít nhất 8 khung giờ để tạo lịch làm việc.",
        });
      }

      // Lấy danh sách các lịch trình đã tồn tại
      const existingSchedules = await db.schedules.findAll({
        where: {
          doctorID: data.doctorID,
          date: data.date,
          timeID: data.timeID, // Kiểm tra từng khung giờ
        },
      });

      if (existingSchedules.length > 0) {
        return resolve({
          errCode: 1,
          errMessage: "Khung giờ đã được đặt, vui lòng chọn khung giờ khác.",
        });
      }

      const schedules = data.timeID.map((timeID) => ({
        doctorID: data.doctorID,
        date: data.date,
        timeID: timeID,
      }));

      // Dùng bulkCreate để lưu nhiều bản ghi cùng một lúc
      await db.schedules.bulkCreate(schedules);

      resolve({
        errCode: 0,
        errMessage: "OK",
      });
    } catch (e) {
      console.log(e);
      rejects(e);
    }
  });
};

const getSchedule = (doctorID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const schedules = await db.schedules.findAll({
        where: {
          doctorID: doctorID,
        },
        attributes: ["id", "doctorID", "timeID", "date"],
        include: [
          {
            model: db.time,
            as: "Time",
            attributes: ["starttime", "endtime"],
          },
        ],
        order: [
          ["date", "ASC"],
          [{ model: db.time, as: "Time" }, "starttime", "ASC"],
        ], // Sắp xếp theo ngày tăng dần
      });

      resolve(schedules);
    } catch (e) {
      reject(e);
    }
  });
};

const GetMedicalRecords = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const medicalrecord = await db.medicalrecords.findAll({
        include: [
          {
            model: db.booking,
            as: "booking",
            include: [
              {
                model: db.User,
                as: "User",
              },

              {
                model: db.schedules,
                as: "schedules",
                include: [
                  {
                    model: db.time,
                    as: "Time",
                  },
                ],
              },
            ],
          },
        ],
      });

      resolve(medicalrecord);
    } catch (e) {
      reject(e);
    }
  });
};

const MarkAbsent = (bookingID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const booking = await db.booking.findOne({
        where: { id: bookingID },
      });

      if (!booking) {
        reject({
          errCode: 2,
          errMessage: "Không tìm thấy đặt lịch",
        });
      }
      await db.booking.update(
        {
          statusID: 4,
        },
        {
          where: { id: bookingID },
        }
      );
      resolve({
        errCode: 0,
        errMessage: "Cập nhật trạng thái thành công: Bệnh nhân không đến khám",
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  GetAppointmentByDoctorID,
  CreateMedicalRecord,
  sendEmailMedicalRecord,
  GetMedicalRecordsByUserID,
  GetAllTimeSlot,
  CreateSchedules,
  getSchedule,
  GetMedicalRecords,
  MarkAbsent,
};
