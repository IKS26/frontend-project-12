import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import leoProfanity from 'leo-profanity';
import { useFetchChannelsQuery, useFetchMessagesQuery } from '../services/dataApi';
import { selectModalState } from '../store/modalSlice';
import { selectCurrentChannelId, addChannels } from '../store/channelsSlice';
import ChannelsList from './ChannelsList';
import MessagesBox from './MessagesBox';
import MessageInput from './MessageInput';
import Modal from './modals';

const HomePage = () => {
  const dispatch = useDispatch();
  const modalState = useSelector(selectModalState);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const { data: channels } = useFetchChannelsQuery();
  useFetchMessagesQuery(currentChannelId, { skip: !currentChannelId, pollingInterval: 1000 });

  useEffect(() => {
    if (channels) {
		console.log('Обновление списка каналов:', channels);
      dispatch(addChannels(channels));
    }
  }, [dispatch, channels]);

  useEffect(() => {
    leoProfanity.loadDictionary();
    leoProfanity.add(leoProfanity.getDictionary('ru'));
    leoProfanity.add(leoProfanity.getDictionary('en'));
  }, []);

  return (
    <div className="container h-100 my-4 rounded shadow overflow-hidden">
      <div className="row h-100 flex-md-row chat-bg">
        <div className="col-4 col-md-2 border-end px-0 d-flex flex-column channels-bg">
          <ChannelsList currentChannelId={currentChannelId} />
        </div>
        <div className="col p-0 d-flex flex-column">
          <MessagesBox currentChannelId={currentChannelId} />
          <MessageInput currentChannelId={currentChannelId} />
        </div>
      </div>
      {modalState.isOpen && <Modal />}
    </div>
  );
};

export default HomePage;
