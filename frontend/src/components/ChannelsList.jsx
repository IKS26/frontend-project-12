import React, { memo } from 'react';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { BsPlusSquare } from 'react-icons/bs';
import { openModal } from '../store/modalSlice.js';
import { setCurrentChannelId } from '../store/channelsSlice.js';

const ChannelsList = memo(({ channels, currentChannelId}) => {
  const dispatch = useDispatch();

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
        <b className="text-dark">Каналы</b>
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
        {channels && channels.map((channel) => (
          <li key={channel.id} className="nav-item w-100">
            <Dropdown as={ButtonGroup} className="d-flex mb-2">
              <Button
                variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                className="w-100 text-start text-truncate"
                onClick={() => handleChannelSelect(channel.id)}
              >
                # {channel.name}
              </Button>
              {channel.removable && (
                <>
                  <Dropdown.Toggle split variant="light" id={`dropdown-toggle-${channel.id}`} />
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleRenameChannel(channel.id)}
                    >
                      Переименовать
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleRemoveChannel(channel.id)}
                    >
                      Удалить
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
