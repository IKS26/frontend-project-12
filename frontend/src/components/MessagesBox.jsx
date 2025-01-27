import React, { memo } from 'react';
import { DEFAULT_CHANNEL_ID } from '../store/channelsSlice';

const MessagesBox = memo(({ messages, channels, currentChannelId }) => {
  const currentChannel = channels.find((channel) => channel.id === currentChannelId) || DEFAULT_CHANNEL_ID;

  return (
    <>
      <div className="mb-4 p-3 shadow-sm small messages-bg">
        <p className="m-0">
          <b className="text-dark"># {currentChannel.name}</b>
        </p>
        <span className="text-muted">{messages.length} сообщений</span>
      </div>
      <div id="messages-box" className="chat-messages overflow-auto px-5 text-dark">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className="text-break mb-2">
              <b>{message.username}:</b> {message.body}
            </div>
          ))
        ) : (
          <p className="text-muted">Сообщений нет</p>
        )}
      </div>
    </>
  );
});

export default MessagesBox;
