import React from "react";
import { withRouter } from "react-router-dom";

import axiosInstance from "./axiosInstance";
import { extractDate } from "./utils";
import { SearchMovie } from "./SearchMovie";

function Movie(props) {
  const movie = props.value;
  const title = movie.title;
  const release_date = extractDate(movie.release_date);
  const poster_path = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
  return (
    <li>
      <div>
        {/* <img alt={title} src={poster_path} /> */}
        {title} ({release_date})
      </div>
    </li>
  );
}

function Movies(props) {
  const movies = props.movies
  return (
    <div>
      <ul id="top-movies">
        {movies.map((movie) => (
          <Movie
            key={movie.id.toString()}
            value={movie}
          />
        ))}
      </ul>
    </div>
  );
}

class TopMoviesInternal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      movies: [],
      showMovies: true,
    };
    this.getSelected = this.getSelected.bind(this);
    this.toggleMovies = this.toggleMovies.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({ id });
    axiosInstance
      .get(`/top-movies/${id}/`)
      .then((response) => {
        this.setState({ movies: response.data.movie });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  getSelected(selected) {
    const topMovies = selected.top_movies
    const movies = topMovies.movie
    this.setState({ 
      movies, 
      showMovies: true 
    });
  }

  toggleMovies(isShowingResults) {
    if (isShowingResults) {
      this.setState({ showMovies: false })
    } else {
      this.setState({ showMovies: true })
    }
  }

  render() {
    return (
      <div>
        <SearchMovie
          action={`/top-movies/${this.state.id}/add/`}
          getSelected={this.getSelected}
          isShowingResults={this.toggleMovies}
        />
        {
          this.state.showMovies && <Movies movies={this.state.movies} />
        }
      </div>
    );
  }
}

const TopMovies = withRouter(TopMoviesInternal);

export { TopMovies };
