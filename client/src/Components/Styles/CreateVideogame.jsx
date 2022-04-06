import axios from "axios";
import React, { version } from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGenres } from "../../redux/actions";

const errorSnippet = {
	error: false,
	msg: "",
};
export default function CreateVideogame() {
	const dispatch = useDispatch();
	const genres = useSelector((state) => state.genres);

	const [name, setName] = useState("");
	const [nameError, setNameError] = useState({ ...errorSnippet });

	const [description, setDescription] = useState("");
	const [rating, setRating] = useState(0);

	const [release, setRelease] = useState("2000-01-01");

	const [selectedGenres, setSelectedGenres] = useState([]);
	const [selectedGenresError, setSelectedGenresError] =
		useState(errorSnippet);
	const [newGenre, setNewGenre] = useState("");
	const [genreError, setGenreError] = useState({ ...errorSnippet });

	const [platforms, setPlatforms] = useState([]);
	const [platformsError, setPlatformsError] = useState(errorSnippet);
	const [newPlatform, setNewPlatform] = useState("");
	const [platformError, setPlaformError] = useState({ ...errorSnippet });

	useEffect(() => {
		dispatch(getAllGenres());
	}, []);
	useEffect(() => {
		if (genreError.err) {
			alert(genreError.msg);
		}
	}, [genreError]);
	useEffect(() => {
		if (platformError.err) {
			alert(platformError.msg);
		}
	}, [platformError]);

	useEffect(() => {
		validateSelectedGenres();
	}, [selectedGenres]);

	useEffect(() => {
		validatePlatforms();
	}, [platforms]);

	const handleNameChange = (name) => {
		validateName(name);
		setName(name);
	};

	const validateName = (name) => {
		if (name === "") {
			setNameError({
				err: true,
				msg: "Name cannot be empty!",
			});
			return false;
		}
		setNameError({
			err: false,
			msg: "",
		});
		return true;
	};

	const handleRatingchange = (value) => {
		if (value < 0) value = 0;
		if (value > 5) value = 5;
		setRating(value);
	};

	const handleGenreAdd = (event) => {
		event.preventDefault();
		if (validateNewGenre()) setSelectedGenres((old) => [...old, newGenre]);
		setNewGenre("");
	};
	const validateNewGenre = () => {
		if (selectedGenres.includes(newGenre)) {
			setGenreError({
				err: true,
				msg: "Can't add the same value twice",
			});
			return false;
		}
		setGenreError({
			err: false,
			msg: "",
		});
		return true;
	};

	const handlePlatformAdd = (event) => {
		event.preventDefault();
		if (validateNewPlatform()) {
			setPlatforms((old) => [...old, newPlatform]);
		}
		setNewPlatform("");
	};
	const validateNewPlatform = () => {
		if (platforms.includes(newPlatform)) {
			setPlaformError({
				err: true,
				msg: "Can't add the same value twice",
			});
			return false;
		}
		setPlaformError({
			err: false,
			msg: "",
		});
		return true;
	};

	const removeGenre = (toDeleteGenre, event) => {
		event.preventDefault();
		let aux = [...selectedGenres];
		aux = aux.filter((genre) => genre !== toDeleteGenre);
		setSelectedGenres(aux);
	};

	const removePlatform = (toDeletePlatform, event) => {
		event.preventDefault();
		let aux = [...platforms];
		aux = aux.filter((platform) => platform !== toDeletePlatform);
		setPlatforms(aux);
	};

	const handleCreate = async (event) => {
		event.preventDefault();
		if (validateAll()) {
			const posted = await axios.post("http://localhost:3001/videogame", {
				name,
				description,
				rating,
				released: release,
				genres: selectedGenres,
				platforms,
			}).data;
			console.log(posted);
		}
	};
	const validateAll = () => {
		return (
			validateName(name) &&
			validateSelectedGenres() &&
			validatePlatforms()
		);
	};
	const validateSelectedGenres = () => {
		if (!selectedGenres.length) {
			setSelectedGenresError({
				err: true,
				msg: "Must select at least one genre",
			});
			return false;
		}
		setSelectedGenresError(errorSnippet);
		return true;
	};
	const validatePlatforms = () => {
		if (!platforms.length) {
			setPlatformsError({
				err: true,
				msg: "Must select at least one platform",
			});
			return false;
		}
		setPlatformsError(errorSnippet);
		return true;
	};
	return (
		<div>
			<form action="">
				<label htmlFor="name">Name:</label>
				<input
					type="text"
					name="name"
					id="name"
					value={name}
					onChange={(e) => handleNameChange(e.target.value)}
				/>
				{nameError.err && <span>{nameError.msg}</span>}
				<span></span>
				<br />
				<label htmlFor="description">Description:</label>
				<input
					type="text"
					name="description"
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<br />
				<label htmlFor="rating">Rating:</label>
				<input
					type="number"
					name="rating"
					id="rating"
					min={0}
					max={5}
					step={0.1}
					value={rating}
					onChange={(e) => handleRatingchange(e.target.value)}
				/>

				<br />
				<label htmlFor="release">Release date:</label>
				<input
					type="date"
					name="release"
					id="release"
					value={release}
					onChange={(e) => setRelease(e.target.value)}
				/>
				<br />

				<label htmlFor="genres">Add a genre</label>
				<select
					name="genres"
					id="genres"
					value={newGenre}
					onChange={(e) => setNewGenre(e.target.value)}
				>
					<option value="" hidden>
						Select a genre
					</option>
					{genres.map((genre) => {
						return (
							<option value={genre} key={genre}>
								{genre}
							</option>
						);
					})}
				</select>

				{newGenre && (
					<button onClick={(e) => handleGenreAdd(e)}>Add</button>
				)}
				<br />
				<label htmlFor="genresList">Genres:</label>
				{selectedGenresError.err && (
					<span>{selectedGenresError.msg}</span>
				)}
				<ul id="genresList" name="genresList">
					{selectedGenres.map((genre) => {
						return (
							<li key={genre}>
								{genre}{" "}
								<button onClick={(e) => removeGenre(genre, e)}>
									X
								</button>
								<div></div>
							</li>
						);
					})}
				</ul>

				<br />
				<label htmlFor="platforms">Add a Platform</label>

				<input
					name="platforms"
					id="platforms"
					type="text"
					value={newPlatform}
					onChange={(e) => setNewPlatform(e.target.value)}
				/>
				{newPlatform && (
					<button onClick={(e) => handlePlatformAdd(e)}>Add</button>
				)}

				<br />
				<label htmlFor="platformsList">Platforms:</label>
				{platformsError.err && (
					<div>
						<span>{platformsError.msg}</span> <br />
					</div>
				)}
				<ul id="platformsList" name="platformsList">
					{platforms.map((platform, index) => {
						return (
							<li key={platform + index}>
								{platform}
								<button
									onClick={(e) => removePlatform(platform, e)}
								>
									x
								</button>
							</li>
						);
					})}
				</ul>

				<button onClick={(e) => handleCreate(e)}>Create!</button>
			</form>
		</div>
	);
}
