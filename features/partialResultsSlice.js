import { createSlice } from '@reduxjs/toolkit';

export const PartialResultsSlice = createSlice({
    name: 'partialResults',
    initialState: {
        isShown: false,
    },
    reducers: {
        show: state => {
            state.isShown = true
        },
        hide: state => {
            state.isShown = false
        },
    }
})

export const { show, hide } = PartialResultsSlice.actions

export default PartialResultsSlice.reducer

export const selectIsShown = state => state.partialResults.isShown