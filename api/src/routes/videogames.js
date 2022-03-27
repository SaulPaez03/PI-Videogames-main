const { Router } = require("express");
const {
	getAllVideoGames,
	getVideogameInfo,
	setNewVideogame,
} = require("../controllers/videogamesControllers");

const videogames = Router();

videogames.get("/", getAllVideoGames);
videogames.get("/:idVideogame", getVideogameInfo);
videogames.put("/", setNewVideogame);

module.exports = videogames;
