const { Router } = require("express");
const { getAllGenres } = require("../controllers/genresControllers");

const genres = Router();

genres.get("/", getAllGenres);

module.exports = genres;
