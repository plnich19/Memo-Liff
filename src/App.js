// App.js
import React, { Component } from 'react';
import Header from '../src/components/Header';
import Navbar from './components/Navbar';
// import YourList from './components/YourList'
import firebase from 'firebase';
import 'firebase/firestore';
import './App.css'


import AllList from './components/AllList';
import YourList from './components/YourList';

const liff = window.liff;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 'YourList',
      context:null,
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
    this.setState(
      {
        context:{
            displayName: 'พิช',
            userId: 'U58bdafa345cc971e0a1fdfb2b199ba7a',
            pictureUrl: 'https://profile.line-scdn.net/0h4AhU0SMea25VLEEbfMsUOWlpZQMiAm0mLR0jWnEoYAt6Sy8_OxonCHglNQwvTyQ_aUkiWHh4YV4q',
            statusMessage: 'status',
            groupId: 'groupId-fadgeagsdfreasdgfgesdf'
          }
      }
    );

  }

  liffSuccess = () => {
      console.log("liffSuccess")
  }

  liffError = () => {
      console.log("liffError")
  }

  initialize = (props) => {
    console.log('onLoadInitialize',props)
    liff.init(this.liffSuccess, this.liffError)
  }

  render() {
    console.log('App props',this.props)
    console.log('App state',this.state)
    if(!this.state.context){ return '';}
    return ( 
      <div className="container">
        <Header />
        <div className="nav">
          <div onClick={() => { this.setState({stage:'AllList'}) }}>All List</div>
          <div onClick={() => { this.setState({stage:'YourList'}) }}>YourList</div>
        </div>
        <div className="container">
          {this.state.stage === 'AllList' && <AllList context={this.state.context}/>}
          {this.state.stage === 'YourList' && <YourList context={this.state.context}/>}
        </div>
      </div>
    );
  }
}

// ReactDOM.render(routing, document.getElementById('root'));
export default App;