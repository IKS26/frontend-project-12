import React, { memo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectCurrentChannel } from '../store/channelsSlice';
import { selectCurrentChannelMessages } from '../store/messagesSlice';

const MessagesBox = memo(({ currentChannelId }) => {
  const { t } = useTranslation('chat');	
  const currentChannel = useSelector((state) => {
		const channel = selectCurrentChannel(state);
		return channel;
	 });	 
  const messages = useSelector(selectCurrentChannelMessages);
  const messagesCount = messages?.length || 0;
  const bottomRef = useRef(null);

  useEffect(() => {
	setTimeout(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, 100);
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
	  <div id="messages-box" className="chat-messages overflow-auto px-5 text-dark">
		 {messages.length > 0 ? (
			messages.map((message) => (
			  <div key={message.id} className="text-break mb-2">
				 <b>{message.username || 'Unknown'}:</b> {message.body}
			  </div>
			))
		 ) : (
			<p className="text-muted">{t('messages.noMessages')}</p>
		 )}
		 <div ref={bottomRef} />
	  </div>
	</>
 );
});

export default MessagesBox;
