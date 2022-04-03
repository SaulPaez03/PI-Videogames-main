const { Videogame, Genre } = require("../db");
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
	// try {
	// 	const results = [];
	// 	let hasNext = false;
	// 	do {
	// 		hasNext = false;
	// 		let r = await axios.get(url);
	// 		let response = r.data;
	// 		results.push(
	// 			...response.results.map((e) => ({
	// 				id: e.id,
	// 				name: e.name,
	// 				background_image: e.background_image,
	// 				genres: e.genres.map((r) => r.name),
	// 			}))
	// 		);
	// 		if (response.next && results.length < 100) {
	// 			hasNext = true;
	// 			url = response.next;
	// 		}
	// 	} while (hasNext);
	// 	return results;
	// } catch (error) {
	// 	console.log(error);
	// }
}

module.exports = {
	async getAllVideoGames(req, res) {
		try {
			const { name } = req.query;
			if (name && typeof name == "string") {
				console.log("Searching");
				let searchResults = await axios.get(
					` https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`
				);

				searchResults = searchResults.data.results
					.map((r) => ({
						id: r.id,
						name: r.name,
						background_image: r.background_image,
						genres: r.genres.map((e) => e.name),
						rating: r.rating,
					}))
					.splice(0, 15);

				if (searchResults.length === 0) {
					results = { error: "There isn't any game with that name" };
				}
				return res.json(searchResults);
			}
			let APIData = await fetchAll(
				`https://api.rawg.io/api/games?key=${API_KEY}`
			);
			console.log(APIData.length);
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
			// console.log(error);
		}
	},
};
