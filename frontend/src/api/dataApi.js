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
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: 'Channels', id })), 'Channels'] : ['Channels']),
    }),

    addChannel: builder.mutation({
      query: (newChannel) => ({
        url: apiRoutes.channels,
        method: 'POST',
        body: newChannel,
      }),
      async onQueryStarted(newChannel, { dispatch, queryFulfilled }) {
        const { data: createdChannel } = await queryFulfilled;
        dispatch(
          dataApi.util.updateQueryData('fetchChannels', undefined, (draft) => {
            draft.push(createdChannel);
          }),
        );
      },
    }),

    removeChannel: builder.mutation({
      query: (id) => ({
        url: apiRoutes.channel(id),
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(
          dataApi.util.updateQueryData('fetchChannels', undefined, (draft) => draft.filter((channel) => channel.id !== id)),
        );
        dispatch(dataApi.util.updateQueryData('fetchMessages', id, () => []));
      },
    }),

    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: apiRoutes.channel(id),
        method: 'PATCH',
        body: { name },
      }),
      async onQueryStarted({ id, name }, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(
          dataApi.util.updateQueryData('fetchChannels', undefined, (draft) => {
            const channel = draft.find((ch) => ch.id === id);
            if (channel) channel.name = name;
          }),
        );
      },
    }),

    fetchMessages: builder.query({
      query: (channelId) => apiRoutes.messagesByChannel(channelId),
      providesTags: (result, error, channelId) => (result ? [{ type: 'Messages', id: channelId }] : ['Messages']),
    }),

    sendMessage: builder.mutation({
      query: (newMessage) => ({
        url: apiRoutes.messages,
        method: 'POST',
        body: newMessage,
      }),
      async onQueryStarted(newMessage, { dispatch, queryFulfilled }) {
        const { data: message } = await queryFulfilled;
        dispatch(
          dataApi.util.updateQueryData('fetchMessages', message.channelId, (draft) => {
            draft.push(message);
          }),
        );
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
