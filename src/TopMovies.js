import React from "react";
import { withRouter, Link } from "react-router-dom";

import axiosInstance from "./axiosInstance";
import { SearchMovie } from "./SearchMovie";
import { extractDate } from "./utils";

function Movie(props) {
  const movie = props.value;
  const title = movie.title;
  const release_date = extractDate(movie.release_date);
  const poster_path = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
  const rank = movie.rank;
  return (
    <li>
      <div>
        <button
          className="move-rank-up"
          onClick={() => props.moveRank(movie, "move-rank-up")}
        >
          Move Up
        </button>
        &ensp;
        <button
          className="move-rank-down"
          onClick={() => props.moveRank(movie, "move-rank-down")}
        >
          Move Down
        </button>
        &ensp;
        <span className="movie-rank">{rank}</span>
        &ensp;
        <span className="movie-detail">
          {/* <img alt={title} src={poster_path} /> */}
          {title} ({release_date})
        </span>
        &ensp;
        <button className="delete-rank" onClick={() => props.deleteRank(movie)}>
          Delete
        </button>
      </div>
    </li>
  );
}

function Movies(props) {
  const movies = props.movies;
  movies.sort((a, b) => a.rank - b.rank);
  return (
    <div>
      <ul id="top-movies">
        {movies.map((movie) => (
          <Movie
            key={movie.id.toString()}
            value={movie}
            moveRank={props.moveRank}
            deleteRank={props.deleteRank}
          />
        ))}
      </ul>
    </div>
  );
}

class TopMoviesHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editTitle: false,
      value: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }
  componentDidMount() {
    this.setState({ value: this.props.title })
  }
  handleChange(e) {
    this.setState({ value: e.target.value });
  }
  handleDoubleClick() {
    this.setState({ editTitle: true });
  }
  handleBlur(e) {
    this.setState({ editTitle: false });
    if (this.props.changeTitle) {
      this.props.changeTitle(e.target.value)
    }
  }
  render() {
    return (
      <div>
        <div>
          {this.state.editTitle ? (
            <input
              className="top-movies-title edit"
              type="text"
              placeholder="Add title"
              value={this.state.value}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
            />
          ) : (
            <div
              className="top-movies-title"
              onDoubleClick={this.handleDoubleClick}
            >
              {this.state.value ? this.state.value : "Add title"}
            </div>
          )}
        </div>
        <button
          className="delete-top-movies"
          onClick={this.props.deleteTopMovies}
        >
          Delete Top Movies
        </button>
      </div>
    );
  }
}

class TopMoviesInternal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      movies: [],
      title: "",
    };
    this.getSelected = this.getSelected.bind(this);
    this.moveRank = this.moveRank.bind(this);
    this.deleteRank = this.deleteRank.bind(this);
    this.deleteTopMovies = this.deleteTopMovies.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({ id });
    axiosInstance
      .get(`/top-movies/${id}/`)
      .then((response) => {
        console.log(response);
        this.setState({
          movies: response.data.movie,
          title: response.data.title,
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  getSelected(selected) {
    const topMovies = selected.top_movies;
    const movies = topMovies.movie;
    this.setState({ movies });
  }

  moveRank(movie, action) {
    const movie_id = movie.id;
    axiosInstance
      .put(`/top-movie/${movie_id}/${action}/`)
      .then((response) => {
        console.log(response);
        const topMovies = response.data.top_movies;
        const movies = topMovies.movie;
        this.setState({ movies });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  deleteRank(movie) {
    const movie_id = movie.id;
    axiosInstance
      .put(`/top-movie/${movie_id}/delete-rank/`)
      .then((response) => {
        console.log(response);
        const movies = response.data.movie;
        this.setState({ movies });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  deleteTopMovies() {
    axiosInstance
      .delete(`/top-movies/${this.state.id}/`)
      .then((response) => {
        console.log(response);
        this.props.history.push(`/`);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  changeTitle(title) {
    axiosInstance
      .put(`/top-movies/${this.state.id}/`, {
        title: title
      })
      .then((response) => {
        console.log(response);
        this.setState({ movies: response.data.movie });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  render() {
    return (
      <div>
        <SearchMovie
          action={`/top-movies/${this.state.id}/add/`}
          getSelected={this.getSelected}
        />
        <TopMoviesHeader
          title={this.state.title}
          deleteTopMovies={this.deleteTopMovies}
          changeTitle={this.changeTitle}
        />
        <Movies
          movies={this.state.movies}
          moveRank={this.moveRank}
          deleteRank={this.deleteRank}
        />
      </div>
    );
  }
}

const TopMovies = withRouter(TopMoviesInternal);

export { TopMovies };
