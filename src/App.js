// App.js
import React, { Component } from 'react';
import Header from '../src/components/Header';
import MessageList from './components/MessageList';
import MessageBox from './components/MessageBox';
import firebase from 'firebase';

const liff = window.liff;  
class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      groupId: '',
      displayName : '',
      userId : '',
      pictureUrl : '',
      statusMessage : ''
    };

    this.initialize = this.initialize.bind(this);
    this.closeApp = this.closeApp.bind(this);

    var config = {
    apiKey: "AIzaSyAFXBsagqOOXzWySieOoYNDs8HaTUuRk6k",
    authDomain: "testproject-6e25f.firebaseapp.com",
    databaseURL: "https://testproject-6e25f.firebaseio.com/",
    projectId: "testproject-6e25f",
    storageBucket: "bucket.appspot.com",
    messagingSenderId: "841427036189"
  };
  firebase.initializeApp(config);
}

componentDidMount() {
  window.addEventListener('load', this.initialize);
}

initialize() {
  liff.init(async (data) => {
    let groupId = data.context.groupId;
    console.log(groupId)
    let profile = await liff.getProfile();
    this.setState({
      displayName : profile.displayName,
      userId : profile.userId,
      pictureUrl : profile.pictureUrl,
      statusMessage : profile.statusMessage
    });
  }); 
}

closeApp(event) {
  event.preventDefault();
  liff.sendMessages([{
    type: 'text',
    text: "Thank you, Bye!"
  }]).then(() => {
    liff.closeWindow();
  });
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
      {/* <Button color="primary" onClick={this.closeApp}>Close</Button> */}
    </div>
  );
 }
}
export default App;