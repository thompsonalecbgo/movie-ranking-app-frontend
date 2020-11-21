import React from "react";
import { withRouter } from "react-router-dom";

import axiosInstance from "./axiosInstance";
import { extractDate } from "./utils";
import { SearchMovie } from './SearchMovie';

function Movie(props) {
  const movie = props.value;
  const title = movie.title;
  const release_date = extractDate(movie.release_date);
  const poster_path = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
  return (
    <li onClick={props.onClick}>
      <div>
        {/* <img alt={title} src={poster_path} /> */}
        {title} ({release_date})
      </div>
    </li>
  );
}

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

  onClick(movies) {
    this.setState({ topMovies: movies})
  }

  render() {
    return (
      <div>
        <SearchMovie 
          action={`/top-movies/${this.state.topMoviesId}/add/`}
          onClick={this.onClick}
        />
        <ul id="top-movies">
          {this.state.topMovies.map((movie) => (
            <Movie
              key={movie.id.toString()}
              value={movie}
              onClick={() => this.onClickMovie(movie)}
            />
          ))}
        </ul>
      </div>
    );
  }
}

const TopMovies = withRouter(TopMoviesInternal);

export { TopMovies };
