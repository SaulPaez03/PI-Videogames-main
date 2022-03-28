import React from "react";

export const Paginate = ({ pageCount, paginate }) => {
	let pageNumbers = [];
	for (let i = 1; i <= pageCount; i++) {
		pageNumbers.push(i);
	}

	return (
		<div>
			{pageNumbers.map((pageNumber) => {
				return (
					<button
						key={pageNumber}
						onClick={() => paginate(pageNumber)}
					>
						{pageNumber}
					</button>
				);
			})}
		</div>
	);
};
