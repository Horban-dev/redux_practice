import heroes from '../components/heroesList/heroesSlice';
import { configureStore, Middleware } from '@reduxjs/toolkit';
import filters from '../components/heroesFilters/filtersSlice';

const stringMiddleware: Middleware = () => (next) => (action) => {
  if (typeof action === 'string') {
    return next({
      type: action,
    });
  }
  return next(action);
};

const store = configureStore({
  reducer: { heroes: heroes, filters: filters },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stringMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});
export type RootState = ReturnType<typeof store.getState>;
export default store;

