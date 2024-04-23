import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 // We import all the components we need in our app

import Welcome from "./components/Welcome";
import Game from "./components/Game";
import Leaderboard from "./components/Leaderboard";
import "./style/dark.css";

 const App = () => {
 return (
   <div>
     <Routes>
       <Route exact path="/" element={<Welcome />} />
       <Route path="/game/:id" element={<Game />} />
       <Route path="/leaderboard/:length" element={<Leaderboard />} />
     </Routes>
   </div>
 );
};
export default App;