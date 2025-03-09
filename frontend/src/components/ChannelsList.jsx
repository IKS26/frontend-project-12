import React, { memo, useEffect } from 'react';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BsPlusSquare } from 'react-icons/bs';
import { openModal } from '../store/modalSlice.js';
import {
  selectChannels,
  setCurrentChannelId,
  addChannels,
  DEFAULT_CHANNEL_ID,
} from '../store/channelsSlice.js';
import { useFetchChannelsQuery } from '../services/dataApi.js';

const ChannelsList = memo(({ currentChannelId }) => {
  const { t } = useTranslation('chat');
  const dispatch = useDispatch();
  const { data: channels = [], isSuccess } = useFetchChannelsQuery();
  const storedChannels = useSelector(selectChannels);
  const isCurrentChannelValid = storedChannels.some((channel) => channel.id === currentChannelId);
  const lastCreatedChannelId = localStorage.getItem('lastCreatedChannelId');

  useEffect(() => {
    if (isSuccess && channels) {
      dispatch(addChannels(channels));
    }
  }, [isSuccess, channels, dispatch]);

  useEffect(() => {
    if (storedChannels.length === 0) {
      return;
    }

    if (lastCreatedChannelId) {
      const lastChannelExists = storedChannels.some((ch) => ch.id === Number(lastCreatedChannelId));

      if (lastChannelExists) {
        dispatch(setCurrentChannelId(Number(lastCreatedChannelId)));
        localStorage.removeItem('lastCreatedChannelId');
        return;
      }
    }

    if (!isCurrentChannelValid) {
      dispatch(setCurrentChannelId(DEFAULT_CHANNEL_ID));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedChannels, dispatch]);

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
      <div className="d-flex justify-content-between mt-1 mb-2 ps-4 pe-2 p-4">
        <h5>
          {t('channels.title')}
        </h5>
        <button
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
          onClick={handleAddChannel}
        >
          <BsPlusSquare size={20} color="#ffc107" />
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul className="nav flex-column nav-pills">
        {storedChannels.map((channel) => {
          const isActive = channel.id === currentChannelId;
          return (
            <li key={channel.id} className="nav-item w-100">
              <Dropdown as={ButtonGroup} className="d-flex mb-2">
                <Button
                  variant={isActive ? 'secondary' : 'light'}
                  className="w-100 rounded-0 text-start text-truncate"
                  onClick={() => handleChannelSelect(channel.id)}
                >
                  <span className="me-1">#</span>
                  {channel.name}
                </Button>
                {channel.removable && (
                  <>
                    <Dropdown.Toggle split variant={isActive ? 'secondary' : 'light'}>
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

ChannelsList.displayName = 'ChannelsList';

export default ChannelsList;
