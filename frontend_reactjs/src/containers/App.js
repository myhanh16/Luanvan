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
// import Home from "./HomeCRUD/home";
// import Homeheader from "./page/header";
import Homepage from "./page/homepage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
