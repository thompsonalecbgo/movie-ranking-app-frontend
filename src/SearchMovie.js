import React from "react";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import axios from "axios";

import axiosInstance from "./axiosInstance";
import { extractDate } from "./utils";

const TMDBApiKey = "ff8183068c00734a3d6c9ae5281fe108";

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      typing: false,
      typingTimeout: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ typing: true });
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      query: e.target.value,
      typing: false,
      typingTimeout: setTimeout(() => {
        if (this.props.getResults) {
          this.props.getResults(e.target.value);
        }
      }, 500),
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(e);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Search Movie:
          <input
            id="search-bar"
            type="text"
            placeholder="Search for your favorite movies!"
            value={this.state.query}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Search" />
      </form>
    );
  }
}

function SearchResults(props) {
  return (
    <div>
      <ul id="search-results">
        {props.results.map((result) => (
          <li key={result.id.toString()}>
            <div onClick={() => props.onClickMovie(result)}>
              {/* <img alt={result.title} src={`https://image.tmdb.org/t/p/w200${result.poster_path}`} /> */}
              {result.title} ({extractDate(result.release_date)})
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

class SearchMovieInternal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      results: [],
    };
    this.getResults = this.getResults.bind(this);
    this.onClickMovie = this.onClickMovie.bind(this);
  }

  async getResults(query) {
    this.setState({ query });
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDBApiKey}&language=en-US&query=${query}`;
    if (query) {
      try {
        const response = await axios.get(url);
        const results = response.data.results.slice(0, 5);
        this.setState({ results });
      } catch (error) {
        console.log(error);
      }
    } else {
      this.setState({ results: [] });
    }
  }

  onClickMovie(movie) {
    axiosInstance
      .post("/top-movies/new/", {
        tmdb_id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        poster_path: `https://image.tmdb.org/t/p/w200${movie.poster_path}`,
      })
      .then((response) => {
        console.log(response);
        this.props.history.push(`/top-movies/${response.data.id}/`);
        // this.setState({ message: response.data.message });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Search Movie</title>
        </Helmet>
        <SearchForm getResults={this.getResults} />
        <SearchResults
          results={this.state.results}
          onClickMovie={this.onClickMovie}
        />
      </div>
    );
  }
}

let SearchMovie = withRouter(SearchMovieInternal);

export { SearchMovie };
