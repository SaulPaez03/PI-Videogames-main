import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
	return (
		<div>
			<h3>Welcome to Videogames</h3>
			<Link to="/videogames">Start</Link>
		</div>
	);
}
