const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
//const session = require('express-session');
//const mysqlStore = require('express-mysql-session')(session);
var port = process.env.PORT || 3001;

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'prankursharma',
    database: 'imdbclone',
});

/*const options = {
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.DB_USER,
    host: process.env.DB_HOST,
    createDatabaseTable: true
}*/

/*const pool = mysql.createPool(options);

const sessionStore = new mysqlStore(options, pool);*/

app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.set('trust proxy', 1);

/*app.use(session({
    name: process.env.SESS_NAME,
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
        secure: process.env.NODE_ENV == 'production' ? true : false,
        sameSite: 'none'
    }
}));*/

app.get('/api/getDetails', (req, res) => {
    //const sqlSelect = "select m.name, m.year, m.plot, m.poster, a.name, a.gender, a.dob, a.bio from movies m left join movie_actor ma on m.movie_id = ma.movie_id right join actors a on a.actor_id = ma.actor_id";

    const sqlSelect = "select * from movies";
    db.query(sqlSelect, (err, result) => {
        console.log(result);
        res.send(result);
    });
});

app.post('/api/getDetailsActors', (req, res) => {
    const movie_id = req.body.movieid;
    const sqlSelect = "select * from actors where actor_id in (select actor_id from movie_actor where movie_id = ?)";
    db.query(sqlSelect, movie_id, (err, result) => {
        res.send(result);
    });
});

app.post('/api/getDetailsProducer', (req, res) => {
    const movie_id = req.body.movieid;
    const sqlSelect = "select * from producers where producer_id in (select producer_id from movie_producer where movie_id = ?)";
    db.query(sqlSelect, movie_id, (err, result) => {
        res.send(result);
    });
});

app.put('/api/updateDetails', (req, res) => {
    const movie_id = req.body.movieid;
    const name = req.body.newname;
    const year = req.body.newyear;
    const plot = req.body.newplot;
    const sqlUpdate = "update movies set name = ?, year = ?, plot = ? where movie_id = ?";
    db.query(sqlUpdate, [name, year, plot, movie_id], (err, result) => {
        res.send(result);
    });
});

app.get('/api/getActors', (req, res) => {
    const sqlSelect = "select actor_id, name from actors";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
});

app.get('/api/getProducer', (req, res) => {
    const sqlSelect = "select producer_id, name from producers";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
});

app.post('/api/addactor', (req, res) => {
    const name = req.body.newname;
    const gender = req.body.newgender;
    const dob = req.body.newdate;
    const bio = req.body.newbio;
    const sqlInsert = "insert into actors(name, gender, dob, bio) values (?, ?, ?, ?)";
    db.query(sqlInsert, [name, gender, dob, bio], (err, result) => {
        //res.send({message: "Added"});
        const sqlSelect = "select actor_id, name from actors where name = ? and gender = ? and dob = ? and bio = ?";
        db.query(sqlSelect, [name, gender, dob, bio], (e, r) => {
            res.send(r);
        });
    });
});

app.post('/api/addproducer', (req, res) => {
    const name = req.body.newpname;
    const gender = req.body.newpgender;
    const dob = req.body.newpdate;
    const bio = req.body.newpbio;
    const sqlInsert = "insert into producers(name, gender, dob, bio) values (?, ?, ?, ?)";
    db.query(sqlInsert, [name, gender, dob, bio], (err, result) => {
        //res.send({message: "Added"});
        const sqlSelect = "select producer_id, name from producers where name = ? and gender = ? and dob = ? and bio = ?";
        db.query(sqlSelect, [name, gender, dob, bio], (e, r) => {
            res.send(r);
        });
    });
});

app.post('/api/insertmovie', (req, res) => {
    const name = req.body.newmname;
    const year = req.body.newmyear;
    const plot = req.body.newmplot;

    const sqlInsert = "insert into movies(name, year, plot) values (?, ?, ?)";
    db.query(sqlInsert, [name, year, plot], (err, result) => {
        res.send({ message: "Success" });
    });
});

app.post('/api/getmovieid', (req, res) => {
    const name = req.body.newmname;
    const year = req.body.newmyear;
    const plot = req.body.newmplot;
    const sqlSelect = "select movie_id from movies where name = ? and year = ? and plot = ?";
    db.query(sqlSelect, [name, year, plot], (e, r) => {
        res.send(r);
    });
});

app.post('/api/actmov', (req, res) => {
    const movie_id = req.body.movie_id;
    const actor_id = req.body.actor_id;
    const sqlInsert = "insert into movie_actor values (?, ?)";
    db.query(sqlInsert, [movie_id, actor_id], (err, result) => {
        res.send({ message: "Inserted" });
    });
});

app.post('/api/prodmov', (req, res) => {
    const movie_id = req.body.movie_id;
    const producer_id = req.body.producer_id;

    const sqlInsert = "insert into movie_producer values (?, ?)";
    db.query(sqlInsert, [movie_id, producer_id], (err, result) => {
        res.send({ message: "Inserted" });
    });
});

app.listen(port, () => {
    console.log('running on port ' + port);
});