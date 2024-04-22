import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Transfer from "./components/Transfer";
import Deposit from "./components/Deposit";
import Home from "./components/Home";
import Details from "./components/Details";
import "./style/dark.css";

const App = () => {
  const location = useLocation();
  let navbar = null;

  if (location.pathname !== "/login" && location.pathname !== "/signup") {
    navbar = <Navbar />;
  }

  return (
    <div>
      {navbar}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/details" element={<Details />} />
      </Routes>
    </div>
  );
};

export default App;
