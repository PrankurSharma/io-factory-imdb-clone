Thank you for visiting this project.

This project is a part of assignment for the role of Front End Developer at IO Factory.

Tech Stack: ReactJS, NodeJS, MySQL, Express

Please note that the website has basic styling as the focus of this question was on the backend implementation of the problem(mentioned in the assignment document shared).

==> In order to run the project on the system:

1. Install this folder on your system.

2. Go to the client folder using command line and type the command: 
        "npm install"
   to install all the required dependencies.

3. Go to server folder using command line and type the same command.

4. Change the information about your database in the server folder(index.js file) with the credentials of the mysql connection you are using.

5. In two seperate command line terminals, type the command: 
        "npm start"

This will run the project in development mode.

==> MySQL Schema Structure

There are 5 tables used in this project in order to satisfy the relationships mentioned in the assignment. 

Table 1: movies

Query:

CREATE TABLE `movies` (
  `movie_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `year` int(11) NOT NULL,
  `plot` varchar(200) NOT NULL,
  `poster` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`movie_id`)
);

movie_id(Primary Key, Auto increment)(INT)  |  name(VARCHAR(45))  | year(INT)  | plot(VARCHAR(200))  | poster(VARCHAR(200))

Table 2: actors

Query: 

CREATE TABLE `actors` (
  `actor_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `gender` varchar(15) NOT NULL,
  `dob` date NOT NULL,
  `bio` varchar(200) NOT NULL,
  PRIMARY KEY (`actor_id`)
);

actor_id(Primary Key, Auto increment)(INT)  |  name(VARCHAR(45))  |  gender(VARCHAR(15))  |  dob(DATE)  |  bio(VARCHAR(200))

Table 3: producers

Query:

CREATE TABLE `producers` (
  `producer_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `gender` varchar(15) NOT NULL,
  `dob` date NOT NULL,
  `bio` varchar(200) NOT NULL,
  PRIMARY KEY (`producer_id`)
);

producer_id(Primary Key, Auto increment)(INT)  |  name(VARCHAR(45))  |  gender(VARCHAR(15))  |  dob(DATE)  |  bio(VARCHAR(200))

Table 4: movie_actor --> Junction table of movies and actors (Many-to-Many Relationship)

Query:

CREATE TABLE `movie_actor` (
  `movie_id` int(11) NOT NULL,
  `actor_id` int(11) NOT NULL,
  PRIMARY KEY (`movie_id`,`actor_id`),
  KEY `movie_id_idx` (`movie_id`),
  KEY `actor_id_idx` (`actor_id`),
  CONSTRAINT `actor_id` FOREIGN KEY (`actor_id`) REFERENCES `actors` (`actor_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

1. Movies can have multiple actors
2. Actors can act in multiple movies

movie_id: foreign key that references movies table with the column movie_id
actor_id: foreign key that references actors table with the column actor_id
Both movie_id and actor_id are set as primary keys as even though one of the values can be same for two rows of database, but both should not be the same in two . This is a perfect example of normalization of the database.  

movie_id(INT)  |  actor_id(INT)

Table 5: movie_producer --> Junction table of movies and producers(One-to-One and One-to-Many Relationship)

Query:

CREATE TABLE `movie_producer` (
  `movie_id` int(11) NOT NULL,
  `producer_id` int(11) NOT NULL,
  PRIMARY KEY (`movie_id`),
  KEY `producer_id` (`producer_id`),
  CONSTRAINT `producer_id` FOREIGN KEY (`producer_id`) REFERENCES `producers` (`producer_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

1. One movie can have one producer.
2. One producer can produce multiple movies.

producer_id: foreign key that references producers table with the column producer_id
movie_id has been set as primary key such that a movie comes for a single time in the database and producer can have similar values more than once. Again normalization takes place.

movie_id(Primary Key)(INT)  |  producer_id(INT)