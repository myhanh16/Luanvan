const db = require("../models"); // Import models
const cron = require("node-cron");
require("dotenv").config();
const nodemailer = require("nodemailer");

// Hàm tạo Jitsi Meet khi đặt lịch
function createJitsiMeet() {
  const roomName = `meeting-${Date.now()}`; // ID phòng dựa trên timestamp
  return `https://meet.jit.si/${roomName}`;
}

// Hàm kiểm tra link đã hết hạn chưa (1 tiếng sau giờ hẹn)
function isMeetLinkExpired(booking) {
  const scheduleTime = new Date(
    `${booking.schedules.date}T${booking.schedules.Time.starttime}`
  );
  return Date.now() - scheduleTime.getTime() > 5 * 60000; // Quá 1 giờ → hết hạn
}

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

async function scheduleMeetingCheck() {
  console.log("🔄 Kiểm tra cuộc hẹn sắp diễn ra...");
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  try {
    // Lấy tất cả các cuộc hẹn chưa hoàn thành
    const upcomingBookings = await db.booking.findAll({
      where: { statusID: 1 }, // Chỉ kiểm tra cuộc hẹn đang chờ
      include: [
        {
          model: db.schedules,
          as: "schedules",
          where: { date: today },
          include: [
            { model: db.time, as: "Time" },
            {
              model: db.doctor,
              as: "Doctor",
              where: { onlineConsultation: 1 },
              include: [
                {
                  model: db.User,
                  as: "User",
                  attributes: ["email", "fullname"],
                }, // Thông tin bác sĩ
              ],
            },
          ],
        },
        { model: db.User, as: "User", attributes: ["email", "fullname"] },
      ],
    });

    for (const booking of upcomingBookings) {
      if (!booking.schedules || !booking.schedules.Time) continue;

      const scheduleTime = new Date(
        `${booking.schedules.date}T${booking.schedules.Time.starttime}`
      );
      const timeDiff = scheduleTime - now;
      let patientEmail = booking.User.email;

      // Kiểm tra nếu link đã hết hạn
      if (booking.meetlink && isMeetLinkExpired(booking)) {
        console.log(`🚫 Link cuộc hẹn đã hết hạn: ${booking.meetlink}`);
        continue; // Không gửi email nếu link đã hết hạn
      }

      // Nếu chưa có link, tạo link khi đến gần cuộc hẹn
      if (timeDiff <= 10 * 60000 && !booking.meetlink) {
        let meetlink = createJitsiMeet();
        await db.booking.update({ meetlink }, { where: { id: booking.id } });

        console.log(`✅ Jitsi Meet link tạo: ${meetlink}`);

        await sendEmail(
          patientEmail,
          "Nhắc nhở cuộc hẹn",
          meetlink,
          booking.schedules.Doctor?.User.fullname || "Không xác định",
          booking.schedules.date || "0000-00-00", // Tránh undefined
          booking.schedules.Time?.starttime || "00:00"
        );
      }

      // Nhắc nhở khi cuộc hẹn bắt đầu
      if (timeDiff <= 0 && booking.meetlink) {
        await sendEmail(
          patientEmail,
          "Cuộc hẹn bắt đầu ngay bây giờ!",
          booking.meetlink,
          booking.schedules.Doctor?.name || "Không xác định",
          booking.schedules.date || "0000-00-00",
          booking.schedules.Time?.starttime || "00:00"
        );
      }
    }
  } catch (error) {
    console.error("❌ Lỗi kiểm tra cuộc hẹn:", error);
  }
}

// Hàm gửi email cho bệnh nhân
// async function sendEmail(to, subject, text) {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = { from: process.env.EMAIL_USER, to, subject, text };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`📧 Email đã gửi đến ${to}`);
//   } catch (error) {
//     console.error("❌ Lỗi gửi email:", error);
//   }
// }
async function sendEmail(
  to,
  subject,
  meetlink,
  doctorName,
  appointmentDate,
  appointmentTime
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const formattedDate = formatDate(appointmentDate); // Hàm format ngày tháng
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: `
      <h2>🔔 Nhắc Nhở Cuộc Hẹn Khám Bệnh - MyDoctor</h2>
      <p>Xin chào,</p>
      <p>Cuộc hẹn khám bệnh của quý khách sắp diễn ra.</p>
      <p><strong>Thông tin chi tiết:</strong></p>
      <ul>
        <li><strong>Bác sĩ phụ trách:</strong> ${doctorName}</li>
        <li><strong>Ngày khám:</strong> ${formattedDate}</li>
        <li><strong>Giờ khám:</strong> ${appointmentTime}</li>
      </ul>
      <p><strong>Đối với tư vấn trực tuyến:</strong></p>
      <p>Vui lòng tham gia cuộc hẹn qua đường link dưới đây:</p>
      <p><a href="${meetlink}" style="color: #007bff; font-weight: bold;">Tham Gia Cuộc Hẹn</a></p>
      <p>Hãy đảm bảo bạn tham gia đúng giờ để có trải nghiệm tốt nhất.</p>
      <p>Trân trọng,<br><strong>Phòng khám MyDoctor</strong></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email nhắc nhở đã gửi đến ${to}`);
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
  }
}

// Chạy cron job mỗi phút
cron.schedule("* * * * *", scheduleMeetingCheck);

module.exports = scheduleMeetingCheck;
