const { Videogame, Genre } = require("../db");
const { default: axios } = require("axios");
const { API_KEY } = process.env;
async function fetchAll(url) {
	const results = [];
	const pages = [1, 2, 3, 4, 5];
	const queries = [];
	pages.forEach((page) => {
		queries.push(axios.get(url + `&page=${page}`));
	});
	// Promise.all(queries)
	// 	.then((queryResults) => {
	// 		console.log(queryResults.length);
	// 		queryResults.forEach((queryResult) => {
	// 			let response = queryResult.data;
	// 			results.push(
	// 				...response.results.map((e) => ({
	// 					id: e.id,
	// 					name: e.name,
	// 					background_image: e.background_image,
	// 					genres: e.genres.map((r) => r.name),
	// 				}))
	// 			);
	// 		});
	// 	})
	// 	.then(() => results)
	// 	.catch((error) => console.log(error));

	let hasNext = false;
	do {
		hasNext = false;
		let r = await axios.get(url);
		let response = r.data;
		results.push(
			...response.results.map((e) => ({
				id: e.id,
				name: e.name,
				background_image: e.background_image,
				genres: e.genres.map((r) => r.name),
			}))
		);
		if (response.next && results.length < 100) {
			hasNext = true;
			url = response.next;
		}
	} while (hasNext);
	return results;
}
function isUUID(string) {
	return /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi.test(
		string
	);
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

				searchResults = await searchResults.data.results
					.map((r) => ({
						id: r.id,
						name: r.name,
						background_image: r.background_image,
						genres: r.genres.map((e) => e.name),
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
				attributes: ["id", "name", "background_image"],
				include: { model: Genre, attributes: ["name"] },
			});
			DBData = DBData.map((videogame) => ({
				id: videogame.id,
				name: videogame.name,
				background_image: videogame.background_image,
				genres: videogame.genres.map((genre) => genre.name),
			}));

			results = [...APIData, ...DBData];

			res.json(results);
		} catch (error) {
			// console.log(error);
		}
	},
	async getVideogameInfo(req, res) {
		try {
			const { idVideogame } = req.params;
			if (!idVideogame) {
				return res.status(400).json({ error: "Id must be provided" });
			}
			if (isUUID(idVideogame)) {
				console.log("isUUID");
				let DBResults = await Videogame.findByPk(idVideogame, {
					include: Genre,
				});
				if (DBResults) {
					return res.json(DBResults);
				}
			} else {
				console.log("Fetching API");

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
						genres: APIResults.genres.map((e) => e.name),
						description: APIResults.description,
					};
					console.log(result);
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
			const { name, description, released, rating, genres, platforms } =
				req.body;
			const NewVideogame = await Videogame.create({
				name,
				description,
				released,
				rating,
				platforms,
			});
			console.log(genres);
			let genresIds = await Genre.findAll({
				attributes: ["id"],
				where: { name: genres },
			});
			NewVideogame.addGenres(genresIds);
			res.send("Succesfully created the new videogame");
		} catch (error) {
			console.log(error);
		}
	},
};
