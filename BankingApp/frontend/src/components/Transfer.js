import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../style/dark.css"
const Transfer = () => {
    const [user, setUser] = useState({
        name: "",
        accounts: []
    });
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        from: "",
        amount: "",
        to: "",
        username: ""
    });

    function updateForm(value) {
        setError(null);
        return setForm((prev) => {
          return { ...prev, ...value };
        });
    }

    async function submit(event){
        event.preventDefault();
        if(form.from === form.to){
            setError("Error: Cannot transfer between the same account");
            return;
        }

        const num = parseFloat(form.amount) * 100;
        if (!Number.isInteger(num) && num > 0) {
            setError("Error: must enter a valid number");
            return;
        }
        const request = {
            from: form.from,
            amount: num,
            to: form.to,
            username: user.name
        };

        console.log(request);

        if (!window.confirm("Are you sure?")) {
            return;
        }
        const response = await fetch("http://localhost:5000/submitTransfer", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        })
            .catch(error => {
                window.alert(error);
                return;
            });

        const result = await response.json();
        console.log(result);
        if (result.status === "success"){
            navigate("/");
        } else {
            setError(result.status);
        }
    }

    const navigate = useNavigate();
    const login = () => {
        navigate("/login");
    }

    async function getData(){
        const response = await fetch("http://localhost:5000/getTransferInfo", {
            method: "GET",
            credentials: 'include',
        })
            .catch(error => {
                window.alert(error);
                return;
            });

        const result = await response.json();
        const data = {
            name: result.username,
            accounts: result.accounts
        }
        
        setUser(data);
        updateForm({ 
            from: data.accounts[0].accountid,
            to: data.accounts[0].accountid,
            username: data.name
        });

    }

    useEffect(() => { 
        getData();
        return;
    },[]);

    return(
        <div>
            {user.name ? (
                <div>
                    <h1>Transfer between {user.name}'s accounts</h1>
                    <form onSubmit={submit}>
                        <label>From:</label>
                        <select name="from" id="from" onChange={(e) => updateForm({ from: e.target.value })}>
                            {user.accounts.map((i) =>
                               <option value={i.accountid}>{i.accountname}</option> 
                            )}
                        </select>

                        <label>Amount:</label>
                        <input type="text" onChange={(e) => updateForm({ amount: e.target.value })}></input>

                        <label>To:</label>
                        <select name="to" id="to" onChange={(e) => updateForm({ to: e.target.value })}>
                            {user.accounts.map((i) => 
                               <option value={i.accountid}>{i.accountname}</option> 
                            )}
                        </select>

                        {error ? (
                            <p class="alert alert-danger">{error}</p>
                        ) : (
                            <></>
                        )}

                        <input type="submit" value="Submit"></input>
                    </form>
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
export default Transfer;