import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store.js';
import init from './init.jsx';

const app = async () => {
  const root = ReactDOM.createRoot(document.querySelector('#chat'));
  const vdom = await init();
  root.render(
  <StrictMode>
	 <Provider store={store}>
	 {vdom}
    </Provider>
  </StrictMode>);
};

app();
