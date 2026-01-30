import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isAdmin: false,
    isRehydrated: false,
};

export const loadUser = createAsyncThunk('auth/loadUser', async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@auth_data');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        return null;
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isAdmin = action.payload.user?.role === 'ADMIN';
            AsyncStorage.setItem('@auth_data', JSON.stringify({ user: action.payload.user, token: action.payload.token }));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
            AsyncStorage.removeItem('@auth_data');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadUser.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                    state.isAuthenticated = true;
                    state.isAdmin = action.payload.user?.role === 'ADMIN';
                }
                state.isRehydrated = true;
            })
            .addCase(loadUser.rejected, (state) => {
                state.isRehydrated = true;
            });
    },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
