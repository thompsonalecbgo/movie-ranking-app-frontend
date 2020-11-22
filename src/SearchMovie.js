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
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearInput = this.clearInput.bind(this);
  }
  handleChange(e) {
    this.setState({ value: e.target.value });
    if (this.props.getValue) {
      this.props.getValue(e.target.value);
    }
  }
  handleSubmit(e) {
    e.preventDefault();
  }
  clearInput() {
    this.setState({ value: "" });
    if (this.props.getValue) {
      this.props.getValue("");
    }
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
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        {/* <input type="submit" value="Search" id="search-button" /> */}
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
  const results = props.results;
  return (
    <div>
      <ul id="search-results">
        {results.map((result) => (
          <SearchResult
            key={result.id.toString()}
            value={result}
            onClick={() => props.onClick(result)}
          />
        ))}
      </ul>
    </div>
  );
}

function MovieNotFound(props) {
  return <div>Movie not found.</div>;
}

class SearchMovieInternal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      typingTimeout: "",
      results: [],
      showResults: false,
      movieNotFound: false,
    };
    this.getQuery = this.getQuery.bind(this);
    this.getResults = this.getResults.bind(this);
    this.onClickResult = this.onClickResult.bind(this);
    this.searchFormRef = React.createRef();
  }

  getQuery(query) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      query,
      results: [],
      showResults: false,
      typingTimeout: setTimeout(() => {
        this.getResults(query);
      }, 500),
    });
    if (query) {
      this.setState({ showResults: true });
    }
  }

  async getResults(query) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDBApiKey}&language=en-US&query=${query}`;
    try {
      const response = await axios.get(url);
      const results = response.data.results;
      this.setState({ results, movieNotFound: false });
      if (results.length === 0) {
        this.setState({ movieNotFound: true });
      }
    } catch (error) {
      console.log(error);
    }
  }

  onClickResult(result) {
    axiosInstance
      .post(this.props.action, {
        tmdb_id: result.id,
        title: result.title,
        release_date: result.release_date,
        poster_path: `https://image.tmdb.org/t/p/w200${result.poster_path}`,
      })
      .then((response) => {
        this.searchFormRef.current.clearInput();
        this.props.history.push(`/top-movies/${response.data.top_movies.id}/`);
        if (this.props.getSelected) {
          this.props.getSelected(response.data);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  render() {
    return (
      <div>
        <SearchForm ref={this.searchFormRef} getValue={this.getQuery} />
        {this.state.showResults && (
          <SearchResults
            results={this.state.results}
            onClick={this.onClickResult}
          />
        )}
        {this.state.showResults && this.state.movieNotFound && (
          <MovieNotFound />
        )}
      </div>
    );
  }
}

let SearchMovie = withRouter(SearchMovieInternal);

export { SearchMovie };
