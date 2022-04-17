import axios from "axios";

export const GET_ALL_VIDEOGAMES = "GET_ALL_VIDEOGAMES",
	GET_VIDEOGAME_DETAILS = "GET_VIDEOGAME_DETAILS",
	SEARCH_VIDEOGAMES = "SEARCH_VIDEOGAMES",
	GET_ALL_GENRES = "GET_ALL_GENRES",
	CLEAR_SEARCH_RESULTS = "CLEAR_SEARCH_RESULTS",
	CLEAR_VIDEOGAMES_DETAILS = "CLEAR_VIDEOGAMES_DETAILS",
	CLEAR_ALL_VIDEOGAMES = "CLEAR_ALL_VIDEOGAMES";
export const getAllVideogames = () => {
	return async (dispatch) => {
		try {
			const r = await axios.get(`http://localhost:3001/videogames`);
			const results = r.data;
			dispatch({ type: GET_ALL_VIDEOGAMES, payload: results });
		} catch (e) {
			console.log(e);
		}
	};
};
export const getVideogameDetails = (videogameId) => async (dispatch) => {
	const r = await axios.get(`http://localhost:3001/videogame/${videogameId}`);
	const results = r.data;
	return dispatch({ type: GET_VIDEOGAME_DETAILS, payload: results });
};
export const getVideogamesByName = (name) => async (dispatch) => {
	try {
		const r = await axios.get(
			`http://localhost:3001/videogames?name=${name}`
		);
		const results = r.data;
		dispatch({ type: SEARCH_VIDEOGAMES, payload: results });
	} catch (e) {
		console.log(e);
	}
};

export const getAllGenres = () => async (dispatch) => {
	try {
		const r = await axios.get(`http://localhost:3001/genres`);
		const results = r.data.map((genre) => genre.name);
		dispatch({ type: GET_ALL_GENRES, payload: results });
	} catch (e) {
		console.log(e);
	}
};
export const clearSearchResults = () => ({ type: CLEAR_SEARCH_RESULTS });

export const clearVideogameDetails = () => ({ type: CLEAR_VIDEOGAMES_DETAILS });

export const clearAllVideogames = () => ({ type: CLEAR_ALL_VIDEOGAMES });
