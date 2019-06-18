// App.js
import React, { Component } from 'react';
import Header from '../src/components/Header';
import MessageList from './components/MessageList';
import MessageBox from './components/MessageBox';
import firebase from 'firebase';
class App extends Component {
  constructor(props){super(props);var config = {
    apiKey: "AIzaSyAFXBsagqOOXzWySieOoYNDs8HaTUuRk6k",
    authDomain: "testproject-6e25f.firebaseapp.com",
    databaseURL: "https://testproject-6e25f.firebaseio.com/",
    projectId: "testproject-6e25f",
    storageBucket: "bucket.appspot.com",
    messagingSenderId: "841427036189"
  };
  firebase.initializeApp(config);
}
render() {
  return (
    <div className="container">
      <Header title="Simple Firebase App" />
      <div className="columns">
        <div className="column is-3"></div>
        <div className="column is-6">
          <MessageList db={firebase} />
        </div>
      </div>
      <div className="columns">
        <div className="column is-3"></div>
        <div className="column is-6">
          <MessageBox db={firebase} />
        </div>
      </div>
    </div>
  );
 }
}
export default App;