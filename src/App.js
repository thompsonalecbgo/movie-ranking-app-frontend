import React from "react";
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import axiosInstance from './axiosInstance';
import { SearchMovie } from './SearchMovie';

function Home(props) {
  return (
    <div>
      <Helmet>
        <title>My Top 100 Movies</title>
      </Helmet>
      {props.message}
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    }
  }

  componentDidMount() {
    axiosInstance.get('/')
      .then(response => {
        console.log(response)
        this.setState({message: response.data.message})
      })
      .catch(err => {
        throw err;
      })
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/">
            <Home message={this.state.message} />
          </Route>
          <Route path="/search/">
            <SearchMovie />
          </Route>
        </Switch>
      </div>
    )
  }
}

export default App;
