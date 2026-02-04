import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/admin`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getEmployees: builder.query({
            query: (params) => ({
                url: '/employees',
                method: 'GET',
                params,
            }),
        }),
        getUserWorkSessions: builder.query({
            query: (params) => ({
                url: '/work-sessions',
                method: 'GET',
                params,
            }),
        }),
    }),
});

export const { useGetEmployeesQuery, useGetUserWorkSessionsQuery } = adminApi;
