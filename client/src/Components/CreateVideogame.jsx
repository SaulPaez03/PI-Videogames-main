import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGenres } from "../redux/actions";

import {
	wrapper,
	goBack,
	form,
	paralel,
	inputBox,
	nameInput,
	descriptionInput,
	halfWidth,
	error,
	notError,
	create,
	vinAzu,
	azuFuc,
	nameErrorClass,
} from "./Styles/CreateVideogame.module.css";

const errorSnippet = {
	err: false,
	msg: "",
};
export default function CreateVideogame() {
	const dispatch = useDispatch();
	const genres = useSelector((state) => state.genres);

	const [name, setName] = useState("");
	const [nameError, setNameError] = useState({ ...errorSnippet });

	const [description, setDescription] = useState("");
	const [descriptionError, setDescriptionError] = useState({
		...errorSnippet,
	});

	const [rating, setRating] = useState(0);

	const [release, setRelease] = useState("2000-01-01");

	const [selectedGenres, setSelectedGenres] = useState([]);
	const [selectedGenresError, setSelectedGenresError] =
		useState(errorSnippet);
	const [newGenre, setNewGenre] = useState("");
	const [genreError, setGenreError] = useState({ ...errorSnippet });
	const [selectedGenre, setSelectedGenre] = useState("default");

	const [platforms, setPlatforms] = useState([]);
	const [platformsError, setPlatformsError] = useState({ ...errorSnippet });
	const [newPlatform, setNewPlatform] = useState("");
	const [platformError, setPlaformError] = useState({ ...errorSnippet });
	const [selectedPlatform, setSelectedPlatform] = useState("default");

	useEffect(() => {
		validateName(name);
	}, [name]);
	useEffect(() => {
		validateDescription(description);
	}, [description]);
	useEffect(() => {
		dispatch(getAllGenres());
	}, [dispatch]);
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
	const handleDescriptionChange = (description) => {
		validateDescription(description);
		setDescription(description);
	};

	const validateDescription = (name) => {
		if (name === "") {
			setDescriptionError({
				err: true,
				msg: "Description cannot be empty!",
			});
			return false;
		}
		setDescriptionError({
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
		console.log(toDeleteGenre);
		let aux = [...selectedGenres];
		aux = aux.filter((genre) => genre !== toDeleteGenre);
		setSelectedGenres(aux);
		validateSelectedGenres();
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
			});
			alert(posted.data);
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
			console.log(true);
			return false;
		}

		setPlatformsError(errorSnippet);
		console.log(false);

		return true;
	};
	return (
		<div id={wrapper}>
			<Link to="/videogames">
				<button id={goBack} className={vinAzu}>
					Go back
				</button>
			</Link>
			<h3>CREATE A VIDEOGAME</h3>
			<form id={form}>
				<label htmlFor="name">Name</label>
				<div>
					<input
						type="text"
						name="name"
						id={nameInput}
						value={name}
						onChange={(e) => handleNameChange(e.target.value)}
						className={nameError.err ? nameErrorClass : ""}
						placeholder={nameError.msg}
					/>
				</div>
				<label htmlFor="description">Description</label>
				<textarea
					type="text"
					name="description"
					id={descriptionInput}
					value={description}
					onChange={(e) => handleDescriptionChange(e.target.value)}
					className={descriptionError.err ? nameErrorClass : ""}
					placeholder={descriptionError.msg}
				/>
				<div className={paralel}>
					<div className={inputBox}>
						<label htmlFor="rating">Rating</label>
						<input
							type="number"
							name="rating"
							id="rating"
							min={0}
							max={5}
							step={0.1}
							value={rating}
							onChange={(e) => handleRatingchange(e.target.value)}
							className={`${halfWidth}`}
						/>
					</div>
					<div className={inputBox}>
						<label htmlFor="release">Release date</label>
						<input
							type="date"
							name="release"
							id="release"
							value={release}
							onChange={(e) => setRelease(e.target.value)}
							className={`${halfWidth}`}
						/>
					</div>
				</div>
				<div className={paralel}>
					<div className={`${halfWidth}`}>
						<select
							name="genres"
							id="genres"
							value={newGenre}
							onChange={(e) => setNewGenre(e.target.value)}
							className={notError}
						>
							<option value="" hidden>
								GENRES
							</option>
							{genres.map((genre) => {
								return (
									<option value={genre} key={genre}>
										{genre}
									</option>
								);
							})}
						</select>
						<button
							className={azuFuc}
							onClick={(e) => handleGenreAdd(e)}
							disabled={!newGenre.length}
						>
							Add
						</button>
					</div>
					<div className={`${halfWidth}`}>
						<select
							id="genresList"
							name="genresList"
							value={selectedGenre}
							onChange={(e) => setSelectedGenre(e.target.value)}
							className={
								selectedGenresError.err ? error : notError
							}
						>
							{selectedGenresError.err && (
								<option>
									{selectedGenresError.msg.toUpperCase()}
								</option>
							)}
							{!selectedGenresError.err && (
								<option>Selected Genres</option>
							)}
							{selectedGenres.map((genre) => {
								return (
									<option key={genre} value={genre}>
										{genre}
									</option>
								);
							})}
						</select>
						<button
							className={azuFuc}
							onClick={(e) => removeGenre(selectedGenre, e)}
						>
							delete
						</button>
					</div>
				</div>
				<div className={paralel}>
					<div className={`${halfWidth}`}>
						<select
							name="platforms"
							id="platforms"
							type="text"
							value={newPlatform}
							onChange={(e) => setNewPlatform(e.target.value)}
							className={notError}
						>
							<option value="" hidden>
								Platforms
							</option>
							<option value="PC">PC</option>
							<option value="PlayStation 3">PlayStation 3</option>
							<option value="PlayStation 4">PlayStation 4</option>
							<option value="PlayStation 5">PlayStation 5</option>
							<option value="XBOX 360">XBOX 360</option>
							<option value="XBox One">XBox One</option>
							<option value="Xbox Series X">Xbox Series X</option>
						</select>
						<button
							className={azuFuc}
							onClick={(e) => handlePlatformAdd(e)}
							disabled={!newPlatform.length}
						>
							Add
						</button>
					</div>
					<div className={`${halfWidth}`}>
						<select
							id="platformsList"
							name="platformsList"
							value={selectedPlatform}
							onChange={(e) =>
								setSelectedPlatform(e.target.value)
							}
							className={platformsError.err ? error : notError}
						>
							{platformsError.err && (
								<option value={platformsError.msg}>
									{platformsError.msg.toUpperCase()}
								</option>
							)}
							{!platformsError.err && (
								<option value="" default>
									Selected Platforms
								</option>
							)}
							{!platformsError.err &&
								platforms.map((platform, index) => {
									console.log(platform);
									return (
										<option
											key={platform + index}
											value={platform}
										>
											{platform}
										</option>
									);
								})}
						</select>
						<button
							className={azuFuc}
							onClick={(e) => removePlatform(selectedPlatform, e)}
						>
							delete
						</button>
					</div>
				</div>
				<button
					id={create}
					onClick={(e) => handleCreate(e)}
					className={vinAzu}
				>
					Create!
				</button>
			</form>
		</div>
	);
}
