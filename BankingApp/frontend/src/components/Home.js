import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const Home = () => {
    const [name, setName] = useState("");
    const [savingBalance, setSavingBalance] = useState(0);
    const [checkingBalance, setCheckingBalance] = useState(0);
    const [creditBalance, setCreditBalance] = useState(0);
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
        setSavingBalance(result.savingBalance);
        setCheckingBalance(result.checkingBalance);
        setCreditBalance(result.creditBalance);
        console.log(result);
    }

    useEffect(() => { 
        getInfo();
        return;
    },[]);


    return(
        <div>
            {name ? (
                <div>
                    <h1>Hello {name}!</h1>
                    <div class="home-panel">
                        <h2 class="home-panel-header">Accounts</h2>
                        <div class="account-box">
                            <div class="row">
                                <div class="column">
                                    <p class="account-name">Saving</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="column">
                                    <p>Balance</p>
                                </div>
                                <div class="column">
                                    <p>${savingBalance.toFixed(2)}</p>
                                </div>
                                <div class="column">
                                    <button onClick={() => navigate("/details", { state: {id: '65f3a8c6e7351c76396b5dce', account: 'Saving', username: `${name}`} })}>Details</button>
                                </div>
                            </div>
                        </div>
                        <div class="account-box">
                            <div class="row">
                                <div class="column">
                                    <p class="account-name">Checking</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="column">
                                    <p>Balance</p>
                                </div>
                                <div class="column">
                                    <p>${checkingBalance.toFixed(2)}</p>
                                </div>
                                <div class="column">
                                    <button onClick={() => navigate("/details", {state: {id: '65f3a92fe7351c76396b5dd0', account: 'Checking', username: `${name}`} })}>Details</button>
                                </div>
                            </div>
                        </div>
                        <div class="account-box">
                            <div class="row">
                                <div class="column">
                                    <p class="account-name">Credit</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="column">
                                    <p>Balance</p>
                                </div>
                                <div class="column">
                                    <p>${creditBalance.toFixed(2)}</p>
                                </div>
                                <div class="column">
                                    <button onClick={() => navigate("/details", {state: {id: '65f3a93de7351c76396b5dd1', account: 'Credit', username: `${name}`} })}>Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="home-panel">
                        <h2 class="home-panel-header">Money Management</h2>
                        <button onClick={() => navigate("/deposit")}>Withdraw / Deposit</button>
                        <button onClick={() => navigate("/transfer")}>Transfer</button>
                        <button onClick={() => navigate("/details", {state: {id: '4', account: 'Account', username: `${name}`} })}>History</button>
                    </div>
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
export default Home;