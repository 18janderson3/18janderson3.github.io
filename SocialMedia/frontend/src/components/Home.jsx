import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="container">
            <div className="row justify-content-md-center">
                <div class="col-md-auto mt-3">
                    <h1>Welcome to 6zai</h1>
                </div>
            </div>
            <div className="row justify-content-md-center">
                <div class="col-md-auto">
                    <h4>Image boards social media site</h4>
                </div>
            </div >
            <div className="row">
                <div class="col-md-auto mt-3">
                    <h2>Current Boards:</h2>
                </div>
            </div >
            <div className="row">
                <div class="col-md-auto ms-3">
                    <ul>
                        <li className="fs-5">
                            <Link to="/b">/b/ Random</Link>
                        </li>
                    </ul>
                </div>
            </div >
        </div>
    );
}
export default Home;