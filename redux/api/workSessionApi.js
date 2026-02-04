import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const workSessionApi = createApi({
    reducerPath: 'workSessionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.EXPO_PUBLIC_API_URL,
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
            query: () => '/work-session/today',
            providesTags: ['WorkSession'],
        }),

        // start work with selfie + GPS location
        startWork: builder.mutation({
            query: (formData) => ({
                url: '/work-session/start',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['WorkSession'],
        }),

        // end work with selfie + GPS location
        endWork: builder.mutation({
            query: (formData) => ({
                url: '/work-session/end',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['WorkSession'],
        }),

        // update current location
        updateLocation: builder.mutation({
            query: (data) => ({
                url: '/location',
                method: 'POST',
                body: data,
            }),
        }),

        // fetch work session details by id
        getSessionDetails: builder.query({
            query: (id) => `/work-session/${id}/details`,
            providesTags: (result, error, id) => [{ type: 'WorkSession', id }],
        }),
    }),
});

export const {
    useGetTodaySessionQuery,
    useStartWorkMutation,
    useEndWorkMutation,
    useGetSessionDetailsQuery,
    useUpdateLocationMutation,
} = workSessionApi;
