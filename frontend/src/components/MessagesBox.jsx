import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectChannelById } from '../store/channelsSlice';
import { selectCurrentChannelMessages } from '../store/messagesSlice';

const MessagesBox = memo(({ currentChannelId }) => {
  const currentChannel = useSelector((state) => selectChannelById(state, currentChannelId));
  const messages = useSelector(selectCurrentChannelMessages);

  console.log('currentChannel:', currentChannel);
  console.log('messages:', messages);

  if (!currentChannel) {
    return <p className="text-muted">Загрузка канала...</p>;
  }

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
              <b>{message.username || 'Unknown'}:</b> {message.body}
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
