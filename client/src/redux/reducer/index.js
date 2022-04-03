import {
	CLEAR_SEARCH_RESULTS,
	CLEAR_VIDEOGAMES_DETAILS,
	GET_ALL_GENRES,
	GET_ALL_VIDEOGAMES,
	GET_VIDEOGAME_DETAILS,
	SEARCH_VIDEOGAMES,
} from "../actions";

const initialState = {
	videogames: [],
	videogameDetails: {},
	searchResults: [],
	genres: [],
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case GET_ALL_VIDEOGAMES:
			return { ...state, videogames: payload };
		case GET_VIDEOGAME_DETAILS:
			return { ...state, videogameDetails: payload };
		case CLEAR_VIDEOGAMES_DETAILS:
			return { ...state, videogameDetails: {} };

		case SEARCH_VIDEOGAMES:
			return { ...state, searchResults: payload };
		case CLEAR_SEARCH_RESULTS:
			return { ...state, searchResults: [] };
		case GET_ALL_GENRES:
			return { ...state, genres: payload };
		default:
			return state;
	}
};
