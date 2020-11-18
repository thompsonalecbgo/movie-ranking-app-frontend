import React from "react";
import { Helmet } from "react-helmet";

const results = [
  {
    id: 1,
    name: "Titanic",
  },
];

function SearchResults(props) {
  return (
    <ul id="search-results">
      {props.results.map((result) => (
        <li key={result.id.toString()}>
          {result.name}
        </li>
      ))}
    </ul>
  );
}

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { query: "" };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ query: e.target.value });
    if (this.props.getQuery) {
      this.props.getQuery(e.target.value);
    }
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

class SearchMovie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      results,
    };
    this.getQuery = this.getQuery.bind(this);
  }

  getQuery(query) {
    this.setState({ query });
    console.log(query);
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Search Movie</title>
        </Helmet>
        <SearchForm getQuery={this.getQuery} />
        <SearchResults results={this.state.results} />
      </div>
    );
  }
}

export { SearchMovie };
