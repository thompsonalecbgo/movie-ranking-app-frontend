import React from "react";
import axiosInstance from './axiosInstance';

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
        {this.state.message}
      </div>
    )
  }
}

export default App;
