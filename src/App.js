// App.js
import React, { Component } from 'react';
import Header from '../src/components/Header';
import Navbar from './components/Navbar';
import YourList from './components/YourList'
import firebase from 'firebase';
import 'firebase/firestore';

const liff = window.liff;

class App extends Component {
  constructor(props) {
    super(props);
    this.initialize = this.initialize.bind(this);
    this.state = {
      displayName: '',
      userId: '',
      pictureUrl: '',
      groupId: '',
      statusMessage: '',
      
    };


    var config = {
      apiKey: "AIzaSyCmCs0fRWBIGywo2XEwYV08rtyIqk8Kcdw",
      authDomain: "memo-chatbot.firebaseapp.com",
      databaseURL: "https://memo-chatbot.firebaseio.com",
      projectId: "memo-chatbot",
      storageBucket: "memo-chatbot.appspot.com",
      messagingSenderId: "1021071669137",
      appId: "1:1021071669137:web:60637043b6e3d025"
    };
    firebase.initializeApp(config);
  }

  componentDidMount() {
    window.addEventListener('load', this.initialize);

  }

  initialize() {
    liff.init(async (data) => {
      let profile = await liff.getProfile();
      const groupId = await data.context.groupId;
      this.setState({
        displayName: profile.displayName,
        userId: profile.userId,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
        groupId: groupId
      });
    });
  }

  render() {
    const {children} = this.props;
    
    return (
      <div className="container">
        
        <Header />
        <Navbar></Navbar>
        {children}
      </div>

    );
  }
}

// ReactDOM.render(routing, document.getElementById('root'));
export default App;