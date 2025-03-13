import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useFetchChannelsQuery } from '../api/dataApi';
import { selectModalState } from '../store/modalSlice';
import { selectCurrentChannelId } from '../store/channelsSlice';
import ChannelsList from '../components/ChannelsList';
import MessagesBox from '../components/MessagesBox';
import MessageInput from '../components/MessageInput';
import ChatSpinner from '../components/spinners/ChatSpinner.jsx';
import SimpleSpinner from '../components/spinners/SimpleSpinner.jsx';

const Modal = lazy(() => import('../components/modals/index.jsx'));

const HomePage = () => {
  const { isLoading } = useFetchChannelsQuery();
  const modalState = useSelector(selectModalState);
  const currentChannelId = useSelector(selectCurrentChannelId);

  if (isLoading) return <ChatSpinner />;

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
      {modalState.isOpen && (
        <Suspense fallback={<SimpleSpinner />}>
          <Modal />
        </Suspense>
      )}
    </div>
  );
};

export default HomePage;
