import { configureStore } from '@reduxjs/toolkit';
import partialResultsReducer from '../features/partialResultsSlice';

export default configureStore({
    reducer: {
        partialResults: partialResultsReducer,
        // results: resultsReducer,
        // movies: moviesReducer,
    }
})