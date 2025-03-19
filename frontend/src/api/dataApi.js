import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiRoutes from './apiRoutes.js';

export const dataApi = createApi({
  reducerPath: 'dataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiRoutes.base,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Channels', 'Messages'],
  endpoints: (builder) => ({
    fetchChannels: builder.query({
      query: () => apiRoutes.channels,
      providesTags: ['Channels'],
    }),

    addChannel: builder.mutation({
      query: (newChannel) => ({
        url: apiRoutes.channels,
        method: 'POST',
        body: newChannel,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(dataApi.util.invalidateTags(['Channels']));
      },
    }),

    removeChannel: builder.mutation({
      query: (id) => ({
        url: apiRoutes.channel(id),
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(dataApi.util.invalidateTags(['Channels', 'Messages']));
      },
    }),

    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: apiRoutes.channel(id),
        method: 'PATCH',
        body: { name },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(dataApi.util.invalidateTags(['Channels']));
      },
    }),

    fetchMessages: builder.query({
      query: (channelId) => apiRoutes.messagesByChannel(channelId),
      providesTags: (result, error, channelId) => [{ type: 'Messages', id: channelId }],
    }),

    sendMessage: builder.mutation({
      query: (newMessage) => ({
        url: apiRoutes.messages,
        method: 'POST',
        body: newMessage,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(dataApi.util.invalidateTags(['Messages']));
      },
    }),
  }),
});

export const {
  useFetchChannelsQuery,
  useAddChannelMutation,
  useRemoveChannelMutation,
  useRenameChannelMutation,
  useFetchMessagesQuery,
  useSendMessageMutation,
} = dataApi;
