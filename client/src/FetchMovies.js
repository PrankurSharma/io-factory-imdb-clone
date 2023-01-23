import React, { useEffect, useState } from "react";
import Axios from 'axios';
import AddMovie from "./AddMovie";

function FetchMovies() {
    const [newname, set_newname] = useState("");
    const [newyear, set_newyear] = useState("");
    const [newplot, set_newplot] = useState("");
    const [results, set_results] = useState([]);
    const [actors, set_actors] = useState([]);
    const [producer, set_producer] = useState({});
    const [show, set_show] = useState(false);
    const [add, set_add] = useState(false);

    useEffect(() => {
        Axios.get('http://localhost:3001/api/getDetails').then((response) => {
            set_results(response.data);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    function fetchCastDetails(movieid) {
            Axios.post('http://localhost:3001/api/getDetailsActors', 
            {
                movieid: movieid
            }).then((response) => {
            set_actors(response.data);
        }).catch((err) => {
            console.log(err);
        });
        Axios.post('http://localhost:3001/api/getDetailsProducer', 
        {
            movieid: movieid
        }).then((response) => {
            set_producer(response.data[0]);
        }).catch((err) => {
            console.log(err);
        });
    }

    function updateDetails(movieid) {
        if(newname === "" || newyear === "" || newplot === ""){
            alert("Please fill all the fields in order to proceed.");
        }
        else{
            Axios.put('http://localhost:3001/api/updateDetails', {
                movieid: movieid,
                newname: newname,
                newyear: newyear,
                newplot: newplot
            }).then((response) => {
                set_results(results.map((val) => {
                    return val.movie_id === movieid ? {movie_id: movieid, name: newname, year: newyear, plot: newplot} : val; 
                }));
                alert("Movie details updated successfully.");
                set_newname("");
                set_newyear("");
                set_newplot("");
            });
        }
    }

    return (
        <div className="App">
            <button onClick={() => {
                set_add(false);
            }}> Movie List </button>
            <button onClick={() => {
                set_add(true);
            }}> Add a new movie </button>
            {!add ? (<><h1> Movie List </h1>
            <div className="fetchmovies">
                {results.map((ele) => {
                    return (
                        <div className="fetchres" key={ele.movie_id}>
                            <h1> Movie Details </h1>
                            <h2> {ele.name} </h2>
                            <h2> {ele.year} </h2>
                            <h2> {ele.plot} </h2>
                            {!show && <button onClick={() => {
                        set_show((showit) => !showit);
                        fetchCastDetails(ele.movie_id);
                    }}> Show Cast Details </button>}
                    {show && (
                        <>
                            <h2> Actors </h2>
                            <div className="actors">
                                {actors.map((element) => {
                                    return (
                                        <div className="subactor" key={element.name}>
                                            <h3> {element.name} </h3>
                                            <h3> {element.gender} </h3>
                                            <h3> {element.dob} </h3>
                                            <h3> {element.bio} </h3>
                                        </div>
                                    );
                                })}
                            </div>
                            <h2> Producer Details </h2>
                            <div className="producer">
                                <h3> {producer.name} </h3>
                                <h3> {producer.gender} </h3>
                                <h3> {producer.dob} </h3>
                                <h3> {producer.bio} </h3>
                            </div>
                        </>
                    )}
                    <h2> Edit Movie Details </h2>
                            <div className="editdetails">
                                <input placeholder="Name of the movie" value={newname} onChange={(e) => {
                                    set_newname(e.target.value);
                                }}/>
                                <input placeholder="Year" value={newyear} onChange={(e) => {
                                    set_newyear(e.target.value);
                                }}/>
                                <input placeholder="Plot" value={newplot} onChange={(e) => {
                                    set_newplot(e.target.value);
                                }}/>
                                <button onClick={() => {
                                    updateDetails(ele.movie_id);
                                }}> Edit </button>
                            </div>
                        </div>
                    );
                })}
            </div></>) : <AddMovie fetch={add} />}
        </div>
    );
}

export default FetchMovies;