import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router";

const Record = (props) => (
    <tr>
        <td>{props.record.fromAccountID}</td>
        <td>{props.record.toAccountID}</td>
        <td>{props.record.transactionTotal}</td>
        <td>{props.record.transactionDateTimeFormat}</td>
    </tr>
)
export default function Details() {
    const [records, setRecords] = useState([]);
    const account = useLocation();
    let transactionAccountId;
    let accountName;
    let name;
    console.log(account);
    if (account.state !== null) {
        transactionAccountId = account.state.id;
        accountName = account.state.account;
        name = account.state.username;
    }
    else {
        transactionAccountId = null;
        accountName = null;
        name = null;
    }
    const navigate = useNavigate();
    const login = () => {
        navigate("/login");
    }
    //console.log(transactionAccountId);

    useEffect(() => {
        async function getRecords() {
            const response = await fetch(`http://localhost:5000/transactionHistory/${transactionAccountId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const transactions = await response.json();
            //console.log("res");
            //console.log(transactions);
            setRecords(transactions.sort((a,b) => a.transactionDateTime - b.transactionDateTime));
            //console.log("frec");
            //console.log(records);
        }
        if (name) {
            getRecords();
        }
        return;
    }, [records.length]);

    function recordList() {
        return records.map((record) => {
            return (
                <Record
                    record = {record}
                    key = {record._id}
                />
            );
        });
    }

    if (name) {
        return (
            <div>
                <h1>{accountName} Transactions</h1>
                <table style={{ marginTop: 20 }}>
                    <thead>
                        <tr>
                            <th>Source</th>
                            <th>Destination</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>{recordList()}</tbody>
                </table>
            </div>
        );
    }
    else {
        return (
            <div>
                <h1>you need to login</h1>
                <button onClick={login}>Login</button>
            </div>
        );
    }
}

