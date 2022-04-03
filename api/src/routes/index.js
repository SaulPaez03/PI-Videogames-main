const { Router } = require("express");
const genres = require("./genres");
const videogame = require("./videogame");
const videogames = require("./videogames");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/videogames", videogames);
router.use("/videogame", videogame);
router.use("/genres", genres);

module.exports = router;
