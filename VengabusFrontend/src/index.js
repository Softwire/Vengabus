import React from 'react';
import ReactDOM from 'react-dom';
import './Setup/index.css';
import { unregister as deregisterAnyExistingServiceWorker } from './Setup/registerServiceWorker';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

// See comments in the Setup/registerServiceWorker.js file.
// This primarily provides a sticky offline-cached version
// of the site.
// However the current Azure caching config has the
// side - effect of making it almost impossible to release
// a new version and have it picked up by the users.
// The caching is probably a valuable feature for most sites,
// but since we're only interested in data from Azure, it's
// completely irrelevant to us, so we just disable it.
// Unfortunately we need to *actively* remove it from the
// client-side browser, so we can't just remove the 'register()'
// call entirely.
//
// If we ever want to re-instate this functionality, then we
// need to sort out Azure config so that ServiceWorker.js is
// not cached at all (or at least has a very short life-span)
deregisterAnyExistingServiceWorker();
