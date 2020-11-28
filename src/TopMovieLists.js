import React from "react";
import { withRouter, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import axiosInstance from "./axiosInstance";
import { SearchMovie } from "./SearchMovie";
import "./TopMovieLists.css";

function MovieList(props) {
  const movieList = props.value;
  const previewMovies = movieList.movie.slice(0, 3);
  return (
    <div className="top-movie-list">
      <Link to={`/top-movies/${movieList.id}`}>
        <div className="top-movie-list-title preview">{movieList.title}</div>
        {previewMovies.map((previewMovie) => (
          <div className="top-movie preview" key={previewMovie.id}>
            <div className="top-movie-rank preview">{previewMovie.rank}</div>
            <div className="top-movie-title preview" key={previewMovie.id}>
              {previewMovie.title}
            </div>
          </div>
        ))}
      </Link>
      <FontAwesomeIcon
        icon={faTrash}
        size="sm"
        className="delete-top-movies"
        onClick={() => props.deleteTopMovies(movieList.id, props.index)}
      />
    </div>
  );
}

function MovieLists(props) {
  const movieLists = props.movieLists;
  return (
    <div id="top-movie-lists">
      {movieLists.length > 0 ? (
        movieLists.map((movieList, index) => (
          <MovieList
            key={movieList.id.toString()}
            value={movieList}
            deleteTopMovies={props.deleteTopMovies}
            index={index}
          />
        ))
      ) : (
        <div id="no-top-movies">
          No Top Movies Found... Search for a movie now to start creating Top
          Movies
        </div>
      )}
    </div>
  );
}

class TopMovieListsInternal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieLists: [],
    };
    this.deleteTopMovies = this.deleteTopMovies.bind(this);
  }
  componentDidMount() {
    axiosInstance
      .get(`/top-movies/`)
      .then((response) => {
        this.setState({ movieLists: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
  deleteTopMovies(id, index) {
    axiosInstance
      .delete(`/top-movies/${id}/`)
      .then((response) => {
        var array = [...this.state.movieLists];
        if (index !== -1) {
          array.splice(index, 1);
          this.setState({ movieLists: array });
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
  render() {
    return (
      <div>
        <SearchMovie action={`/top-movies/new/`} searchLabel={"Search Movie"} />
        <MovieLists
          movieLists={this.state.movieLists}
          deleteTopMovies={this.deleteTopMovies}
        />
      </div>
    );
  }
}

const TopMovieLists = withRouter(TopMovieListsInternal);

export { TopMovieLists };
