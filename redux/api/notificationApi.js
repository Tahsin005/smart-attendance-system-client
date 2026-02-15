import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const notificationApi = createApi({
    reducerPath: 'notificationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/notifications`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        registerDevice: builder.mutation({
            query: (data) => ({
                url: '/register',
                method: 'POST',
                body: data,
            }),
        }),
        sendTestNotification: builder.mutation({
            query: (data) => ({
                url: '/send',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useRegisterDeviceMutation, useSendTestNotificationMutation } = notificationApi;
