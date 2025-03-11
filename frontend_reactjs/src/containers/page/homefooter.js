import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCopyright } from "react-icons/fa";

const HomeFooter = () => {
  return (
    <div className="section-footer">
      <p>
        <FaCopyright /> 2025 My Doctor.
      </p>
      <p>
        Liên hệ: <a href="#"> hanhnguyen6118@gmail.com</a>
      </p>
    </div>
  );
};

export default HomeFooter;
