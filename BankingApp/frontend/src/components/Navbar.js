import React, { useState, useEffect } from "react";
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
 // We import NavLink to utilize the react router.
import { NavLink, useNavigate } from "react-router-dom";

// Here, we display our Navbar
export default function Navbar() {
    const navigate = useNavigate();
    const [name, setName] = useState("");

    async function logout() {
        try {
            await fetch("http://localhost:5000/logout", {
                method: "GET",
                credentials: 'include',
            });
            setName(null);
            navigate('/login');
        } catch (error) {
            window.alert(error);
        }
    }


 return (
   <div>
     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
       <NavLink className="navbar-brand" to="/">
       <img style={{"width" : 10 + '%'}} alt="logo" src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/27_Artstation_logo_logos-512.png"></img>
       </NavLink>
       <button
         className="navbar-toggler"
         type="button"
         data-toggle="collapse"
         data-target="#navbarSupportedContent"
         aria-controls="navbarSupportedContent"
         aria-expanded="false"
         aria-label="Toggle navigation"
       >
         <span className="navbar-toggler-icon"></span>
       </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
         <ul className="navbar-nav ml-auto">
           <li className="nav-item">
            <button onClick={logout}>Logout</button>
           </li>
         </ul>
       </div>
     </nav>
   </div>
 );
}