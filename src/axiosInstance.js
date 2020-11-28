import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://movie-ranking-app-backend.herokuapp.com/api/v1/',
    timeout: 60000,
})

export default axiosInstance