/* eslint-disable import/extensions */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dataApi = createApi({
  reducerPath: 'dataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Channels', 'Messages'],
  endpoints: (builder) => ({
    fetchChannels: builder.query({
      query: () => 'channels',
      providesTags: ['Channels']
    }),

    addChannel: builder.mutation({
      query: (newChannel) => ({
        url: 'channels',
        method: 'POST',
        body: newChannel
      }),
      invalidatesTags: ['Channels']
    }),

    removeChannel: builder.mutation({
      query: (id) => ({
        url: `channels/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Channels', 'Messages']
    }),

    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: `channels/${id}`,
        method: 'PATCH',
        body: { name }
      }),
      invalidatesTags: ['Channels']
    }),

    fetchMessages: builder.query({
      query: (channelId) => `messages?channelId=${channelId}`,
      providesTags: ['Messages']
    }),

    sendMessage: builder.mutation({
      query: (newMessage) => ({
        url: 'messages',
        method: 'POST',
        body: newMessage
      }),
      invalidatesTags: ['Messages']
    })
  })
});

export const {
  useFetchChannelsQuery,
  useAddChannelMutation,
  useRemoveChannelMutation,
  useRenameChannelMutation,
  useFetchMessagesQuery,
  useSendMessageMutation
} = dataApi;
