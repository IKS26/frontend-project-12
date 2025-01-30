import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFetchChannelsQuery,
  useFetchMessagesQuery
} from '../services/dataApi';
import { selectModalState } from '../store/modalSlice';
import { selectCurrentChannelId, addChannels, setCurrentChannelId, DEFAULT_CHANNEL_ID } from '../store/channelsSlice';
import { addMessage, removeMessagesByChannelId } from '../store/messagesSlice';
import ChannelsList from './ChannelsList';
import MessagesBox from './MessagesBox';
import MessageInput from './MessageInput';
import Modal from './modals';
import { connectSocket, disconnectSocket, subscribeToEvents } from '../services/socket';

const HomePage = () => {
  const dispatch = useDispatch();
  const modalState = useSelector(selectModalState);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const { data: channels, isLoading, refetch } = useFetchChannelsQuery();
  const { data: messages, refetch: refetchMessages } = useFetchMessagesQuery(currentChannelId, { skip: !currentChannelId });

  useEffect(() => {
    if (channels) {
      dispatch(addChannels(channels));
    }
  }, [channels, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    connectSocket(token);

    const handleNewMessage = (message) => {
      dispatch(addMessage(message));
    };

    const handleNewChannel = () => {
      if (!isLoading) {
        refetch();
      }
    };

    const handleRemoveChannel = (channelId) => {
      dispatch(removeMessagesByChannelId(channelId));
    };

    const handleRenameChannel = () => {
      if (!isLoading) {
        refetch();
      }
    };

    subscribeToEvents(handleNewMessage, handleNewChannel, handleRemoveChannel, handleRenameChannel);

    return () => {
      disconnectSocket();
    };
  }, [dispatch, isLoading, refetch]);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 flex-md-row chat-bg">
        <div className="col-4 col-md-2 border-end px-0 flex-column h-100 d-flex channels-bg">
          <ChannelsList channels={channels} currentChannelId={currentChannelId} />
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <MessagesBox  currentChannelId={currentChannelId} />
            <MessageInput currentChannelId={currentChannelId} />
          </div>
        </div>
      </div>
      {modalState.isOpen && <Modal />}
    </div>
  );
};

export default HomePage;
