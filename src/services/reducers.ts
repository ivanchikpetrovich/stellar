import { combineReducers } from '@reduxjs/toolkit';

// Import all individual slice reducers
import { authReducer } from './slices/auth-slice';
import { burgerReducer } from './slices/burger-slice';
import { ingredientsReducer } from './slices/ingredients-slice';
import { orderReducer } from './slices/order-slice';

// Combine all reducers into a single root reducer
export const rootReducer = combineReducers({
  auth: authReducer,
  burger: burgerReducer,
  ingredients: ingredientsReducer,
  order: orderReducer
});