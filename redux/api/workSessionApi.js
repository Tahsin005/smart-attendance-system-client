import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const workSessionApi = createApi({
    reducerPath: 'workSessionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/work-session`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['WorkSession'],
    endpoints: (builder) => ({
        // fetch today's work session
        getTodaySession: builder.query({
            query: () => '/today',
            providesTags: ['WorkSession'],
        }),

        // start work with selfie + GPS location
        startWork: builder.mutation({
            query: (formData) => ({
                url: '/start',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['WorkSession'],
        }),

        // end work with selfie + GPS location
        endWork: builder.mutation({
            query: (formData) => ({
                url: '/end',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['WorkSession'],
        }),
    }),
});

export const {
    useGetTodaySessionQuery,
    useStartWorkMutation,
    useEndWorkMutation,
} = workSessionApi;
