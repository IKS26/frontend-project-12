import React from 'react';
import { useSelector } from 'react-redux';
import { useFetchChannelsQuery } from '../api/dataApi';
import { selectModalState } from '../store/modalSlice';
import { selectCurrentChannelId } from '../store/channelsSlice';
import ChannelsList from '../components/ChannelsList';
import MessagesBox from '../components/MessagesBox';
import MessageInput from '../components/MessageInput';
import ChatSpinner from '../components/spinners/ChatSpinner.jsx';
import Modal from '../components/modals/index.jsx';

const HomePage = () => {
  const { isLoading } = useFetchChannelsQuery();
  const modalState = useSelector(selectModalState);
  const currentChannelId = useSelector(selectCurrentChannelId);

  return (
    isLoading
      ? (<ChatSpinner />)
      : (
        <div className="container d-flex flex-column rounded shadow overflow-hidden h-100 g-0 my-4">
          <div className="d-flex flex-grow-1 overflow-hidden">
            <div className="channels-container overflow-auto">
              <ChannelsList currentChannelId={currentChannelId} />
            </div>
            <div className="messages-container d-flex flex-column flex-grow-1">
              <MessagesBox currentChannelId={currentChannelId} />
              <MessageInput currentChannelId={currentChannelId} />
            </div>
          </div>
          {modalState.isOpen && <Modal />}
        </div>
      )
  );
};

export default HomePage;
