/* eslint-disable no-shadow */
/* eslint-disable import/extensions */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  DEFAULT_CHANNEL_ID,
  setCurrentChannelId,
  addChannels,
  addChannel as addChannelToStore
} from '../store/channelsSlice.js';
import {
  removeMessagesByChannelId,
  addMessages
} from '../store/messagesSlice.js';

export const dataApi = createApi({
  reducerPath: 'dataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5001/api/v1',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
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
      }
    }),
    addChannel: builder.mutation({
      query: (newChannel) => ({
        url: 'channels',
        method: 'POST',
        body: newChannel
      }),
      async onQueryStarted(newChannel, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          dataApi.util.updateQueryData('fetchChannels', undefined, (draft) => {
            draft.push({ ...newChannel, id: Date.now() });
          })
        );
        try {
          const { data: addedChannel } = await queryFulfilled;
          dispatch(addChannelToStore(addedChannel));
          dispatch(setCurrentChannelId(addedChannel.id));
        } catch {
          patchResult.undo();
        }
      }
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

        const patchChannels = dispatch(
          dataApi.util.updateQueryData('fetchChannels', undefined, (draft) => {
            return draft.filter((channel) => channel.id !== id);
          })
        );

        const patchMessages = dispatch(removeMessagesByChannelId(id));

        try {
          await queryFulfilled;
        } catch {
          patchChannels.undo();
          patchMessages.undo();
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
        const patchResult = dispatch(
          dataApi.util.updateQueryData('fetchChannels', undefined, (draft) => {
            const channel = draft.find((channel) => channel.id === id);
            if (channel) {
              channel.name = name;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
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
      }
    }),
    sendMessage: builder.mutation({
      query: ({ body, channelId }) => {
        const username = localStorage.getItem('username') || 'Anonymous';
        return {
          url: 'messages',
          method: 'POST',
          body: { body, channelId, username }
        };
      },
      async onQueryStarted({ body, channelId }, { dispatch, queryFulfilled }) {
        const username = localStorage.getItem('username') || 'Anonymous';
        const patchResult = dispatch(
          dataApi.util.updateQueryData('fetchMessages', channelId, (draft) => {
            draft.push({ body, channelId, username, id: Date.now() });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
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
