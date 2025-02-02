import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import rollbar from '../rollbar.js';
import { Provider } from 'react-redux';
import store from './store/store.js';
import init from './init.jsx';
import './index.css';

const app = async () => {
  const root = ReactDOM.createRoot(document.querySelector('#chat'));
  const vdom = await init();

  root.render(
	<RollbarProvider instance={rollbar}>
    <ErrorBoundary>
	  <Provider store={store}>
	   {vdom}
     </Provider>
    </ErrorBoundary>
   </RollbarProvider>
);
};

app();
