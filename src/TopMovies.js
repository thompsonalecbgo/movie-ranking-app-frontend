import React from "react";
import { withRouter } from "react-router-dom";

import axiosInstance from "./axiosInstance";
import { extractDate } from "./utils";

class TopMoviesInternal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topMoviesId: "",
      topMovies: [],
    };
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({ topMoviesId: id });
    axiosInstance
      .get(`/top-movies/${id}/`)
      .then((response) => {
        console.log(response);
        this.setState({ topMovies: response.data.movie });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  onClick() {}

  render() {
    return (
      <div>
        <ul id="top-movies">
          {this.state.topMovies.map((result) => (
            <li key={result.id.toString()}>
              <div onClick={this.onClick}>
                {/* <img alt={result.title} src={`https://image.tmdb.org/t/p/w200${result.poster_path}`} /> */}
                {result.title} ({extractDate(result.release_date)})
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const TopMovies = withRouter(TopMoviesInternal);

export { TopMovies };
