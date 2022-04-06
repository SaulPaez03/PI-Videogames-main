import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearVideogameDetails, getVideogameDetails } from "../redux/actions";
import { Link } from "react-router-dom";
export default function VideogameDetails({ videogameID: id }) {
	<button></button>;
	const dispatch = useDispatch();
	const {
		name,
		background_image,
		description,
		released,
		rating,
		genres,
		platforms,
	} = useSelector((state) => state.videogameDetails);
	useEffect(() => {
		dispatch(getVideogameDetails(id));
		return () => {
			dispatch(clearVideogameDetails());
		};
	}, []);
	return (
		<div>
			<Link to="/videogames">
				<button>Go back</button>
			</Link>
			<h3>{name}</h3>
			<img style={{ width: "70%" }} src={background_image} alt="" />
			<p>{description}</p>
			<p>
				Genres :
				{genres?.map((genre, index) => {
					let last = index !== genres.length - 1 ? "," : "";
					return ` ${genre}${last}`;
				})}
			</p>
			<p>Release date: {released}</p>
			<p>Rating : {rating}/5</p>
			<p>
				Available on:
				{platforms?.map((platform, index) => {
					let last = index !== platforms.length - 1 ? "," : "";
					return ` ${platform}${last}`;
				})}
			</p>
		</div>
	);
}
