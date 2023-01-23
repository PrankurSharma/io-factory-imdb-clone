import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import FetchMovies from "./FetchMovies";

function AddMovie({ fetch }) {

    const [movie_id, set_movieid] = useState("");
    const [actors, set_actors] = useState([]);
    const [producers, set_producers] = useState([]);

    const [newmname, set_newmname] = useState("");
    const [newmyear, set_newmyear] = useState("");
    const [newmplot, set_newmplot] = useState("");

    const [newname, set_newname] = useState("");
    const [newgender, set_newgender] = useState("");
    const [newdate, set_newdate] = useState("");
    const [newbio, set_newbio] = useState("");

    const [newpname, set_newpname] = useState("");
    const [newpgender, set_newpgender] = useState("");
    const [newpdate, set_newpdate] = useState("");
    const [newpbio, set_newpbio] = useState("");


    const [otheractor, set_otheractor] = useState(false);
    const [otherproducer, set_otherproducer] = useState(false);

    const [selectedactors, set_selectedactors] = useState([]);
    const [selectedproducers, set_selectedproducers] = useState({});

    const [shouldgetid, set_shouldgetid] = useState(false);
    const [shouldget, set_shouldget] = useState(false);

    const [setp, set_setp] = useState(false);

    const isMounted1 = useRef(false);
    const isMounted2 = useRef(false);

    useEffect(() => {
        Axios.get('http://localhost:3001/api/getActors').then((response) => {
            set_actors(response.data);
        });
    }, [selectedactors]);

    useEffect(() => {
        Axios.get('http://localhost:3001/api/getProducer').then((response) => {
            set_producers(response.data);
        });
    }, [selectedproducers]);

    useEffect(() => {
        if (isMounted1.current) {
            Axios.post('http://localhost:3001/api/getmovieid', {
                newmname: newmname,
                newmyear: newmyear,
                newmplot: newmplot
            }).then((response) => {
                set_movieid(response.data[0].movie_id);
                set_shouldget((val) => !val);
            });
        }
        else {
            isMounted1.current = true;
        }
    }, [shouldgetid]);

    useEffect(() => {
        if (isMounted2.current) {
            for (const dataObj of selectedactors) {
                Axios.post('http://localhost:3001/api/actmov', {
                    movie_id: movie_id,
                    actor_id: dataObj.actor_id
                }).then((response) => {
                    console.log(response);
                });
            }

            Axios.post('http://localhost:3001/api/prodmov', {
                movie_id: movie_id,
                producer_id: selectedproducers.producer_id
            }).then((response) => {
                alert("Movie Added Successfully.");
                set_newmname("");
                set_newmyear("");
                set_newmplot("");
                set_newname("");
                set_newgender("");
                set_newbio("");
                set_newdate("");
                set_newpname("");
                set_newpgender("");
                set_newpbio("");
                set_newpdate("");
                set_selectedactors([]);
                set_selectedproducers({});
                set_setp(false);
            });
        }
        else {
            isMounted2.current = true;
        }
    }, [shouldget]);

    function insertActor() {
        if (newname !== "" && newname !== "Select" && newgender !== "" && newgender !== "Select" && newdate !== "" && newbio !== "") {
            set_otheractor(false);
            Axios.post('http://localhost:3001/api/addactor', {
                newname: newname,
                newgender: newgender,
                newdate: newdate,
                newbio: newbio
            }).then((response) => {
                set_selectedactors((list) => [...list, { actor_id: response.data[0].actor_id, name: response.data[0].name }]);
            });
        }
        else {
            alert("Please fill all the fields in order to add the actor.");
        }
    }

    function insertProducer() {
        if (newpname !== "" && newpname !== "Select" && newpgender !== "Select" && newpgender !== "" && newpdate !== "" && newpbio !== "") {
            set_otherproducer(false);
            set_setp(true);
            Axios.post('http://localhost:3001/api/addproducer', {
                newpname: newpname,
                newpgender: newpgender,
                newpdate: newpdate,
                newpbio: newpbio
            }).then((response) => {
                set_selectedproducers({ producer_id: response.data[0].producer_id, name: response.data[0].name });
            });
        }
        else {
            alert("Please fill all the fields in order to add the producer.");
        }
    }

    function insertMovie() {
        if (newmname !== "" && newmplot !== "" && newmyear !== "" && selectedactors.size !== 0 && selectedproducers.size !== 0) {
            Axios.post('http://localhost:3001/api/insertmovie', {
                newmname: newmname,
                newmyear: newmyear,
                newmplot: newmplot,
            }).then((response) => {
                console.log(response);
                set_shouldgetid((should) => !should);
            });
        }
        else if (selectedactors.size === 0) {
            alert("Add an actor in order to proceed.");
        }
        else if (selectedproducers.size === 0) {
            alert("Add a producer in order to proceed.");
        }
        else {
            alert("Please fill all the details of the movie.");
        }
    }

    return (
        <div className="App">
            {fetch ? <><h1> Add Movie </h1>
                <h1> Add Movie Details </h1>
                <input placeholder="Name of the movie" value={newmname} onChange={(e) => {
                    set_newmname(e.target.value);
                }} />
                <input placeholder="Year of Release" value={newmyear} onChange={(e) => {
                    set_newmyear(e.target.value);
                }} />
                <input placeholder="Plot" value={newmplot} onChange={(e) => {
                    set_newmplot(e.target.value);
                }} />
                <h1> Add Actor Details </h1>
                {selectedactors.size !== 0 ? selectedactors.map((val) => {
                    return (
                        <h2 key={val.name}> {val.name} </h2>
                    );
                }) : null}
                <div className="addactor">
                    <p> Select the actor name from below dropdown list. Select "Other" if the name is not available </p>
                    <select onChange={(e) => {
                        e.target.value === "Other" ? set_otheractor(true) : set_selectedactors((list) => [...list, { actor_id: e.target.value.charAt(0), name: e.target.value.substring(2) }]);
                        e.target.value !== "Other" && set_otheractor(false);
                        e.target.value !== "Other" && set_newname(e.target.value);
                    }} value={newname}>
                        <option> Select </option>
                        <option> Other </option>
                        {actors.map((val) => {
                            return (
                                <option key={val.name}> {val.actor_id} {val.name} </option>
                            );
                        })}
                    </select>
                    {otheractor ? (
                        <>
                            <input placeholder="Name of the actor" onChange={(e) => {
                                set_newname(e.target.value);
                            }} />
                            <select placeholder="Gender" onChange={(e) => {
                                set_newgender(e.target.value);
                            }}>
                                <option> Select </option>
                                <option> Male </option>
                                <option> Female </option>
                                <option> Transgender </option>
                            </select>
                            <input placeholder="Date of birth"
                                type="date"
                                name="date"
                                value={newdate}
                                inputlabelprops={{
                                    shrink: true,
                                }} onChange={(e) => {
                                    set_newdate(e.target.value);
                                }} />
                            <input placeholder="Bio" onChange={(e) => {
                                set_newbio(e.target.value);
                            }} />
                            <button onClick={() => {
                                insertActor();
                            }}> Add Actor </button>
                        </>
                    ) : null}
                </div>
                <h1> Add Producer Details </h1>
                {Object.keys(selectedproducers).length !== 0 ?
                    <h2 key={selectedproducers.name}> {selectedproducers.name} </h2> : null}
                {!setp ? (<div className="addproducer" >
                    <p> Select the producer name from below dropdown list. Select "Other" if the name is not available </p>
                    <select onChange={(e) => {
                        e.target.value === "Other" ? set_otherproducer(true) : set_selectedproducers({ producer_id: e.target.value.charAt(0), name: e.target.value.substring(2) });
                        e.target.value !== "Other" && set_otherproducer(false);
                    }} value={newpname}>
                        <option> Select </option>
                        <option> Other </option>
                        {producers.map((val) => {
                            return (
                                <option key={val.name}> {val.producer_id} {val.name} </option>
                            );
                        })}
                    </select>
                    {otherproducer ? (
                        <>
                            <input placeholder="Name of the producer" onChange={(e) => {
                                set_newpname(e.target.value);
                            }} />
                            <select placeholder="Gender" onChange={(e) => {
                                set_newpgender(e.target.value);
                            }}>
                                <option> Select </option>
                                <option> Male </option>
                                <option> Female </option>
                                <option> Transgender </option>
                            </select>
                            <input placeholder="Date of birth"
                                type="date"
                                name="date"
                                value={newpdate}
                                inputlabelprops={{
                                    shrink: true,
                                }} onChange={(e) => {
                                    set_newpdate(e.target.value);
                                }} />
                            <input placeholder="Bio" onChange={(e) => {
                                set_newpbio(e.target.value);
                            }} />
                            <button onClick={() => {
                                insertProducer();
                            }}> Add Producer </button>
                        </>
                    ) : null}
                </div>) : null}
                <button onClick={insertMovie}> Add Movie </button></> : <FetchMovies />}
        </div>
    );
}

export default AddMovie;