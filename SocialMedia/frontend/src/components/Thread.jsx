import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import reactStringReplace from 'react-string-replace';

const cookies = new Cookies();

const Thread = (props) => {
    const params = useParams();
    const [posts, setPosts] = useState([]);
    const [hover, setHover] = useState(null);
    const [imgPosition, setImgPosition] = useState({ top: 0, left: 0 });
    const hoverimg = useRef(null);
    const replywindow = useRef(null);
    const postRef = useRef(null);
    const [focus, setFocus] = useState();

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


    const hoverInit = (e, i) => {
        setHover(i);
        let top = 0;
        let left = e.clientX + 100;
        console.log(left);
        setImgPosition({ ...imgPosition, ...{ top: top, left: left } });
        hoverUpdate();
    }
    const hoverUpdate = () => {
        if (hover) {
            let vw, vh;
            if (window.innerWidth !== undefined && window.innerHeight !== undefined) {
                vw = window.innerWidth;
                vh = window.innerHeight;
            } else {
                vw = document.documentElement.clientWidth;
                vh = document.documentElement.clientHeight;
            }
            let pos = hoverimg.current.getBoundingClientRect();
            if (pos.bottom > vh) {
                setImgPosition({ ...imgPosition, ...{ "max-height": "100vh" } });
            }
            if (pos.right > vw) {

                setImgPosition({ "max-width": "80vw", right: 0, top: 0 });
            }

        }
    }

    useEffect(() => {
        hoverUpdate();
    }, [imgPosition]);

    const makePost = async (event) => {
        event.preventDefault();
        if (form.text == "" && !file) {
            setError("Post cannot be empty");
            return;
        }
        const uploadData = new FormData();
        uploadData.append('thread', params.id);
        uploadData.append('name', props.state.username);
        uploadData.append('text', form.text);
        if (file) {
            uploadData.append('image', file, file.name);
        }
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
        updateForm({ text: "" });
        setError(null);
        populate();
    }

    const populate = async () => {
        const response = await fetch(`/rest/getthread/${params.id}/`, {
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
        const regex = />>[0-9]+/g;
        for (let i = 0; i < loaded.length; i++) {
            if (loaded[i].text) {
                const rs = [...loaded[i].text.matchAll(regex)];
                for (let j = 0; j < rs.length; j++) {
                    const rid = rs[j][0].slice(2);
                    const found = loaded.indexOf(loaded.find((element) => { return element.id == rid }));
                    loaded[found].replies.push(loaded[i].id);
                }
            }

        }
        console.log(loaded);
        setPosts(loaded);
    }

    useEffect(() => {
        populate();
    }, []);

    const getreplies = (id) => {
        const rs = posts.find((element) => { return element.id == id }).replies;
        return rs.map((r) =>
            <a className="link-offset-2 link-underline link-underline-opacity-0 col-auto px-1"
                onClick={() => {
                    const found = posts.indexOf(posts.find((element) => { return element.id == r }));
                    if (postRef.current.children[found]) {
                        postRef.current.children[found].scrollIntoView()
                        setFocus(r);
                    }
                }} >&gt;&gt;{r}</a>
        )
    }

    const postslist = posts.map((post) =>

        <div className="row mx-1">
            <div className={(post.id == focus) ? "col-auto border-0 bg-primary rounded-0  m-1 bg-opacity-25 p-0" : "col-auto border-0 bg-secondary rounded-0  m-1 bg-opacity-25 p-0"} key={post.id}>
                <div class="container m-0 p-0">
                    <div class="row bg-transparent border-bottom m-0 py-0 px-1">
                        <span className="col-auto px-1 fw-bold " >{post.name}</span>
                        <span className="col-auto px-1">{post.date.toLocaleString({ timestyle: "long" })}</span>
                        <a className="lh col-auto px-1"
                            onClick={() => {
                                updateForm({ text: form.text += (">>" + post.id + "\r\n") });
                                replywindow.current.scrollIntoView()
                            }} >No.{post.id}</a>
                        {getreplies(post.id)}

                    </div>
                    <div className="row m-1">
                        {post.img && <div className="col-1 m-1 p-0"
                            onMouseEnter={(e) => hoverInit(e, post.img)}
                            onMouseLeave={() => setHover(null)}
                        >

                            <img class="img-fluid" src={post.img} />
                        </div>}
                        <div className="col-auto m-1 p-0 data">
                            <span class="card-text " >
                                {reactStringReplace(post.text, /(>>[0-9]+)/g, (match, i) => (
                                    <a className="link-offset-0 link-underline link-underline-opacity-100 col-auto px-1"
                                        key={i}
                                        onClick={() => {
                                            console.log(match);
                                            const found = posts.indexOf(posts.find((element) => { return element.id == match.slice(2) }));
                                            if (postRef.current.children[found]) {
                                                postRef.current.children[found].scrollIntoView()
                                                setFocus(match.slice(2));
                                            }
                                        }}>{match}</a>
                                ))}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

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

    return (
        <>
            {hover &&
                <img ref={hoverimg} src={hover} style={{ position: 'fixed', ...imgPosition }} className="z-3" />
            }
            <div className="container-fluid z-1 position-relative">
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
                        }}>Reply to Thread</button>
                    </div>
                </div>
                <hr class="m-1" />
                <div class="row">
                    <div class="col-1">
                        [<Link class="link-offset-2 link-underline link-underline-opacity-0" to="/b">Catalog</Link>]

                        [<Link class="link-offset-2 link-underline link-underline-opacity-0" onClick={scrollToBottom}>Bottom</Link>]
                    </div>
                </div>
                <hr class="m-1" />
                <div ref={postRef}>
                    {postslist}
                </div>
                <hr class="m-1" />
                <div class="row">
                    <div class="col-1">
                        [<Link class="link-offset-2 link-underline link-underline-opacity-0" to="/b">Catalog</Link>]

                        [<Link class="link-offset-2 link-underline link-underline-opacity-0" onClick={scrollToTop}>Top</Link>]
                    </div>
                </div>
                <hr class="m-1" />
                <div className="row d-flex justify-content-center m-0">
                    <div className="col-3 m-0 p-0">
                        <form onSubmit={makePost} className="container bg-secondary bg-opacity-25 border border-1 border-white rounded-0 m-0 p-0">
                            <div className="row m-0">
                                <h6 className="m-0">Reply to thread No.{params.id}</h6>
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
        </>
    );
}
export default Thread;