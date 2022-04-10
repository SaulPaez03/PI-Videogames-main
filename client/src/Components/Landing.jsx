import React from "react";
import { Link } from "react-router-dom";
import style from "./Styles/Landing.module.css";
import GitHubMark from "../assets/Images/GitHubMark/GitHub-Mark-Light-120px-plus.png";
let { container, button, link, github } = style;
export default function Landing() {
	return (
		<div id={container}>
			<Link to="/videogames" id={link}>
				<button id={button}>START</button>
			</Link>
			<a id={github} href="https://github.com/SaulPaez03">
				<img src={GitHubMark} alt="" />
			</a>
		</div>
	);
}
