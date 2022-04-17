import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	clearSearchResults,
	getAllGenres,
	getAllVideogames,
	clearAllVideogames,
	getVideogamesByName,
} from "../redux/actions";
import { Link } from "react-router-dom";
import { Paginate } from "./Paginate";
import { VideogameCard } from "./VideogameCard";
import style from "./Styles/Videogames.module.css";
import Loading from "../assets/Images/Loading.gif";
const {
	videogamesPage,
	sidebar,
	sidebar_item,
	container,
	results,
	searchForm,
	btn,
	btn_big,
	dropdown,
	itemOptions,
	separator,
	fuc_tur,
	azu_vin,
	nar_ama,
	azu_ver,
} = style;
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
		by: "default",
		mode: "default",
	});
	//Search Form input value
	let [searchValue, setSearchValue] = useState("");

	//on Component Will Mount
	useEffect(() => {
		//fetch API on first load
		dispatch(getAllVideogames());
		dispatch(getAllGenres());

		return () => {
			dispatch(clearAllVideogames());
			dispatch(clearSearchResults());
		};
	}, [dispatch]);
	//on displayedVideogamesUpdate
	useEffect(() => {
		setCurrentPage(1);
		setPageCount(Math.ceil(displayedVideogames.length / valuesPerPage));
	}, [displayedVideogames, valuesPerPage]);

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
		else if (searchResults.error) {
			alert("No results found");
			dispatch(clearSearchResults());
			setDisplayedVideogames(videogames);
		}
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
			by: "default",
			mode: "default",
		});
	};

	const handleSearch = (event) => {
		event.preventDefault();
		if (searchValue !== "") {
			setDisplayedVideogames([]);
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

		if (attr === "default") {
			return;
		}

		attr = attr === "alph" ? "name" : "rating";
		aux.sort((a, b) => {
			if (a[attr] > b[attr]) {
				return 1;
			}
			if (a[attr] === b[attr]) {
				return 0;
			}
			return -1;
		});
		if (mode === "desc") {
			aux = aux.reverse();
		}

		setDisplayedVideogames(aux);
	};

	return (
		<div id={container}>
			<div id={sidebar}>
				<div id="search" className={sidebar_item}>
					<label htmlFor="search-form">Search by name:</label>
					<form
						id="search-form"
						onSubmit={(e) => handleSearch(e)}
						method="get"
					>
						<input
							id={searchForm}
							name="searchInput"
							type="text"
							value={searchValue}
							onChange={(e) => {
								setSearchValue(e.target.value);
							}}
						/>
						<button className={`${btn} ${fuc_tur}`} type="submit">
							SEARCH
						</button>
					</form>
				</div>
				<div id="filters" className={sidebar_item}>
					<label htmlFor="filter">Filter by: </label>
					<form onSubmit={(e) => handleFilter(e)} id="filter">
						<div className={itemOptions}>
							<select
								name="genres"
								id="genres"
								value={genreFilter}
								onChange={(e) => setGenreFilter(e.target.value)}
								className={`${dropdown} ${azu_vin}`}
							>
								<option hidden value="default">
									GENRE
								</option>
								<option value="default">ALL GENRES</option>
								{genres.map((genre) => (
									<option key={genre} value={genre}>
										{genre.toUpperCase()}
									</option>
								))}
							</select>
							<select
								name="origin"
								id="origin"
								value={originFilter}
								onChange={(e) =>
									setOriginFilter(e.target.value)
								}
								className={`${dropdown} ${azu_vin}`}
							>
								<option hidden value="default">
									SOURCE
								</option>
								<option value="default">ALL SOURCES</option>

								<option value="API">ORIGINAL</option>
								<option value="DB">CREATED BY USERS</option>
							</select>
						</div>
						<button type="submit" className={`${btn} ${fuc_tur}`}>
							FILTER
						</button>{" "}
					</form>
				</div>
				<div id="order" className={sidebar_item}>
					<label htmlFor="order">Order by: </label>
					<form action="">
						<div className={itemOptions}>
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
								className={`${dropdown} ${azu_vin}`}
							>
								<option value="default" hidden>
									TRAIT
								</option>
								<option value={"default"}>ANY</option>

								<option value={"alph"}>NAME</option>
								<option value={"rate"}>RATING</option>
							</select>
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
								className={`${dropdown} ${azu_vin}`}
							>
								<option value="default" hidden>
									MODE
								</option>
								<option value={"default"}>ANY</option>
								<option value={"desc"}>DESCENDANT</option>
								<option value={"asc"}>ASCENDANT</option>
							</select>
						</div>

						<button
							className={`${btn} ${fuc_tur}`}
							onClick={(e) => handleOrder(e)}
						>
							ORDER
						</button>
					</form>
				</div>
				<div>
					<button
						onClick={() => clearFilters()}
						className={`${btn_big} ${nar_ama}`}
					>
						CLEAR FILTERS
					</button>
				</div>
				<div className={separator} />
				<Link to="/videogames/Create">
					<button className={`${btn_big} ${azu_ver}`}>CREATE</button>
				</Link>
			</div>

			<div id={results}>
				<h1
					style={{
						color: "white",
						fontSize: "40px",
						textDecoration: "underline #d479ff 5px solid",
					}}
				>
					VIDEOGAMES
				</h1>

				{!displayedVideogames.length && (
					<div
						style={{
							height: "100vh",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "white",
						}}
					>
						<img src={Loading} alt="loading" />
					</div>
				)}
				<Paginate
					pageCount={pageCount}
					paginate={paginate}
					currentPage={currentPage}
				></Paginate>
				{displayedVideogames.length && (
					<div id={videogamesPage}>
						{displayedVideogames
							.slice(range.start, range.end)
							.map(
								({
									id,
									name,
									genres,
									background_image,
									rating,
								}) => (
									<VideogameCard
										key={id}
										id={id}
										name={name}
										background_image={background_image}
										genres={genres}
										rating={rating}
									/>
								)
							)}
					</div>
				)}
				<Paginate
					pageCount={pageCount}
					paginate={paginate}
					currentPage={currentPage}
				></Paginate>
			</div>
		</div>
	);
}
