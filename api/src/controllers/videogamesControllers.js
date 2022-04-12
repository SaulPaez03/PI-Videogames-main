const { Videogame, Genre } = require("../db");
const { Op } = require("sequelize");
const { default: axios } = require("axios");
const { API_KEY } = process.env;
async function fetchAll(url) {
	let results = [];
	const pages = [1, 2, 3, 4, 5];
	const queries = [];
	pages.forEach((page) => {
		queries.push(axios.get(url + `&page=${page}`));
	});
	await Promise.all(queries)
		.then((queryResults) => {
			queryResults.forEach((queryResult) => {
				let response = queryResult.data;
				results.push(
					...response.results.map((e) => ({
						id: e.id,
						name: e.name,
						background_image: e.background_image,
						genres: e.genres.map((r) => r.name),
						rating: e.rating,
					}))
				);
			});
		})
		.catch((error) => console.log(error));
	return results;
}

module.exports = {
	async getAllVideoGames(req, res) {
		try {
			console.log("getAllVideoGames");
			const { name } = req.query;
			if (name && typeof name == "string") {
				let DBResults = await Videogame.findAll({
					where: {
						name: {
							[Op.iLike]: `%${name}%`,
						},
					},
					include: {
						model: Genre,
						as: "genres",
						attributes: ["name"],
					},
				});
				DBResults = DBResults.map((e) => ({
					...e.dataValues,
					genres: e.dataValues.genres.map((r) => r.name),
				}));
				let apiResults = await axios.get(
					` https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`
				);

				apiResults = apiResults.data.results
					.map((r) => ({
						id: r.id,
						name: r.name,
						background_image: r.background_image,
						genres: r.genres.map((e) => e.name),
						rating: r.rating,
					}))
					.splice(0, 15);

				let results = [...DBResults, ...apiResults].splice(0, 15);
				if (results.length === 0) {
					results = { error: "There isn't any game with that name" };
				}
				return res.json(results);
			}
			let APIData = await fetchAll(
				`https://api.rawg.io/api/games?key=${API_KEY}`
			);
			let DBData = await Videogame.findAll({
				attributes: ["id", "name", "background_image", "rating"],
				include: { model: Genre, attributes: ["name"] },
			});

			DBData = DBData.map((videogame) => ({
				id: videogame.id,
				name: videogame.name,
				background_image: videogame.background_image,
				genres: videogame.genres.map((genre) => genre.name),
				rating: videogame.rating,
			}));

			results = [...APIData, ...DBData];

			res.json(results);
		} catch (error) {
			console.log(error);
		}
	},
};
