const { default: axios } = require("axios");
const { Genre } = require("../db");
const { API_KEY } = process.env;

module.exports = {
	async getAllGenres(req, res) {
		try {
			let genres = await Genre.findAll({ attributes: ["name"] });
			if (!genres.length) {
				let url = `https://api.rawg.io/api/genres?key=${API_KEY}`;
				genres = await axios.get(url);
				genres = genres.data.results.map((result) => ({
					name: result.name,
				}));
				await Genre.bulkCreate(genres);
			}
			res.json(genres);
		} catch (error) {
			console.log(error);
		}
	}
	// getAllGenres(req, res) {
	// 	Genre.findAll({ attributes: ["name"] }).then((r) => {
	// 		if (!r.length) {
	// 			let url = `https://api.rawg.io/api/genres?key=${API_KEY}`;
	// 			axios.get(url).then((r) => {
	// 				let results = r.data.results.map((videogame) => ({
	// 					name: videogame.name,
	// 				}));
	// 				Genre.bulkCreate(results).then(() => {
	// 					Genre.findAll({ attributes: ["name"] }).then((r) => {
	// 						console.log("created");
	// 						return res.json(r);
	// 					});
	// 				});
	// 			});
	// 		} else {
	// 			console.log("already created");
	// 			return res.json(r);
	// 		}
	// 	});
	// },
};
