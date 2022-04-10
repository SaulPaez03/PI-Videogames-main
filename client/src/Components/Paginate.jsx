import React from "react";
import Style from "./Styles/Paginate.module.css";

const { wrapper, btn, active } = Style;
export const Paginate = ({ pageCount, paginate, currentPage }) => {
	let pageNumbers = [];
	for (let i = 1; i <= pageCount; i++) {
		pageNumbers.push(i);
	}
	if (pageCount === 0) {
		return null;
	}
	return (
		<div id={wrapper}>
			{currentPage !== 1 && (
				<button
					className={`${btn}`}
					onClick={() => paginate(currentPage - 1)}
				>
					◀
				</button>
			)}
			{pageNumbers.map((pageNumber) => {
				let current = currentPage === pageNumber ? active : "";
				return (
					<button
						key={pageNumber}
						onClick={() => paginate(pageNumber)}
						className={`${btn} ${current}`}
					>
						{pageNumber}
					</button>
				);
			})}
			{currentPage !== pageCount && (
				<button
					className={`${btn}`}
					onClick={() => paginate(currentPage + 1)}
				>
					▶
				</button>
			)}
		</div>
	);
};
