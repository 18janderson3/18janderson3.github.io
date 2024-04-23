import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";


const Welcome = () => {

    const [form, setForm] = useState({
        name: "",
    });
    
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }
    const navigate = useNavigate();
    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault();
        // When a post request is sent to the create url, we'll add a new record to the database.
        const newPerson = { ...form };
        const response = await fetch("http://localhost:5000/score/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPerson),
        })
            .catch(error => {
                window.alert(error);
                return;
            });
        const record = await response.json();
        setForm({ name: ""});
        navigate(`/game/${record.insertedId.toString()}`,{state:{length: record.length}});
        //,{state:{length: record.length}}
    }


    return (
        <div>
        <h3>Welcome</h3>
        <form onSubmit={onSubmit}>
        <div className="form-group">
            <label htmlFor="name">Name: </label>
            <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            />
        </div>

        <div className="form-group">
            <input
            type="submit"
            value="Start!"
            className="btn btn-primary"
            />
        </div>
        </form>
    </div>
    );
};
export default Welcome;