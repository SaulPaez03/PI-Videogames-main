import React from "react";
import { Link } from "react-router-dom";
import style from "./Styles/VideogameCard.module.css";
import Star from "../assets/Images/Star.png";
const { image, wrapper, btn, mor_azu } = style;

export const VideogameCard = ({
	id,
	genres,
	name,
	background_image,
	rating,
}) => {
	return (
		<div id={wrapper}>
			<img
				src={background_image}
				alt={`${name}_background_image`}
				className={image}
			/>
			<div>
				<h3>{name}</h3>
				<p> Genres: {genres.join(", ")}.</p>
				<div
					style={{
						display: "flex",
						justifyContent: "space-around",
						alignItems: "center",
					}}
				>
					<div
						style={{ display: "flex", alignIntems: "flex-starts" }}
					>
						<img
							src={Star}
							style={{ width: "50px", height: "50px" }}
							alt="Star"
						/>
						<div>
							<h3> {rating}</h3>
						</div>
					</div>
					<Link to={`/videogames/${id}`}>
						<button className={`${btn} ${mor_azu}`}>DETAILS</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
