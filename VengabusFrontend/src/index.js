import React from 'react';
import ReactDOM from 'react-dom';
import './Setup/index.css';
import registerServiceWorker from './Setup/registerServiceWorker';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
