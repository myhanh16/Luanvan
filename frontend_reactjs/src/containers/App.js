// src/containers/App.js

import React from "react";
import Login from "./auth/login";

const App = () => {
  return (
    <div className="App">
      {/* <h1>Welcome to React App</h1> */}
      <Login /> {/* Đảm bảo component Login được render */}
    </div>
  );
};

export default App;
