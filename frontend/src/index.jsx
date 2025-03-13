import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import init from './init.jsx';
import './index.css';

const app = async () => {
  const root = ReactDOM.createRoot(document.querySelector('#chat'));
  const socket = io({ autoConnect: false });
  const vdom = await init(socket);

  root.render(vdom);
};

app();
