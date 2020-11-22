import React from "react";
import { withRouter, Link } from "react-router-dom";

import axiosInstance from "./axiosInstance";
import { SearchMovie } from "./SearchMovie";

function MovieList(props) {
  const movieList = props.value;
  const previewMovies = movieList.movie.slice(0, 3);
  return (
    <div className="top-movie-list">
      <Link to={`/top-movies/${movieList.id}`}>
        <p>{movieList.id}</p>
        <ul>
          {previewMovies.map((previewMovie) => (
            <li key={previewMovie.id}>{previewMovie.title}</li>
          ))}
        </ul>
      </Link>
    </div>
  );
}

function MovieLists(props) {
  const movieLists = props.movieLists;
  return (
    <div id="top-movie-lists">
      {movieLists.map((movieList) => (
        <MovieList key={movieList.id.toString()} value={movieList} />
      ))}
    </div>
  );
}

class TopMovieListsInternal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieLists: [],
    };
  }
  componentDidMount() {
    axiosInstance
      .get(`/top-movies/`)
      .then((response) => {
        console.log(response);
        this.setState({ movieLists: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
  render() {
    return (
      <div>
        <SearchMovie action={`/top-movies/new/`} />
        <MovieLists movieLists={this.state.movieLists} />
      </div>
    );
  }
}

const TopMovieLists = withRouter(TopMovieListsInternal);

export { TopMovieLists };
