/* eslint-disable react/jsx-one-expression-per-line */
import React, { memo, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectCurrentChannel } from '../store/channelsSlice';
import { selectCurrentChannelMessages, addMessages } from '../store/messagesSlice';
import { useFetchMessagesQuery } from '../services/dataApi';

const MessagesBox = memo(({ currentChannelId }) => {
  const { t } = useTranslation('chat');
  const dispatch = useDispatch();
  const currentChannel = useSelector(selectCurrentChannel);
  const messages = useSelector(selectCurrentChannelMessages);
  const messagesCount = messages?.length || 0;
  const messagesBoxRef = useRef(null);

  const { data: fetchedMessages = [], isSuccess } = useFetchMessagesQuery(currentChannelId, {
    skip: !currentChannelId,
  });

  useEffect(() => {
    if (isSuccess && fetchedMessages.length > 0) {
      dispatch(addMessages(fetchedMessages));
    }
  }, [isSuccess, fetchedMessages, dispatch]);

  useEffect(() => {
    if (!messagesBoxRef.current) return;

    requestAnimationFrame(() => {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    });
  }, [messages]);

  return (
    <>
      <div className="mb-4 p-3 shadow-sm small messages-bg">
        {currentChannel && (
          <p className="m-0">
            <b>
				<span className="me-1">#</span>
				{currentChannel.name}
				</b>
          </p>
        )}
        <span>
          {t('messages.messagesCount.messages', { count: messagesCount })}
        </span>
      </div>
      <div id="messages-box" className="chat-messages px-5" ref={messagesBoxRef}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className="text-break mb-2">
              <b className="me-1">{message.username || 'Unknown'}:</b>
              {message.body}
            </div>
          ))
        ) : (
          <p>{t('messages.noMessages')}</p>
        )}
      </div>
    </>
  );
});

MessagesBox.displayName = 'MessagesBox';

export default MessagesBox;
