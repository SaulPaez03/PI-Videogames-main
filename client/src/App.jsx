import "./App.css";
import React from "react";
import { Route, Switch } from "react-router-dom";
import Landing from "./Components/Landing";
import VideogameDetails from "./Components/VideogameDetails";
import Videogames from "./Components/Videogames";
import CreateVideogame from "./Components/CreateVideogame";
function App() {
	return (
		<div className="App">
			<Switch>
				<Route exact path="/" component={Landing} />
				<Route exact path="/videogames" component={Videogames} />
				<Route
					exact
					path="/videogames/Create"
					component={CreateVideogame}
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
			</Switch>
		</div>
	);
}

export default App;
