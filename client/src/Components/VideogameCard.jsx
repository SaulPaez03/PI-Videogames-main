import React from "react";
import { Link } from "react-router-dom";
import style from "./Styles/VideogameCard.module.css";
export const VideogameCard = ({ id, genres, name, background_image }) => {
	let { image, wrapper } = style;
	return (
		<div id={wrapper}>
			<img
				src={background_image}
				alt={`${name}_background_image`}
				className={image}
			/>
			<h5>{name}</h5>
			<span> Genres:{genres.join(",")}</span>
			<Link to={`/videogames/${id}`}> Details</Link>
		</div>
	);
};
