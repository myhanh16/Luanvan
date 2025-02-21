// // src/containers/App.js

// import React from "react";
// import Login from "./auth/login";
// import Home from "./auth/home";

// const App = () => {
//   return (
//     <div className="App">
//       <Login />
//       <Home />
//     </div>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./auth/login";
import HomeAdmin from "./HomeCRUD/home";
import Homepage from "./page/homepage";
import LoginAdmin from "./auth/loginAdmin";
import DoctorList from "./page/list/doctorList";
import CreateDoctor from "./HomeCRUD/createDoctor";
import DetailDoctor from "./page/list/DetailDoctor";
import TopDoctor from "./page/list/TopDoctor";
import SpecialtyList from "./page/list/SpecialtyList";
import Booking from "./page/list/Booking";
import Appointment from "./page/list/appoinment";
import UserProfile from "./page/UserProfile";
import HomeDoctor from "./Doctor/HomeDoctor";
import CreateSchedules from "./Doctor/CreateSchedule";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/doctor/:specialty" element={<DoctorList />} /> */}
        <Route path="/doctor/:id" element={<DoctorList />} />
        <Route path="/detail/:id" element={<DetailDoctor />} />
        <Route path="/topdoctor" element={<TopDoctor />} />
        <Route path="/specialty-list" element={<SpecialtyList />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/profile/:id" element={<UserProfile />} />

        {/*------------------Router cho Admin---------------- */}

        <Route path="/login-admin-doctor" element={<LoginAdmin />} />
        <Route path="/homeadmin" element={<HomeAdmin />} />
        <Route path="/create-doctor" element={<CreateDoctor />} />

        {/* -----------------------Router cho Doctor------------------ */}
        <Route path="/homedoctor" element={<HomeDoctor />} />
        <Route path="/create-shedule" element={<CreateSchedules />} />
      </Routes>
    </Router>
  );
}

export default App;
