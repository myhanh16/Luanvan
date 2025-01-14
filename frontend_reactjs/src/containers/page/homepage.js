// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// // import "./home.css";
// // import UserService from "../../services/UserService";
// import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
// // import EditUserModal from "./modalUser";
// import emitter from "../../utils/emitter";
// // import UpdateUserModal from "./modalEdit";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import Homeheader from "./header";
import Specialty from "./section/specialty";
import "./hompage.css";
import Doctor from "./section/doctor";
import Handbook from "./section/handbook";
import About from "./section/about";
import HomeFooter from "./homefooter";

const Homepage = () => {
  return (
    <div>
      <Homeheader />
      <Specialty />
      <Doctor />
      <Handbook />
      <About />
      <HomeFooter />
    </div>
  );
};

export default Homepage;
