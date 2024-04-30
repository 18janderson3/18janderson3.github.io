import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Board from "./components/Board";
import Thread from "./components/Thread";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";

const App = () => {

  const [state, setState] = useState({
    isAuthenticated: false,
    username: "Anonymous"
  });
  const whoami = async () => {
    const response = await fetch("/api/whoami/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })
      .catch((err) => {
        console.log(err);
        return;
      });
    const data = await response.json();
    setState(data);
  }
  useEffect(() => {
    whoami();
  }, []);

  return (
    <div>
      <Navbar state={state} onLogout={whoami}></Navbar>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/b" element={<Board state={state} />} />
        <Route path="/b/:id" element={<Thread state={state} />} />
        <Route path="/login" element={<Login onLogin={whoami} />} />
        <Route path="/signup" element={<Signup onLogin={whoami} />} />
      </Routes>
    </div>
  );
}
export default App;
