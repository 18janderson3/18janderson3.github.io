import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = (props) => {
    const navigate = useNavigate();
    const logout = async () => {
        const response = await fetch("/api/logout/", {
            credentials: "same-origin",
        })
            .catch((err) => {
                console.log(err);
            });
        console.log(response);

        if (response.status >= 200 && response.status <= 299) {
            const data = await response.json();
            console.log(data);
            props.onLogout();
            navigate('/');
        } else {
            throw Error(response.statusText);
        }
    };


    return (
        <div className="border-bottom border-1 m-0 m-p fs-6">
            {props.state.isAuthenticated ?
                <>
                    <span className="mx-2">Welcome {props.state.username}</span>
                    <button type="button" onClick={logout} class="btn btn-link m-0 p-0">Logout</button>
                </>
                :
                <>
                    <Link className="mx-2" to='/login'>Login</Link>
                    <Link className="mx-1" to='/signup'>Signup</Link>
                </>
            }
        </div>
    );
}
export default Navbar;