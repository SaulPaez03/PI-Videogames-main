import { GET_ALL_VIDEOGAMES, GET_VIDEOGAME_DETAILS } from "../actions";

const initialState = {
	videogames: [],
	videogameDetails: {},
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case GET_ALL_VIDEOGAMES:
			return { ...state, videogames: payload };
		case GET_VIDEOGAME_DETAILS:
			return { ...state, videogameDetails: payload };
		default:
			return state;
	}
};
