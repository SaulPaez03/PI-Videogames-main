import "./App.css";
import React from "react";
import { Route } from "react-router-dom";
import Landing from "./Components/Landing";
import CreateVideogame from "./Components/CreateVideogame";
import VideogameDetails from "./Components/VideogameDetails";
import Videogames from "./Components/Videogames";
function App() {
	return (
		<div className="App">
			<Route exact path="/" component={Landing} />
			<Route exact path="/videogames" component={Videogames} />
			<Route
				exact
				path="/videogames/Create"
				componente={CreateVideogame}
			/>
			<Route
				exact
				path="/videogames/:videogameID"
				render={({ match }) => (
					<VideogameDetails
						videogameID={match.params.videogameID}
					></VideogameDetails>
				)}
			/>
		</div>
	);
}

export default App;
