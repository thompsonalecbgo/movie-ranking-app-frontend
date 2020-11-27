import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux'

import axiosInstance from "./axiosInstance";
import { extractDate } from "./utils";
import "./SearchMovie.css";

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
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  }
  clearInput() {
    this.setState({ value: "" });
    if (this.props.getValue) {
      this.props.getValue("");
    }
  }
  render() {
    return (
      <form id="search-form" onSubmit={this.handleSubmit}>
        <label>{this.props.searchLabel}</label>
        <span id="search">
          <input
            id="search-bar"
            type="text"
            placeholder="Search for your favorite movies!"
            autoComplete="off"
            value={this.state.value}
            onChange={this.handleChange}
            onBlur={this.props.handleBlur}
            onFocus={this.props.handleFocus}
          ></input>
          {this.props.children}
        </span>
      </form>
    );
  }
}

function MovieNotFound(props) {
  return <div className="search-result">Movie not found.</div>;
}

function SearchResult(props) {
  const result = props.value;
  const title = result.title;
  const release_date = extractDate(result.release_date);
  const poster = result.poster_path;
  const poster_path = `https://image.tmdb.org/t/p/w200${poster}`;
  return (
    <div onClick={props.handleClickResult} className="search-result">
      <div>
        <img
          className="search-image"
          alt={title}
          src={poster_path}
          width={50}
          onError={(e) => (e.target.style.display = "none")}
        />
        <p className="search-text">
          {title} ({release_date})
        </p>
      </div>
    </div>
  );
}

function SearchResults(props) {
  const results = props.results;
  return (
    <div>
      <div id="search-results">
        {props.movieNotFound ? (
          <MovieNotFound />
        ) : (
          results.map((result) => (
            <SearchResult
              key={result.id.toString()}
              value={result}
              handleClickResult={() => props.handleClickResult(result)}
            />
          ))
        )}
      </div>
    </div>
  );
}

class SearchMovieInternal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      typingTimeout: "",
      showPartialResults: false,
      results: [],
      showResults: false,
      movieNotFound: false,
    };
    this.getQuery = this.getQuery.bind(this);
    this.getResults = this.getResults.bind(this);
    this.handleClickResult = this.handleClickResult.bind(this);
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
      movieNotFound: false,
    });
    if (query) {
      this.setState({
        showResults: true,
        typingTimeout: setTimeout(() => {
          this.getResults(query);
        }, 500),
      });
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

  handleClickResult(result) {
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
        this.searchFormRef.current.clearInput();
        this.setState({ showResults: false })
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  onSearch() {
    // alert("clicked")
    this.getResults(this.state.query).then((res) => {
      this.setState((state) => ({
        showPartialResults: false,
        showResults: true,
        lastResults: state.results,
      }));
      if (this.props.isShowingResults) {
        this.props.isShowingResults(true);
      }
    });
  }

  render() {
    return (
      <div>
        <SearchForm
          ref={this.searchFormRef}
          getValue={this.getQuery}
          searchLabel={this.props.searchLabel}
          handleBlur={() => {
            setTimeout(() => this.setState({ showResults: false }), 250);
          }}
          handleFocus={() => {
            this.setState({ showResults: true });
          }}
        >
          {this.state.showResults && (
            <SearchResults
              results={this.state.results}
              movieNotFound={this.state.movieNotFound}
              handleClickResult={this.handleClickResult}
            />
          )}
        </SearchForm>
      </div>
    );
  }
}

let SearchMovie = withRouter(SearchMovieInternal);

export { SearchMovie };
