require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const session = require("express-session");
const flash = require("connect-flash");
const configViewEngine = require("./src/config/viewEngine");
const webRouter = require("./src/routes/web");
const connect = require("./src/config/connectDB");
const fileupload = require("express-fileupload");
const cors = require("cors");

const hostname = process.env.HOSTNAME;
const port = process.env.PORT || 3000;

// Cấu hình session
app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // secure: true nếu sử dụng HTTPS
  })
);

app.use(
  cors({
    origin: "http://localhost:3000", // Domain được phép
    credentials: true, // Để gửi cookie hoặc thông tin xác thực
  })
);

app.use(flash());
// app.use((req, res, next) => {
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.success_msg = req.flash('success_msg');
//   next();
// });
app.use(fileupload());

//config req.body
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

//const storage = multer.memoryStorage();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const specialtyID = req.body.specialtyID;
    cb(null, `public/img/doctor/${specialtyID}`); // Thư mục để lưu file (đảm bảo thư mục này tồn tại)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname); // Lấy phần đuôi file
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension); // Tạo tên file duy nhất
  },
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, "public")));

// const fileUpload = require('express-fileupload');
// app.use(fileUpload());

//config template
configViewEngine(app);

//Khai báo route
app.use("/", webRouter);

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!!!");
// });
connect();

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
