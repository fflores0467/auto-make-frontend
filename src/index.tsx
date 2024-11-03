import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Root/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import { store } from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter basename='/auto-make-frontend'>
      <Provider store={store}>  
        <App />
      </Provider>
    </BrowserRouter>
    
  </React.StrictMode>
);
