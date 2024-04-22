import React, { useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    function updateForm(value) {
        return setForm((prev) => {
          return { ...prev, ...value };
        });
    }

    async function login(){
        const newPerson = { ...form };
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPerson),
        })
            .catch(error => {
                window.alert(error);
                return;
            });

        const result = await response.json();
        console.log(result);
        if (result.login === "success"){
            navigate("/");
        } else {
            setError("Error: " + result.login);
        }
    }

    const signup = () => {
        navigate("/signup");
    }

    return(
        <div>
            <label>Username</label>
            <input 
                type="text"
                value={form.username}
                onChange={(e) => updateForm({ username: e.target.value })}
            ></input>

            <label>Password</label>
            <input 
                type="password"
                value={form.password}
                onChange={(e) => updateForm({ password: e.target.value })}
            ></input>

            {error ? (
                <p class="alert alert-danger">{error}</p>
            ):(
                <></>
            )}

            <button onClick={login}>Login</button>
            <button onClick={signup}>Sign up</button>
        </div>
    );
}
export default Login;