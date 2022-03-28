import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllVideogames } from "../redux/actions";
import { Paginate } from "./Paginate";
import { VideogameCard } from "./VideogameCard";
import style from "./Styles/Videogames.module.css";

export default function Videogames() {
	//How many valeus should be rendered by page
	let valuesPerPage = 15;
	const dispatch = useDispatch();
	//get videogames from store.state
	let videogames = useSelector((state) => state.videogames);
	//pageCount: The amount of pages for the pagination
	let [pageCount, setPageCount] = useState();
	//The current page of the pagination
	let [currentPage, setCurrentPage] = useState(1);
	//The range of indexes of the videogames to be rendered
	let [range, setRange] = useState({
		start: 0,
		end: 15,
	});

	useEffect(() => {
		//fetch API on first load
		dispatch(getAllVideogames());
	}, []);

	useEffect(() => {
		//change pageCount on videogames update
		setPageCount(Math.ceil(videogames.length / valuesPerPage));
	}, [videogames, valuesPerPage]);

	useEffect(() => {
		//Update range on current page change
		setRange({
			start: (currentPage - 1) * 15,
			end: currentPage * 15,
		});
	}, [currentPage]);

	const paginate = (number) => {
		//update current page on button click
		setCurrentPage(number);
	};
	const { videogamesPage } = style;
	return (
		<div>
			<div id={videogamesPage}>
				{videogames
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
			<Paginate
				pageCount={pageCount}
				paginate={paginate}
				currentPage={currentPage}
			></Paginate>
		</div>
	);
}
