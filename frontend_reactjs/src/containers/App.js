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
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/doctor/:specialty" element={<DoctorList />} /> */}
        <Route path="/doctor/:id" element={<DoctorList />} />

        {/*------------------Router cho Admin---------------- */}
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/homeadmin" element={<HomeAdmin />} />
        <Route path="/create-doctor" element={<CreateDoctor />} />
      </Routes>
    </Router>
  );
}

export default App;
