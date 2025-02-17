/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  DEFAULT_CHANNEL_ID,
  setCurrentChannelId,
  addChannels,
  addChannel as addChannelToStore
} from '../store/channelsSlice.js';
import { addMessage, addMessages } from '../store/messagesSlice.js';

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
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: channels } = await queryFulfilled;
          dispatch(addChannels(channels));

          const state = getState();
          if (
            !state.channels.currentChannelId ||
            !channels.some((ch) => ch.id === state.channels.currentChannelId)
          ) {
            dispatch(setCurrentChannelId(DEFAULT_CHANNEL_ID));
          }
        } catch (error) {
          console.error('Ошибка загрузки каналов:', error);
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Channels', id })),
              { type: 'Channels', id: 'ALL' }
            ]
          : [{ type: 'Channels', id: 'ALL' }]
    }),

    addChannel: builder.mutation({
      query: (newChannel) => ({
        url: 'channels',
        method: 'POST',
        body: newChannel
      }),
      async onQueryStarted(newChannel, { dispatch, queryFulfilled }) {
        try {
          const { data: addedChannel } = await queryFulfilled;
          dispatch(addChannelToStore(addedChannel));
          dispatch(setCurrentChannelId(addedChannel.id));
        } catch (error) {
          console.error('Ошибка добавления канала:', error);
        }
      },
      invalidatesTags: [{ type: 'Channels', id: 'ALL' }]
    }),

    removeChannel: builder.mutation({
      query: (id) => ({
        url: `channels/${id}`,
        method: 'DELETE'
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const state = getState();
        const { currentChannelId } = state.channels;

        if (currentChannelId === id) {
          dispatch(setCurrentChannelId(DEFAULT_CHANNEL_ID));
        }

        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Ошибка удаления канала:', error);
        }
      },
      invalidatesTags: [
        { type: 'Channels', id: 'ALL' },
        { type: 'Messages', id: 'ALL' }
      ]
    }),

    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: `channels/${id}`,
        method: 'PATCH',
        body: { name }
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Ошибка переименования канала:', error);
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Channels', id }]
    }),

    fetchMessages: builder.query({
      query: (channelId) => `messages?channelId=${channelId}`,
      async onQueryStarted(channelId, { dispatch, queryFulfilled }) {
        try {
          const { data: messages } = await queryFulfilled;
          dispatch(addMessages(messages));
        } catch (error) {
          console.error('Ошибка загрузки сообщений:', error);
        }
      },
      providesTags: (result, error, channelId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Messages', id })),
              { type: 'Messages', id: channelId }
            ]
          : [{ type: 'Messages', id: channelId }]
    }),

    sendMessage: builder.mutation({
      query: ({ body, channelId, username }) => {
        return {
          url: 'messages',
          method: 'POST',
          body: { body, channelId, username }
        };
      },
      async onQueryStarted(
        { body, channelId, username },
        { dispatch, queryFulfilled }
      ) {
        try {
          const { data: newMessage } = await queryFulfilled;
          dispatch(addMessage(newMessage));
        } catch (error) {
          console.error('Ошибка при отправке сообщения:', error);
        }
      },
      invalidatesTags: (result, error, { channelId }) => [
        { type: 'Messages', id: 'ALL' }
      ]
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
