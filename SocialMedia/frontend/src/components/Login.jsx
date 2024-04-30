import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const Login = (props) => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        error: "",
    });

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }
    const navigate = useNavigate();
    const login = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        // Make a POST request to the "/api/login/" URL with the form data
        console.log(form);
        const body = { username: form.username, password: form.password };
        const response = await fetch("/api/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.get("csrftoken"),
            },
            credentials: "same-origin",
            body: JSON.stringify(body),
        })
            .catch((err) => {
                console.log(err);
                updateForm({ error: "Wrong username or password." });
            });
        console.log(response);
        if (response.status >= 200 && response.status <= 299) {
            const data = await response.json();
            console.log(data);
            updateForm({ username: "", password: "", error: "" });
            props.onLogin();
            navigate('/');
        } else {
            throw Error(response.statusText);
        }
    }
    return (
        <div className="container mt-3">
            <h1>React Cookie Auth</h1>
            <br />
            <h2>Login</h2>
            <form onSubmit={login}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" id="username" name="username"
                        value={form.username} onChange={(e) => updateForm({ username: e.target.value })} />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Password</label>
                    <input type="password" className="form-control" id="password" name="password"
                        value={form.password} onChange={(e) => updateForm({ password: e.target.value })} />
                    <div>
                        {form.error &&
                            <small className="text-danger">
                                {form.error}
                            </small>
                        }
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
}
export default Login;