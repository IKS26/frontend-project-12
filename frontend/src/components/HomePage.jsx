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
      <div className="row flex-grow-1 flex-md-row chat-bg">
        <div className="col-4 col-md-2 border-end px-0 d-flex flex-column channels-bg">
          <ChannelsList currentChannelId={currentChannelId} />
        </div>
        <div className="col p-0 d-flex flex-column h-100">
          <div className="flex-grow-1 overflow-auto">
            <MessagesBox currentChannelId={currentChannelId} />
          </div>
          <MessageInput currentChannelId={currentChannelId} />
        </div>
      </div>
      {modalState.isOpen && <Modal />}
    </div>
  );
};

export default HomePage;
