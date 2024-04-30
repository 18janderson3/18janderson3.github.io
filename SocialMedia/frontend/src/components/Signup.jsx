import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const Signup = (props) => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
        error: "",
    });

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }
    const navigate = useNavigate();

    const signup = async (event) => {
        event.preventDefault();

        if (form.password !== form.password2) {
            updateForm({ error: "Passwords do not match" });
            return;
        }
        if (form.password.length < 4) {
            updateForm({ error: "Passwords must be at least 4 characters long" });
            return;
        }
        if (form.username.length < 1) {
            updateForm({ error: "Must choose a username" });
            return;
        }
        if (form.email.length < 1) {
            updateForm({ error: "Must probide an email" });
            return;
        }

        const body = { username: form.username, email: form.email, password: form.password };
        const response = await fetch("/api/signup/", {
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
                updateForm({ error: "username is taken" });
            });


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
            <form onSubmit={signup}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" id="username" name="username"
                        value={form.username} onChange={(e) => updateForm({ username: e.target.value })} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="text" className="form-control" id="email" name="email"
                        value={form.email} onChange={(e) => updateForm({ email: e.target.value })} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password"
                        value={form.password} onChange={(e) => updateForm({ password: e.target.value })} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Repeat Password</label>
                    <input type="password" className="form-control" id="password2" name="password2"
                        value={form.password2} onChange={(e) => updateForm({ password2: e.target.value })} />
                </div>
                <div>
                    {form.error &&
                        <small className="text-danger">
                            {form.error}
                        </small>
                    }
                </div>
                <button type="submit" className="btn btn-primary">Signup</button>
            </form>
        </div>
    );
}
export default Signup;