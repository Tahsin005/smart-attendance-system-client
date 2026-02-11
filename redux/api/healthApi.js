import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const healthApi = createApi({
    reducerPath: 'healthApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.EXPO_PUBLIC_API_URL,
    }),
    endpoints: (builder) => ({
        checkHealth: builder.query({
            query: () => '/health',
        }),
    }),
});

export const { useCheckHealthQuery } = healthApi;
