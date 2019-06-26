// App.js
import React, { Component } from 'react';
import Header from '../src/components/Header';
import AllList from './components/AllList';
import YourList from './components/YourList';
import Navbar from './components/Navbar';
import firebase from 'firebase';
import 'firebase/firestore';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const liff = window.liff;

class App extends Component {
  constructor(props) {
    super(props);
    this.initialize = this.initialize.bind(this);
    this.state = {
      displayName: '',
      userId: '',
      pictureUrl: '',
      statusMessage: ''
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
      this.setState({
        displayName: profile.displayName,
        userId: profile.userId,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage
      });
    });
  }

  render() {
    const { children } = this.props
    return (
      <div className="container">
        <Header />
        <Navbar />
        {children}
      </div>
      //   <Router >
      //   <div className="container">
      //     <Header/>
      //     <Navbar/>
      //     <h1>HELLO</h1>
      //     {/* <AllList/> */}
      //     <Route path ="/" component={App}/>
      //     <Route path = "/AllList" component={AllList}/>
      //     <Route path = "/YourList" component={YourList}/>
      //   </div>
      // </Router>
    );
  }
}

// ReactDOM.render(routing, document.getElementById('root'));
export default App;