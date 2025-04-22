const db = require("../models"); // Import models
const cron = require("node-cron");
require("dotenv").config();
const nodemailer = require("nodemailer");

function createJitsiMeet() {
  const roomName = `meeting-${Date.now()}`;
  return `https://meet.jit.si/${roomName}`;
}

function isMeetLinkExpired(booking) {
  const scheduleTime = new Date(
    `${booking.schedules.date}T${booking.schedules.Time.starttime}`
  );
  return Date.now() - scheduleTime.getTime() > 60 * 60000;
}

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

// ✅ Biến toàn cục lưu email đã gửi (chống gửi lặp lại)
const sentEmails = new Set();

async function scheduleMeetingCheck() {
  console.log("🔄 Kiểm tra cuộc hẹn sắp diễn ra...");
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  try {
    const upcomingSchedules = await db.schedules.findAll({
      where: { date: today },
      include: [
        { model: db.time, as: "Time" },
        {
          model: db.doctor,
          as: "Doctor",
          where: { onlineConsultation: 1 },
          include: [
            { model: db.User, as: "User", attributes: ["email", "fullname"] },
          ],
        },
        {
          model: db.booking,
          as: "Bookings",
          where: { statusID: 1 },
          include: [
            { model: db.User, as: "User", attributes: ["email", "fullname"] },
          ],
        },
      ],
    });

    for (const schedule of upcomingSchedules) {
      if (!schedule.Time || !schedule.Bookings.length) continue;

      const scheduleTime = new Date(
        `${schedule.date}T${schedule.Time.starttime}`
      );
      const timeDiff = scheduleTime - now;

      // Nếu sắp đến giờ hẹn (≤ 10 phút) và chưa có meetlink thì tạo
      if (timeDiff <= 10 * 60000 && !schedule.meetlink) {
        let meetlink = createJitsiMeet();
        await db.schedules.update({ meetlink }, { where: { id: schedule.id } });

        console.log(`✅ Tạo link Jitsi: ${meetlink}`);
        schedule.meetlink = meetlink;
      }

      // Gửi email nếu có meetlink
      if (schedule.meetlink) {
        for (const booking of schedule.Bookings) {
          let patientEmail = booking.User.email;
          let uniqueKey = `${booking.id}-${schedule.id}`; // Key duy nhất mỗi lịch

          if (!sentEmails.has(uniqueKey)) {
            try {
              await sendEmail(
                patientEmail,
                "Nhắc nhở cuộc hẹn",
                schedule.meetlink,
                schedule.Doctor?.User.fullname || "Không xác định",
                schedule.date || "0000-00-00",
                schedule.Time?.starttime || "00:00"
              );

              console.log(`📩 Đã gửi email cho: ${patientEmail}`);
              sentEmails.add(uniqueKey);
            } catch (error) {
              console.error(`❌ Lỗi gửi email tới ${patientEmail}:`, error);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("❌ Lỗi kiểm tra cuộc hẹn:", error);
  }
}

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

  const formattedDate = formatDate(appointmentDate);
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

// Cron job chạy mỗi phút
cron.schedule("* * * * *", scheduleMeetingCheck);

module.exports = scheduleMeetingCheck;
