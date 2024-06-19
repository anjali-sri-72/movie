let express = require("express");
let { open } = require("sqlite");
let sqlite3 = require("sqlite3");
let path = require("path");

let app = express();
app.use(express.json());

let dbPath = path.join(__dirname, "moviesData.db");

let db = null;

let initializeDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};

initializeDb();

//API 1

app.get("/movies/", async (request, response) => {
  let moviesQuery1 = `SELECT movie_name FROM movie;`;
  let movie1 = await db.all(moviesQuery1);
  response.send(movie1);
});

//API 2

app.post("/movies/", async (request, response) => {
  let { directorId, movieName, leadActor } = request.body;
  let moviesQuery2 = `INSERT INTO 
  movie(director_id, movie_name, lead_actor) 
  VALUES ('${directorId}',
   '${movieName}',
   '${leadActor}'); `;
  let movie2 = await db.run(moviesQuery2);
  response.send("Movie Successfully Added");
});

//API 3

app.get("/movies/:movieId", async (request, response) => {
  let { movieId } = request.params;
  let moviesQuery3 = `SELECT * FROM movie WHERE movie_id = ${movieId};`;
  let movie3 = await db.get(moviesQuery3);
  response.send(movie3);
});

//API 4
app.put("/movies/:movieId", async (request, response) => {
  let { movieId } = request.params;
  let { directorId, movieName, leadActor } = request.body;
  let moviesQuery4 = `UPDATE 
  movie_name 
  SET director_id = '${directorId}',
   movie_name = '${movieName}',
   lead_actor ='${leadActor}'
   WHERE movie_id = '${movieId};`;
  let movie4 = await db.run(moviesQuery4);
  response.send("Movie Details Updated");
});

//API 5

app.delete("/movies/:movieId", async (request, response) => {
  let { movieId } = request.params;
  let moviesQuery5 = `DELETE * FROM movie WHERE movie_id = ${movieId};`;
  await db.run(moviesQuery5);
  response.send("Movie Removed");
});

//API 6

app.get("/directors/", async (request, response) => {
  let moviesQuery6 = `SELECT * FROM director;`;
  let director = await db.all(moviesQuery6);
  response.send(director);
});

//API 7

app.get("/directors/:directorId/movies/", async (request, response) => {
  let { directorId } = request.params;
  let moviesQuery7 = `SELECT movie_name FROM movie WHERE director_id = '${directorId};`;
  let director2 = await db.all(moviesQuery7);
  response.send(director2);
});

module.exports = app;
