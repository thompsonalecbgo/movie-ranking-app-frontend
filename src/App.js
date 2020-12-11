import React from "react";
import { Route, Switch, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { TopMovies } from "./TopMovies";
import { TopMovieLists } from "./TopMovieLists";
import "./App.css";
import tmdbLogo from "./tmdb-logo.svg";

export function Home(props) {
  return (
    <div id="welcome">
      <Helmet>
        <title>My Top 100 Movies</title>
      </Helmet>
      {props.message}
    </div>
  );
}

function App(props) {
  return (
    <div className="app">
      <div className="container">
        <Switch>
          <Route exact path="/">
            <Helmet>
              <title>Top Movies</title>
            </Helmet>
            <h2>
              <Link to="/" id="title">
                Top Movies
              </Link>
            </h2>
            <div id="welcome-banner">
              <h1>Rank your all-time favorite movies!</h1>
              <p>
                Create personalize lists of your favorite movies and rank them
                in order from your most favorite to least favorite.
              </p>
            </div>
            <TopMovieLists />
          </Route>
          <Route path="/top-movies/:id">
            <h3>
              <Link to="/" className="return">
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  size="sm"
                  style={{ marginRight: 10 }}
                />
                return
              </Link>
            </h3>
            <TopMovies />
          </Route>
        </Switch>
      </div>
      <footer>
        <p style={{fontSize: "0.75rem"}}>
          This product uses the TMDb API but is not endorsed or certified by
          TMDb
        </p>
        <img alt="TMDB logo" src={tmdbLogo} width={120} style={{marginBottom: "10px"}}/>
      </footer>
    </div>
  );
}

export default App;
