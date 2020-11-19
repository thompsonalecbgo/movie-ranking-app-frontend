import axios from "axios";

const axiosRequestCreator = () => {
  let source;
  return async (url) => {
    if (source) {
      source.cancel();
    }
    source = axios.CancelToken.source();
    try {
      const response = await axios.get(url, { cancelToken: source.token });
      return response;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        throw error;
      }
    }
  };
}

// async getResults(query) {
//   this.setState({ query });
//   const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDBApiKey}&language=en-US&query=${query}`;
//   if (query) {
//     try {
//       const response = await search(url)
//       const results = response.data.results
//       this.setState({ results })
//     } catch (error) {
//       console.log(error)
//     }
//   } else {
//     this.setState({ results: [] })
//   }
// }

// await new Promise(resolve => setTimeout(resolve, 1000))

export const search = axiosRequestCreator();
