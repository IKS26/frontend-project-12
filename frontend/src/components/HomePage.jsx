import React, { useEffect } from 'react';
import { BsPlusSquare, BsArrowRightSquare } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels } from '../store/channelsSlice.js';
import { fetchMessages } from '../store/messagesSlice.js';

const HomePage = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);
  const messages = useSelector((state) => state.messages.messages);

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 flex-md-row chat-bg">
        <div className="col-4 col-md-2 border-end px-0 flex-column h-100 d-flex channels-bg">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b className="text-dark">Каналы</b>
            <button type="button" className="p-0 text-primary btn btn-group-vertical">
              <BsPlusSquare size={20} />
              <span className="visually-hidden">+</span>
            </button>
          </div>
          <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            {channels.map((channel) => (
              <li key={channel.id} className="nav-item w-100">
                <button type="button" className="w-100 rounded-0 text-start btn">
                  <span className="me-1">#</span>{channel.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="mb-4 p-3 shadow-sm small messages-bg">
              <p className="m-0">
                <b className="text-dark"># {channels.find(channel => channel.id === messages[0]?.channelId)?.name || 'undefined'}</b>
              </p>
              <span className="text-muted">{messages.length} сообщений</span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5">
              {messages.map((message) => (
                <div key={message.id}>{message.text}</div>
              ))}
            </div>
            <div className="mt-auto px-5 py-3">
              <form noValidate className="py-1 border rounded-2">
                <div className="input-group has-validation">
                  <input name="body" aria-label="Новое сообщение" placeholder="Введите сообщение..." className="border-1 p-0 ps-2 form-control input-message-bg" />
                  <button type="submit" className="btn btn-group-vertical">
                    <BsArrowRightSquare size={20} />
                    <span className="visually-hidden">Отправить</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
