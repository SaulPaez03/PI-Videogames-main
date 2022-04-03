let { Router } = require("express");
const {
	getVideogameInfo,
	setNewVideogame,
} = require("../controllers/videogameController");

// import all controllers
// import SessionController from './app/controllers/SessionController';

const videogame = new Router();

// Add routes
// routes.get('/', SessionController.store);
// routes.post('/', SessionController.store);
// routes.put('/', SessionController.store);
// routes.delete('/', SessionController.store);
videogame.get("/:idVideogame", getVideogameInfo);
videogame.post("/", setNewVideogame);

module.exports = videogame;
