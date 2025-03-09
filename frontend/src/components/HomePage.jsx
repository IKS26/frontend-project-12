import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import leoProfanity from 'leo-profanity';
import { selectModalState } from '../store/modalSlice';
import { selectCurrentChannelId } from '../store/channelsSlice';
import ChannelsList from './ChannelsList';
import MessagesBox from './MessagesBox';
import MessageInput from './MessageInput';
import Modal from './modals';

const HomePage = () => {
  const modalState = useSelector(selectModalState);
  const currentChannelId = useSelector(selectCurrentChannelId);

  useEffect(() => {
    leoProfanity.loadDictionary();
    leoProfanity.add(leoProfanity.getDictionary('ru'));
    leoProfanity.add(leoProfanity.getDictionary('en'));
  }, []);

  return (
    <div className="container h-100 my-4 rounded shadow overflow-hidden d-flex flex-column">
      <div className="chat-content">
    <div className="channels-container">
      <ChannelsList currentChannelId={currentChannelId} />
    </div>
    <div className="messages-container">
      <MessagesBox currentChannelId={currentChannelId} />
      <MessageInput currentChannelId={currentChannelId} />
    </div>
  </div>
      {modalState.isOpen && <Modal />}
    </div>
  );
};

export default HomePage;
