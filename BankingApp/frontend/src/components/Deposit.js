import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";


const Deposit = () => {
    //accountType grabs the account type for the deposit/withdraw
    //method means if its going to be a deposit or a withdraw
    //amount is the amount of money they are either putting in or taking out
    //name is name of user logged in
    const [accountInfo, setAccountInfo] = useState({
        accountType: "",
        method: "",
        amount: "",
        name: "",
    });

    //will update accountInfo 
    function updateAccountInfo(value) {
        return setAccountInfo((prev) => {
            //loading up accountInfo
            return { ...prev, ...value };
        });
    }


    //the message that will be used to display to the user 
    const [msg, setMsg] = useState("");

    //name of user
    const [name, setName] = useState("");

    //navigate
    const navigate = useNavigate();

    //function that is called when the logout button is pressed if the user is not logged in
    const login = () => {
        navigate("/login");
    }

    //gets the user that is logged in via cookies
    async function getInfo() {
        const response = await fetch("http://localhost:5000/getUserInfo", {
            method: "GET",
            credentials: 'include',
        })
            .catch(error => {
                window.alert(error);
                return;
            });

        const result = await response.json();

        //setting the name of the user that is logged in
        setName(result.username);

        //setting the name of the user that is logged in, into our account information
        updateAccountInfo({ name: result.username })

        console.log(result);
    }

    //checks to see if a user is logged in when page is first loaded up
    useEffect(() => {
        getInfo();
        return;
    }, []);

    //when the user clicks the submit button
    async function onSubmit(e) {

        e.preventDefault();

        console.log(accountInfo);

        if (accountInfo.accountType === "" || accountInfo.method === "" || accountInfo.amount === "" || parseFloat(accountInfo.amount) <= 0) {
            setMsg("Missing a required field or amount is too low");
        }
        else {

            setMsg("");

            const getUser = { ...accountInfo };

            console.log(getUser);

            //make the api call, send over the objectid for checking, savings,credit and then use that with the name in a query to find the account
            const response = await fetch("http://localhost:5000/transactionRequests", {
                method: "POST",
                body: JSON.stringify(getUser),
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            })
                .catch(error => {
                    window.alert(error);
                    return;
                });

            const result = await response.json();
            
            console.log(result.value);

            if(result.value === 1){
                setMsg("transaction successful");
            }
            else{
                setMsg("could not complete transaction")
            }

            updateAccountInfo({ amount: "" });
            


        }



    }



    return (
        <div>
            {name ? (
                <form onSubmit={onSubmit}>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Amount</label>
                        <input value={accountInfo.amount} onChange={(e) => updateAccountInfo({ amount: e.target.value })} type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    </div>

                    <div className="form-group">
                        <div className="radioWrapper">
                            <label className="form-check-label">Checking</label>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="accountOptions"
                                id="Checking"
                                value="Checking"
                                checked={accountInfo.accountType === "65f3a92fe7351c76396b5dd0"}
                                onChange={(e) => updateAccountInfo({ accountType: "65f3a92fe7351c76396b5dd0" })}
                            />
                        </div>
                        <div className="radioWrapper"> {/* Wrapper for radio buttons and labels */}
                            <label className="form-check-label">Savings</label>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="accountOptions"
                                id="Savings"
                                value="Savings"
                                checked={accountInfo.accountType === "65f3a8c6e7351c76396b5dce"}
                                onChange={(e) => updateAccountInfo({ accountType: "65f3a8c6e7351c76396b5dce" })}
                            />
                        </div>
                        <div className="radioWrapper"> {/* Wrapper for radio buttons and labels */}
                            <label className="form-check-label">Credit</label>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="accountOptions"
                                id="Credit"
                                value="Credit"
                                checked={accountInfo.accountType === "65f3a93de7351c76396b5dd1"}
                                onChange={(e) => updateAccountInfo({ accountType: "65f3a93de7351c76396b5dd1" })}
                            />
                        </div>
                    </div>



                    <div className="form-group2">
                        <div className="form-check form-check-inline">
                            <div className="radioWrapper">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="account"
                                    id="deposit"
                                    value="Deposit"
                                    checked={accountInfo.method === "Deposit"}
                                    onChange={(e) => updateAccountInfo({ method: e.target.value })}
                                />
                                <label htmlFor="Deposit" className="form-check-label">Deposit</label>
                            </div>
                            <div className="radioWrapper">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="account"
                                    id="Withdraw"
                                    value="Withdraw"
                                    checked={accountInfo.method === "Withdraw"}
                                    onChange={(e) => updateAccountInfo({ method: e.target.value })}
                                />
                                <label htmlFor="Withdraw" className="form-check-label">Withdraw</label>
                            </div>
                        </div>
                    </div>


                    <button type="submit" class="btn btn-primary">Submit</button>
                    <p class="text-center">{msg}</p>
                </form>


            ) : (
                <div>
                    <h1>you need to login</h1>
                    <button onClick={login}>Login</button>
                </div>
            )}
        </div>
    );
}
export default Deposit;