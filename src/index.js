import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

// front end mounting point
ReactDOM.render(
    <App />, 
    document.getElementById('root'));
registerServiceWorker();
