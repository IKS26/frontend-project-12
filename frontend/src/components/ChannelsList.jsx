import React, { memo, useEffect } from 'react';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BsPlusSquare } from 'react-icons/bs';
import { openModal } from '../store/modalSlice.js';
import { selectChannels, setCurrentChannelId, DEFAULT_CHANNEL_ID } from '../store/channelsSlice.js';

const ChannelsList = memo(({ currentChannelId }) => {
  const { t } = useTranslation('chat');
  const dispatch = useDispatch();
  const channels = useSelector(selectChannels);

  useEffect(() => {
    if (!Array.isArray(channels) || channels.length === 0 || !currentChannelId) {
		return;
	 }

	 const isCurrentChannelValid = channels.some((channel) => channel.id === currentChannelId);
	 const lastCreatedChannelId = localStorage.getItem('lastCreatedChannelId');

    if (!isCurrentChannelValid) {
    if (currentChannelId === lastCreatedChannelId) {
      console.log('Инициатор остаётся в новом канале:', currentChannelId);
    } else {
      console.log('Переключаемся обратно на DEFAULT_CHANNEL_ID');
      dispatch(setCurrentChannelId(DEFAULT_CHANNEL_ID));
    }
  }
  }, [channels, currentChannelId, dispatch]);

  const handleChannelSelect = (channelId) => {
	  dispatch(setCurrentChannelId(channelId));
  };

  const handleAddChannel = () => {
    dispatch(openModal({ type: 'add' }));
  };

  const handleRemoveChannel = (channelId) => {
    dispatch(openModal({ type: 'remove', channelId }));
  };

  const handleRenameChannel = (channelId) => {
    dispatch(openModal({ type: 'rename', channelId }));
  };

  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b className="text-dark">{t('channels.title')}</b>
        <button
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
          onClick={handleAddChannel}
        >
          <BsPlusSquare size={20} />
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul className="nav flex-column nav-pills">
        {channels.map((channel) => {
			const isActive = channel.id === currentChannelId;
          return (
            <li key={channel.id} className="nav-item w-100">
              <Dropdown as={ButtonGroup} className="d-flex mb-2">
                <Button
                  variant={isActive ? 'secondary' : ''}
                  className={`w-100 rounded-0 text-start text-truncate`}
                  onClick={() => handleChannelSelect(channel.id)}
                >
                 <span className="me-1">#</span>
					  {channel.name}
                </Button>
                {channel.removable && (
                  <>
                    <Dropdown.Toggle
                      split
                      variant={isActive ? 'secondary' : ''}
                    >
                      <span className="visually-hidden">{t('channels.setupChannel')}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleRenameChannel(channel.id)}>
                        {t('channels.rename')}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleRemoveChannel(channel.id)}>
                        {t('channels.remove')}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </>
                )}
              </Dropdown>
            </li>
          );
        })}
      </ul>
    </>
  );
});

export default ChannelsList;
