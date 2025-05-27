import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch as dispatchHook, useSelector as selectorHook } from 'react-redux';

// Import the root reducer that combines all slice reducers
import { rootReducer } from './reducers';

// Configure the Redux store with middleware and dev tools
const appStore = configureStore({
  reducer: rootReducer,
  // Only enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
  // Add any additional middleware here if needed
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

// Infer the RootState type from the store itself
export type RootState = ReturnType<typeof rootReducer>;

// Infer the AppDispatch type from the store
export type AppDispatch = typeof appStore.dispatch;

// Create typed versions of useDispatch and useSelector hooks
export const useAppDispatch: () => AppDispatch = () => dispatchHook();
export const useAppSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default appStore;