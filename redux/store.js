import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { adminApi } from './api/adminApi';
import { authApi } from './api/authApi';
import { healthApi } from './api/healthApi';
import { workSessionApi } from './api/workSessionApi';
import authReducer from './slices/authSlice';

const appReducer = combineReducers({
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [workSessionApi.reducerPath]: workSessionApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [healthApi.reducerPath]: healthApi.reducer,
});

const rootReducer = (state, action) => {
    // When logout is dispatched, reset the entire state to undefined.
    // This clears all slices and RTK Query caches.
    if (action.type === 'auth/logout') {
        const isRehydrated = state?.auth?.isRehydrated;
        // Reset everything to the initial state
        state = undefined;
        // Call appReducer with undefined to get initial state, then patch isRehydrated
        const newState = appReducer(state, action);
        return {
            ...newState,
            auth: {
                ...newState.auth,
                isRehydrated: !!isRehydrated, // Keep it true if it was true
            },
        };
    }
    return appReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(workSessionApi.middleware)
            .concat(adminApi.middleware)
            .concat(healthApi.middleware),
});
