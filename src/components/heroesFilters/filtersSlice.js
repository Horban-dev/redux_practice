import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    filters: [],
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
}

export const fetchFilters = (request) => (dispatch) => {
    dispatch(filtersFetching());
    request("http://localhost:3001/filters")
        .then(data => dispatch(filtersFetched(data)))
        .catch(() => dispatch(filtersFetchingError()))
}

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        filtersFetching: (state) => {
            state.filtersLoadingStatus = 'loading';
        },
        filtersFetched: (state, action) => {
            state.filters = action.payload;
            state.filtersLoadingStatus = 'idle';
        },
        filtersFetchingError: (state) =>  {
            state.filtersLoadingStatus = 'error';
        },
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload
        }
    }
})
const {actions, reducer} = filtersSlice
export default reducer;
export const {
    filtersFetched, 
    filtersFetching,
    filtersFetchingError,
    activeFilterChanged,
} = actions;