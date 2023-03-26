import { createSlice, createAsyncThunk, createEntityAdapter, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { useHttp } from '../../hooks/http.hook';


interface Filter {
    id: string;
    name: string;
}

interface FiltersState extends EntityState<Filter> {
    filtersLoadingStatus: 'idle' | 'loading' | 'error';
    activeFilter: string;
}

interface RootState {
    filters: FiltersState;
}

const filtersAdapter = createEntityAdapter<Filter>()
const initialState: FiltersState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
})
export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    async () => {
        const { request } = useHttp()
        return await request<Filter[]>("http://localhost:3001/filters")
    }
)

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        activeFilterChanged: (state, action: PayloadAction<string>) => {
            state.activeFilter = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, state => { state.filtersLoadingStatus = 'loading' })
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle';
                filtersAdapter.setAll(state, action.payload)
            })
            .addCase(fetchFilters.rejected, state => {
                state.filtersLoadingStatus = 'error'
            })
            .addDefaultCase(() => { })
    }
})

const { actions, reducer } = filtersSlice

export default reducer;
export const { selectAll } = filtersAdapter.getSelectors((state: RootState) => state.filters);
export const {
    // filtersFetched,
    // filtersFetching,
    // filtersFetchingError,
    activeFilterChanged,
} = actions;