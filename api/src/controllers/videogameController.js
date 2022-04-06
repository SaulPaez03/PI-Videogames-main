const { Videogame, Genre } = require("../db");
const { default: axios } = require("axios");
const { API_KEY } = process.env;
function isUUID(string) {
	return /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi.test(
		string
	);
}
module.exports = {
	async getVideogameInfo(req, res) {
		try {
			const { idVideogame } = req.params;
			if (!idVideogame) {
				return res.status(400).json({ error: "Id must be provided" });
			}
			if (isUUID(idVideogame)) {
				let DBResults = await Videogame.findByPk(idVideogame, {
					include: {
						model: Genre,
						attributes: ["name"],
					},
				});
				DBResults = {
					...DBResults.dataValues,
					genres: DBResults.dataValues.genres.map(
						(genre) => genre.dataValues.name
					),
				};
				if (DBResults) {
					return res.json(DBResults);
				}
				console.log(DBResults.description);
			} else {
				let APIResults = await axios.get(
					`https://api.rawg.io/api/games/${idVideogame}?key=${API_KEY}`
				);
				APIResults = APIResults.data;
				if (APIResults.detail !== "Not found.") {
					result = {
						id: APIResults.id,
						name: APIResults.name,
						released: APIResults.released,
						rating: APIResults.rating,
						platforms: APIResults.platforms.map(
							(e) => e.platform.name
						),
						background_image: APIResults.background_image,
						genres: APIResults.genres.map((e) => e.name),
						description: APIResults.description_raw,
					};
					return res.json(result);
				}
			}
			res.status(200).json({
				result: "There isn't any videogame associated to the provided ID",
			});
		} catch (error) {
			console.log(error);
		}
	},
	async setNewVideogame(req, res) {
		try {
			let {
				name,
				description,
				released,
				rating,
				genres,
				platforms,
				background_image,
			} = req.body;
			if (background_image === undefined) {
				background_image =
					"https://images.pexels.com/photos/596750/pexels-photo-596750.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";
			}
			const NewVideogame = await Videogame.create({
				name,
				description,
				released,
				rating,
				platforms,
				background_image,
			});
			let genresIds = await Genre.findAll({
				attributes: ["id"],
				where: { name: genres },
			});
			console.table(genresIds);
			NewVideogame.addGenres(genresIds);
			res.send("Succesfully created the new videogame");
		} catch (error) {
			console.log(error);
		}
	},
};
