import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import TextTruncate from 'react-text-truncate';

const cookies = new Cookies();




const Board = (props) => {
    const params = useParams();
    const replywindow = useRef(null)
    const navigate = useNavigate();

    const [threads, setThreads] = useState([]);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        text: "",
    });
    const [file, setFile] = useState();

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    const makePost = async (event) => {
        event.preventDefault();
        if (form.text == "") {
            setError("First post must have text");
            return;
        }
        if (!file) {
            setError("First post must have image");
            return;
        }
        const uploadData = new FormData();
        uploadData.append('name', props.state.username);
        uploadData.append('text', form.text);
        uploadData.append('image', file, file.name);

        const response = await fetch("/rest/post/", {
            method: "POST",
            headers: {
                "X-CSRFToken": cookies.get("csrftoken"),
            },
            credentials: "same-origin",
            body: uploadData
        })
            .catch(error => {
                window.alert(error);
                return;
            });
        const resdata = await response.json();
        updateForm({ text: "" });
        navigate(`/b/${resdata.id}`);
    }




    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'auto'
        });
    };
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    };


    const populate = async () => {
        const response = await fetch(`/rest/getb/`, {
            credentials: "same-origin",
        })
            .catch(error => {
                window.alert(error);
                return;
            });
        const responseData = await response.json();
        const loaded = [];
        for (const key in responseData) {
            loaded.push({
                id: responseData[key].id,
                name: responseData[key].name,
                date: new Date(responseData[key].date + " UTC"),
                text: responseData[key].text,
                img: responseData[key].image,
                replies: []
            });
        }
        console.log(loaded);
        setThreads(loaded);
    }

    useEffect(() => {
        populate();
    }, []);

    const threadlist = threads.map((post) =>

        <div class="tcard card m-3 border rounded-0" style={{ "width": "10rem", "display": "inline-block" }} onClick={() => navigate(`/b/${post.id}`)}>
            <div class="card-img-top border-bottom m-0" style={{ "height": "10rem", "display": "flex", "justify-content": "center" }}>
                <img style={{ "max-height": "100%", "max-width": "100%", "margin": "auto" }} src={post.img} alt="Card image cap" />
            </div>

            <div class="card-body m-0 p-0">
                <h6 class="card-title m-0 p-1" style={{ color: "#AE91B8" }}>{post.name}</h6>
                <TextTruncate class="card-text m-0 p-1" style={{ "height": "7rem", "display": "flex" }}
                    line={5}
                    element="p"
                    truncateText="…"
                    text={post.text}
                />
            </div>
        </div>
    );


    return (
        <div class="container-fluid z-1 position-relative">
            <div class="row m-3">
                <div class="d-flex justify-content-center">
                    <h2 className="text-center">/b/ - Random</h2>
                </div>
            </div>
            <div class="row m-3">
                <div class="d-flex justify-content-center">

                    <button onClick={() => {
                        replywindow.current.scrollIntoView();
                        replywindow.current.focus();
                    }}>Start a Thread</button>
                </div>
            </div>
            <hr class="m-1" />
            <div class="row">
                <div class="col-1">
                    [<Link class="link-offset-2 link-underline link-underline-opacity-0" to="/">Home</Link>]

                    [<Link class="link-offset-2 link-underline link-underline-opacity-0" onClick={scrollToBottom}>Bottom</Link>]
                </div>
            </div>
            <hr class="m-1" />
            {threadlist}
            <hr class="m-1" />
            <div class="row">
                <div class="col-1">
                    [<Link class="link-offset-2 link-underline link-underline-opacity-0" to="/">Home</Link>]

                    [<Link class="link-offset-2 link-underline link-underline-opacity-0" onClick={scrollToTop}>Top</Link>]
                </div>
            </div>
            <hr class="m-1" />

            <div className="row d-flex justify-content-center m-0">
                <div className="col-3 m-0 p-0">
                    <form onSubmit={makePost} className="container bg-secondary bg-opacity-25 border border-1 border-white rounded-0 m-0 p-0" >
                        <div className="row m-0">
                            <h6 className="m-0">Start a new thread</h6>
                        </div>
                        {error &&
                            <div className="text-danger row mx-2">
                                {error}
                            </div>
                        }
                        <div className="row m-0">
                            <textarea
                                ref={replywindow}
                                rows="8"
                                className="m-0"
                                type="text"
                                placeholder="Comment"
                                value={form.text}
                                onChange={(e) => updateForm({ text: e.target.value })}
                            ></textarea>
                        </div>
                        <div className="row m-0 p-0">
                            <input type="file" className="col m-0 p-0" onChange={(e) => setFile(e.target.files[0])}></input>
                            <button className="col-2 m-0 p-0" type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}
export default Board;