import React, { useState, useEffect, isValidElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	clearSearchResults,
	getAllGenres,
	getAllVideogames,
	getVideogamesByName,
} from "../redux/actions";
import { Paginate } from "./Paginate";
import { VideogameCard } from "./VideogameCard";
import style from "./Styles/Videogames.module.css";

export default function Videogames() {
	//How many valeus should be rendered by page
	let valuesPerPage = 15;
	const dispatch = useDispatch();
	//get videogames from store.state
	let videogames = useSelector((state) => state.videogames);
	//get searchResults from store.state
	let searchResults = useSelector((state) => state.searchResults);
	//pageCount: The amount of pages for the pagination
	let genres = useSelector((state) => state.genres);
	let [pageCount, setPageCount] = useState();
	//The current page of the pagination
	let [currentPage, setCurrentPage] = useState(1);
	//The array to be showed
	let [displayedVideogames, setDisplayedVideogames] = useState([]);
	//The range of indexes of the videogames to be rendered
	let [range, setRange] = useState({
		start: 0,
		end: 15,
	});

	let [genreFilter, setGenreFilter] = useState("default");
	let [originFilter, setOriginFilter] = useState("default");

	let [orderValues, setOrderValues] = useState({
		by: "alph",
		mode: "asc",
	});
	//Search Form input value
	let [searchValue, setSearchValue] = useState("");

	//on Component Will Mount
	useEffect(() => {
		//fetch API on first load
		dispatch(getAllVideogames());
		dispatch(getAllGenres());
	}, []);
	//on displayedVideogamesUpdate
	useEffect(() => {
		setCurrentPage(1);
		setPageCount(Math.ceil(displayedVideogames.length / valuesPerPage));
	}, [displayedVideogames]);

	//on videogames and valuesPerPage  uptade
	useEffect(() => {
		setDisplayedVideogames(videogames);
	}, [videogames, valuesPerPage]);

	//on currentPage update
	useEffect(() => {
		//Update range on current page change
		setRange({
			start: (currentPage - 1) * 15,
			end: currentPage * 15,
		});
	}, [currentPage]);

	//onSearchResults update
	useEffect(() => {
		if (searchResults.length) setDisplayedVideogames(searchResults);
	}, [searchResults]);

	const paginate = (number) => {
		//update current page on button click
		setCurrentPage(number);
	};
	const clearFilters = () => {
		setOriginFilter("default");
		setGenreFilter("default");
		setSearchValue("");
		dispatch(clearSearchResults());
		setDisplayedVideogames(videogames);
		setOrderValues({
			by: "alph",
			mode: "asc",
		});
	};

	const handleSearch = (event) => {
		event.preventDefault();
		if (searchValue !== "") {
			return dispatch(getVideogamesByName(searchValue));
		}

		setDisplayedVideogames(videogames);
	};
	const handleFilter = (event) => {
		event.preventDefault();
		let origin = originFilter;
		let genre = genreFilter;

		let aux = searchResults.length ? [...searchResults] : [...videogames];
		if (genre !== "default") {
			aux = aux.filter((videogame) => videogame.genres.includes(genre));
		}
		if (origin === "API") {
			aux = aux.filter((videogame) => typeof videogame.id === "number");
		} else if (origin === "DB") {
			aux = aux.filter((videogame) => typeof videogame.id === "string");
		}
		setDisplayedVideogames(aux);
	};
	const handleOrder = (event) => {
		event.preventDefault();
		let { by: attr, mode } = orderValues;
		let aux = [...displayedVideogames];
		console.log(attr);
		if (attr === "default") {
			return;
		}

		attr = attr === "alph" ? "name" : "rating";
		aux.sort((a, b) => {
			if (a[attr] > b[attr]) {
				return 1;
			}
			if (a[attr] == b[attr]) {
				return 0;
			}
			return -1;
		});
		if (mode === "desc") {
			console.log("reverse");
			aux = aux.reverse();
		}

		setDisplayedVideogames(aux);
	};
	const { videogamesPage } = style;
	return (
		<div>
			<div id="filters">
				<form onSubmit={(e) => handleSearch(e)} method="get">
					<input
						name="searchInput"
						type="text"
						value={searchValue}
						onChange={(e) => {
							setSearchValue(e.target.value);
						}}
					/>
					<button type="submit">Search</button>
				</form>
				<form onSubmit={(e) => handleFilter(e)}>
					<label htmlFor="genres">Filter videogames: </label>
					<select
						name="genres"
						id="genres"
						value={genreFilter}
						onChange={(e) => setGenreFilter(e.target.value)}
					>
						<option hidden value="default">
							Select a genre
						</option>
						<option value="default">All genres</option>
						{genres.map((genre) => (
							<option key={genre} value={genre}>
								{genre}
							</option>
						))}
					</select>
					<select
						name="origin"
						id="origin"
						value={originFilter}
						onChange={(e) => setOriginFilter(e.target.value)}
					>
						<option hidden value="default">
							Select a data origin
						</option>
						<option value="default">All sources</option>

						<option value="API">From the API</option>
						<option value="DB">From the DataBase</option>
					</select>
					<button type="submit">Filter!</button>{" "}
				</form>
			</div>
			<div>
				<label htmlFor="order">Order by: </label>
				<select
					name="order"
					id="order"
					value={orderValues.by}
					onChange={(e) => {
						setOrderValues((old) => ({
							...old,
							by: e.target.value,
						}));
					}}
				>
					<option value={"alph"}>Alphabetically</option>
					<option value={"rate"}>By rating</option>
				</select>

				<label htmlFor="mode">Mode: </label>
				<select
					name="mode"
					id="mode"
					value={orderValues.mode}
					onChange={(e) => {
						setOrderValues((old) => ({
							...old,
							mode: e.target.value,
						}));
					}}
				>
					<option value={"desc"}>Descendant</option>
					<option value={"asc"}>Ascendant</option>
				</select>
				<button onClick={(e) => handleOrder(e)}>Order!</button>
			</div>
			<button onClick={() => clearFilters()}>Clear Filters</button>
			{!displayedVideogames.length && (
				<div>
					<h3>No videogames found</h3>
				</div>
			)}
			{displayedVideogames.length && (
				<div id={videogamesPage}>
					{displayedVideogames
						.slice(range.start, range.end)
						.map(({ id, name, genres, background_image }) => (
							<VideogameCard
								key={id}
								id={id}
								name={name}
								background_image={background_image}
								genres={genres}
							/>
						))}
				</div>
			)}
			<Paginate
				pageCount={pageCount}
				paginate={paginate}
				currentPage={currentPage}
			></Paginate>
		</div>
	);
}
