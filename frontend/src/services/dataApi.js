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
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Channels', id })), 'Channels']
          : ['Channels']
    }),

    addChannel: builder.mutation({
      query: (newChannel) => ({
        url: 'channels',
        method: 'POST',
        body: newChannel
      }),
      async onQueryStarted(newChannel, { dispatch, queryFulfilled }) {
        try {
          const { data: createdChannel } = await queryFulfilled;
          dispatch(
            dataApi.util.updateQueryData(
              'fetchChannels',
              undefined,
              (draft) => {
                draft.push(createdChannel);
              }
            )
          );
        } catch (error) {
          console.error('Ошибка при добавлении канала:', error);
        }
      }
    }),

    removeChannel: builder.mutation({
      query: (id) => ({
        url: `channels/${id}`,
        method: 'DELETE'
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            dataApi.util.updateQueryData(
              'fetchChannels',
              undefined,
              (draft) => {
                return draft.filter((channel) => channel.id !== id);
              }
            )
          );
          dispatch(dataApi.util.updateQueryData('fetchMessages', id, () => []));
        } catch (error) {
          console.error('Ошибка при удалении канала:', error);
        }
      }
    }),

    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: `channels/${id}`,
        method: 'PATCH',
        body: { name }
      }),
      async onQueryStarted({ id, name }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            dataApi.util.updateQueryData(
              'fetchChannels',
              undefined,
              (draft) => {
                const channel = draft.find((ch) => ch.id === id);
                if (channel) {
                  channel.name = name;
                }
              }
            )
          );
        } catch (error) {
          console.error('Ошибка при переименовании канала:', error);
        }
      }
    }),

    fetchMessages: builder.query({
      query: (channelId) => `messages?channelId=${channelId}`,
      providesTags: (result, error, channelId) =>
        result ? [{ type: 'Messages', id: channelId }] : ['Messages']
    }),

    sendMessage: builder.mutation({
      query: (newMessage) => ({
        url: 'messages',
        method: 'POST',
        body: newMessage
      }),
      async onQueryStarted(newMessage, { dispatch, queryFulfilled }) {
        try {
          const { data: message } = await queryFulfilled;
          dispatch(
            dataApi.util.updateQueryData(
              'fetchMessages',
              message.channelId,
              (draft) => {
                draft.push(message);
              }
            )
          );
          dispatch(dataApi.util.invalidateTags(['Messages']));
        } catch (error) {
          console.error('Ошибка при отправке сообщения:', error);
        }
      }
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
