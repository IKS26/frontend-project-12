import React, { memo, useEffect } from 'react';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BsPlusSquare } from 'react-icons/bs';
import { openModal } from '../store/modalSlice.js';
import {
  setCurrentChannelId,
  addChannels,
  selectCurrentChannelId,
  DEFAULT_CHANNEL_ID,
} from '../store/channelsSlice.js';
import { useFetchChannelsQuery } from '../api/dataApi.js';

const ChannelsList = memo(() => {
  const { t } = useTranslation('chat');
  const dispatch = useDispatch();
  const { data: channels = [], isSuccess } = useFetchChannelsQuery();
  const currentChannelId = useSelector(selectCurrentChannelId);
  const channelExists = channels.some((channel) => channel.id === currentChannelId);

  useEffect(() => {
    if (!isSuccess || channels.length === 0) return;

    dispatch(addChannels(channels));

    if (!channelExists) {
      dispatch(setCurrentChannelId(DEFAULT_CHANNEL_ID));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, channels, dispatch]);

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
        <h5>{t('channels.title')}</h5>
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
        {channels?.map((channel) => {
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
