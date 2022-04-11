import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearVideogameDetails, getVideogameDetails } from "../redux/actions";
import { Link } from "react-router-dom";
import Style from "./Styles/VideogameDetails.module.css";
const {
	wrapper,
	innerWrapper,
	content,
	descriptionText,
	platoformsWrapper,
	goBack,
} = Style;
export default function VideogameDetails({ videogameID: id }) {
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
	}, [dispatch, id]);
	return (
		<div
			id={wrapper}
			style={{
				backgroundImage: `url(${background_image})`,
				backgroundSize: "cover",
				backgroundPosition: "center center",
			}}
		>
			<div id={content}>
				<Link to="/videogames">
					<button id={goBack}>Go back</button>
				</Link>
				<h1>{name}</h1>
				<p className={descriptionText}>{description}</p>
				<div id={platoformsWrapper}>
					<p>
						Available on: <br />
						{platforms?.map((platform, index) => {
							let last =
								index !== platforms.length - 1 ? "," : "";
							return ` ${platform}${last}`;
						})}
					</p>
				</div>
				<div id={innerWrapper}>
					<p>Rating : {rating}/5</p>
					<p>
						Genres :
						{genres?.map((genre, index) => {
							let last = index !== genres.length - 1 ? "," : "";
							return ` ${genre}${last}`;
						})}
					</p>
					<p>Release date: {released}</p>
				</div>
			</div>
		</div>
	);
}
