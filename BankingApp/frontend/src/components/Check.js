import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const Check = () => {
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const login = () => {
        navigate("/login");
    }
    async function getInfo(){
        const response = await fetch("http://localhost:5000/getUserInfo", {
            method: "GET",
            credentials: 'include',
        })
            .catch(error => {
                window.alert(error);
                return;
            });
                
        const result = await response.json();
        setName(result.username);
        console.log(result);
    }

    useEffect(() => { 
        getInfo();
        return;
    },[]);

    async function logout(){
        const response = await fetch("http://localhost:5000/logout", {
            method: "GET",
            credentials: 'include',
        })
            .catch(error => {
                window.alert(error);
                return;
            });
        setName(null);
    }

    return(
        <div>
            {name ? (
                <div>
                    <h1>hi {name}</h1>
                    <button onClick={logout}>Logout</button>
                </div>
            ):(
                <div>
                    <h1>you need to login</h1>
                    <button onClick={login}>Login</button>
                </div>
            )}
        </div>
    );
}
export default Check;