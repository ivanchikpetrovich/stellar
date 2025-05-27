import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  registerUserApi, 
  loginUserApi, 
  logoutApi, 
  getUserApi, 
  updateUserApi,
  TRegisterData,
  TLoginData 
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie } from '../../utils/cookie';

// Define the authentication state interface
interface IAuthState {
  currentUser: TUser | null;
  isAuthChecked: boolean;
  authRequest: boolean;
  authError: string | null;
  updateUserRequest: boolean;
  updateUserError: string | null;
}

// Initial state for authentication
const initialState: IAuthState = {
  currentUser: null,
  isAuthChecked: false,
  authRequest: false,
  authError: null,
  updateUserRequest: false,
  updateUserError: null
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: TRegisterData) => {
    const authData = await registerUserApi(userData);
    localStorage.setItem('refreshToken', authData.refreshToken);
    return authData.user;
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: TLoginData) => {
    const authData = await loginUserApi(loginData);
    localStorage.setItem('refreshToken', authData.refreshToken);
    return authData.user;
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await logoutApi();
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  }
);

// Async thunk for getting user data
export const getUser = createAsyncThunk(
  'auth/getUser',
  async () => {
    const response = await getUserApi();
    return response.user;
  }
);

// Async thunk for updating user data
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: Partial<TRegisterData>) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

// Create the auth slice with reducers and actions
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Registration handlers
    builder.addCase(registerUser.pending, (state) => {
      state.authRequest = true;
      state.authError = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.authRequest = false;
      state.currentUser = action.payload;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.authRequest = false;
      state.authError = action.error.message || 'Registration failed';
    });

    // Login handlers
    builder.addCase(loginUser.pending, (state) => {
      state.authRequest = true;
      state.authError = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.authRequest = false;
      state.currentUser = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.authRequest = false;
      state.authError = action.error.message || 'Login failed';
    });

    // Logout handlers
    builder.addCase(logoutUser.pending, (state) => {
      state.authRequest = true;
      state.authError = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.authRequest = false;
      state.currentUser = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.authRequest = false;
      state.authError = action.error.message || 'Logout failed';
    });

    // Get user handlers
    builder.addCase(getUser.pending, (state) => {
      state.authRequest = true;
      state.authError = null;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.authRequest = false;
      state.currentUser = action.payload;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.authRequest = false;
      state.authError = action.error.message || 'Failed to get user data';
    });

    // Update user handlers
    builder.addCase(updateUser.pending, (state) => {
      state.updateUserRequest = true;
      state.updateUserError = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.updateUserRequest = false;
      state.currentUser = action.payload;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.updateUserRequest = false;
      state.updateUserError = action.error.message || 'Failed to update user data';
    });
  }
});

// Export actions and reducer
export const { setAuthChecked } = authSlice.actions;
export const authReducer = authSlice.reducer;