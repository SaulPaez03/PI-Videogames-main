const { Router } = require("express");
const { getAllVideoGames } = require("../controllers/videogamesControllers");

const videogames = Router();

videogames.get("/", getAllVideoGames);

module.exports = videogames;
