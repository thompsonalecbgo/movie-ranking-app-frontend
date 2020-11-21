import React from "react";
import { Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";

import axiosInstance from "./axiosInstance";
import { SearchMovie } from "./SearchMovie";
import { TopMovies } from "./TopMovies";

function Home(props) {
  return (
    <div id="welcome">
      <Helmet>
        <title>My Top 100 Movies</title>
      </Helmet>
      {props.message}
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };
  }

  componentDidMount() {
    axiosInstance
      .get("/")
      .then((response) => {
        this.setState({ message: response.data.message });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/">
            <Home message={this.state.message} />
          </Route>
          <Route path="/search/">
            <SearchMovie 
              action="/top-movies/new/"
            />
          </Route>
          <Route path="/top-movies/:id">
            <TopMovies />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
