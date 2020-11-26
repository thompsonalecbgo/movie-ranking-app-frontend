import React from "react";
import { withRouter, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faTimes,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

import axiosInstance from "./axiosInstance";
import { SearchMovie } from "./SearchMovie";
import { extractDate } from "./utils";
import "./TopMovies.css";

function Movie(props) {
  const movie = props.value;
  const title = movie.title;
  const release_date = extractDate(movie.release_date);
  const poster_path = movie.poster_path;
  const rank = movie.rank;
  return (
    <div className="movie-block">
      <FontAwesomeIcon
        icon={faAngleUp}
        size="lg"
        className="move-rank-up movie-btn"
        onClick={() => props.moveRank(movie, "move-rank-up")}
      />
      <FontAwesomeIcon
        icon={faAngleDown}
        size="lg"
        className="move-rank-down movie-btn"
        onClick={() => props.moveRank(movie, "move-rank-down")}
      />
      <span className="movie-rank">{rank}</span>
      <span className="movie-title">
        {title} ({release_date})
      </span>
      <img alt={title} src={poster_path} className="movie-poster" />
      <FontAwesomeIcon
        icon={faTimes}
        className="delete-rank movie-btn"
        onClick={() => props.deleteRank(movie)}
      />
    </div>
  );
}

function Movies(props) {
  const movies = props.movies;
  movies.sort((a, b) => a.rank - b.rank);
  return (
    <div id="top-movies">
      {movies.map((movie) => (
        <Movie
          key={movie.id.toString()}
          value={movie}
          moveRank={props.moveRank}
          deleteRank={props.deleteRank}
        />
      ))}
    </div>
  );
}

class TopMoviesTitleInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  componentDidMount() {
    this.inputRef.current.focus();
  }
  render() {
    return (
      <input
        ref={this.inputRef}
        className="top-movies-title edit"
        type="text"
        placeholder="Add Title"
        value={this.props.value}
        onChange={this.props.onChange}
        onBlur={this.props.onBlur}
      />
    );
  }
}

class TopMoviesHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editTitle: false,
    };
    this.triggerChangeTitle = this.triggerChangeTitle.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleSubmitChangeTitle = this.handleSubmitChangeTitle.bind(this);
  }

  triggerChangeTitle() {
    this.setState({ editTitle: true });
  }

  handleChangeTitle(e) {
    if (this.props.changeTitle) {
      this.props.changeTitle(e.target.value);
    }
  }

  handleSubmitChangeTitle(e) {
    this.setState({ editTitle: false });
    if (this.props.submitChangeTitle) {
      this.props.submitChangeTitle(e.target.value);
    }
  }

  render() {
    return (
      <div id="top-movies-header">
        <span>
          {this.state.editTitle ? (
            <TopMoviesTitleInput
              value={this.props.title}
              onChange={this.handleChangeTitle}
              onBlur={this.handleSubmitChangeTitle}
            />
          ) : (
            <span onDoubleClick={this.triggerChangeTitle}>
              {this.props.title ? (
                <span>
                  <span className="top-movies-title">{this.props.title}</span>
                  <FontAwesomeIcon
                    icon={faPen}
                    size="sm"
                    className="edit-top-movies-title"
                    onClick={this.triggerChangeTitle}
                  />
                </span>
              ) : (
                <span className="top-movies-title placeholder">
                  (double click to add title)
                </span>
              )}
            </span>
          )}
        </span>
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
    // this.deleteTopMovies = this.deleteTopMovies.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.submitChangeTitle = this.submitChangeTitle.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({ id });
    axiosInstance
      .get(`/top-movies/${id}/`)
      .then((response) => {
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
        const movies = response.data.movie;
        this.setState({ movies });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  changeTitle(title) {
    this.setState({ title: title });
  }

  submitChangeTitle(title) {
    axiosInstance
      .put(`/top-movies/${this.state.id}/`, {
        title: title,
      })
      .then((response) => {
        this.setState({ title: response.data.title });
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
          searchLabel={"Add Movie"}
        />
        <TopMoviesHeader
          title={this.state.title}
          changeTitle={this.changeTitle}
          submitChangeTitle={this.submitChangeTitle}
          // deleteTopMovies={this.deleteTopMovies}
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
