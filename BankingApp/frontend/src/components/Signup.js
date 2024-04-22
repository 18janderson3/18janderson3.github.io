import React, { useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        username: "",
        password: "",
        password2: "",
    });

    function updateForm(value) {
        return setForm((prev) => {
          return { ...prev, ...value };
        });
    }

    function dataValidate(){
        if(form.password !== form.password2){
            setError("Error: passwords do not match");
            return false;
        }
        if(form.password.length < 8){
            setError("Error: password must be at least 8 characters long");
            return false;
        }
        if(form.username === ""){
            setError("Error: must set a valid username");
            return false;
        }
        if(form.username.includes(" ")){
            setError("Error: no spaces in username")
            return false;
        }
        return true;
    }

    async function signup(){
        if(!dataValidate()) return;
        const newPerson = { ...form };
        const response = await fetch("http://localhost:5000/newuser", {
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

        if (result.signup === "success"){
            navigate("/");
        } else {
            setError("Error: username taken");
        }
    }

    const login = () => {
        navigate("/login");
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
            <label>Confirm Password</label>
            <input 
                type="password"
                value={form.password2}
                onChange={(e) => updateForm({ password2: e.target.value })}
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