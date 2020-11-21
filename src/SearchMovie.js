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
      typingTimeout: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.props.getQuery(e.target.value);
    this.setState({
      query: e.target.value,
      typingTimeout: setTimeout(() => {
        if (this.props.getResults) {
          this.props.getResults(e.target.value);
        }
      }, 250),
    });
  }

  clearInput() {
    this.setState({
      query: "",
      typing: false,
      typingTimeout: 0,
    })
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

function SearchResult(props) {
  const result = props.value;
  const title = result.title;
  const release_date = extractDate(result.release_date);
  const poster_path = `https://image.tmdb.org/t/p/w200${result.poster_path}`;
  return (
    <li onClick={props.onClick}>
      <div>
        {/* <img alt={title} src={poster_path} /> */}
        {title} ({release_date})
      </div>
    </li>
  );
}

function SearchResults(props) {
  return (
    <div>
      <ul id="search-results">
        {props.results.map((result) => (
          <SearchResult
            key={result.id.toString()}
            value={result}
            onClick={() => props.onClickMovie(result)}
          />
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
    this.getQuery = this.getQuery.bind(this);
    this.searchFormComponent = React.createRef();
  }

  getQuery(query) {
    this.setState({ query })
  }

  async getResults(query) {
    // this.setState({ query });
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
      .post(this.props.action, {
        tmdb_id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        poster_path: `https://image.tmdb.org/t/p/w200${movie.poster_path}`,
      })
      .then((response) => {
        console.log(response);
        this.props.history.push(`/top-movies/${response.data.top_movies.id}/`);
        this.setState({ query: "", results: [] });
        this.searchFormComponent.current.clearInput();
        if (this.props.onClick) {
          this.props.onClick(response.data.top_movies.movie)
        }
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
        <SearchForm 
          ref={this.searchFormComponent}
          getQuery={this.getQuery}
          getResults={this.getResults}
        />
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
