import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const firebase = require('firebase');
require('firebase/firestore');

var firebaseConfig = {
  apiKey: "AIzaSyBh8GGzBVy_wJGBjREICVdIueLF5re-U_I",
  authDomain: "evernote-clone-5e369.firebaseapp.com",
  databaseURL: "https://evernote-clone-5e369.firebaseio.com",
  projectId: "evernote-clone-5e369",
  storageBucket: "evernote-clone-5e369.appspot.com",
  messagingSenderId: "733554431721",
  appId: "1:733554431721:web:5944db94dc5ce745da8278",
  measurementId: "G-E3KMQDBWHE"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
