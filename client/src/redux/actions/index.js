import axios from "axios";

export const GET_ALL_VIDEOGAMES = "GET_ALL_VIDEOGAMES",
	GET_VIDEOGAME_DETAILS = "GET_VIDEOGAME_DETAILS";
export const getAllVideogames = () => {
	return async (dispatch) => {
		const r = await axios.get(`http://localhost:3001/videogames`);
		const results = r.data;
		dispatch({ type: GET_ALL_VIDEOGAMES, payload: results });
	};
};
export const getVideogameDetails = (videogameId) => async (dispatch) => {
	const r = await axios.get(
		`http://localhost:3001/videogames/${videogameId}`
	);
	const results = r.data;
	return dispatch({ type: GET_VIDEOGAME_DETAILS, payload: results });
};
