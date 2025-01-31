import React, { memo, useEffect } from 'react';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BsPlusSquare } from 'react-icons/bs';
import { openModal } from '../store/modalSlice.js';
import { setCurrentChannelId, DEFAULT_CHANNEL_ID } from '../store/channelsSlice.js';

const ChannelsList = memo(({ channels, currentChannelId }) => {
  const { t } = useTranslation('chat');
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentChannelId && channels?.length > 0) {
      dispatch(setCurrentChannelId(DEFAULT_CHANNEL_ID));
    }
  }, [channels, currentChannelId, dispatch]);

  const handleChannelSelect = (channelId) => {
    if (currentChannelId !== channelId) {
      dispatch(setCurrentChannelId(channelId));
    }
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
          <span className="visually-hidden">{t('channels.add')}</span>
        </button>
      </div>
      <ul className="nav flex-column nav-pills">
        {channels && channels.map((channel) => (
          <li key={channel.id} className="nav-item w-100">
            <Dropdown as={ButtonGroup} className="d-flex mb-2">
              <Button
                variant={String(channel.id) === String(currentChannelId) ? 'secondary' : 'light'}
                className="w-100 text-start text-truncate"
                onClick={() => handleChannelSelect(channel.id)}
              >
                # {channel.name}
              </Button>
              {channel.removable && (
                <>
                  <Dropdown.Toggle split variant="light" id={`dropdown-toggle-${channel.id}`} />
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleRenameChannel(channel.id)}>
                      {t('channels.rename')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => {
						  handleRemoveChannel(channel.id);
						  dispatch(setCurrentChannelId(channel.id));
						  }}>
                      {t('channels.remove')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </>
              )}
            </Dropdown>
          </li>
        ))}
      </ul>
    </>
  );
});

export default ChannelsList;
