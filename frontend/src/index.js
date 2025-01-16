import ReactDOM from 'react-dom/client.js';
import init from './init.jsx';

const app = async () => {
  const root = ReactDOM.createRoot(document.querySelector('#chat'));
  root.render(await init());
};

app();
