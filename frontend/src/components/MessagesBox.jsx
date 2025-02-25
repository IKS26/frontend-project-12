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
  console.log('Ререндер сообщений:', messages);
  const messagesCount = messages?.length || 0;
  const messagesBoxRef = useRef(null);

  const { data: fetchedMessages = [], isSuccess } = useFetchMessagesQuery(currentChannelId, { skip: !currentChannelId });

  useEffect(() => {
	if (isSuccess && fetchedMessages.length > 0) {
		dispatch(addMessages([...messages, ...fetchedMessages]));
      console.log('Обновление сообщений после загрузки:', fetchedMessages);
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
			  <b className="text-dark"># {currentChannel.name}</b>
			</p>
		 )}
		 <span className="text-muted">{t('messages.messagesCount.messages', { count: messagesCount })}</span>
	  </div>
	  <div id="messages-box" 
	  className="chat-messages px-5 text-dark"
	  ref={messagesBoxRef}
	  >
		 {messages.length > 0 ? (
			messages.map((message) => (
			  <div key={message.id} className="text-break mb-2">
				 <b>{message.username || 'Unknown'}:</b> {message.body}
			  </div>
			))
		 ) : (
			<p className="text-muted">{t('messages.noMessages')}</p>
		 )}
	  </div>
	</>
 );
});

export default MessagesBox;
