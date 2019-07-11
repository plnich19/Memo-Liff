// App.js
import React, { Component } from 'react'
import firebase from 'firebase'
import Header from './components/Header'
import AllList from './components/AllList'
import YourList from './components/YourList'
import 'firebase/firestore'
import './App.css'

const liff = window.liff

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stage: 'AllList',
      getProfileStatus: '',
      liffInitStatus: '',
      context: {
        displayName: '',
        userId: '',
        pictureUrl: '',
        statusMessage: '',
        groupId: '',
      },

    }
    var config = {
      apiKey: 'AIzaSyCmCs0fRWBIGywo2XEwYV08rtyIqk8Kcdw',
      authDomain: 'memo-chatbot.firebaseapp.com',
      databaseURL: 'https://memo-chatbot.firebaseio.com',
      projectId: 'memo-chatbot',
      storageBucket: 'memo-chatbot.appspot.com',
      messagingSenderId: '1021071669137',
      appId: '1:1021071669137:web:60637043b6e3d025',
    }
    firebase.initializeApp(config)

  }

  initialize = () => {
    liff.init(
      (data) => {
        const groupId = data.context.groupId;
        liff.getProfile()
        .then((profile) => {
          this.setState({
            context: {
              displayName: profile.displayName,
              userId: profile.userId,
              pictureUrl: profile.pictureUrl,
              statusMessage: profile.statusMessage,
              groupId: groupId
            },
            getProfileStatus: 'success'
          });
        })
        .catch((err) => {
          this.setState({
            getProfileStatus: 'error'
          })
        })
      },
      (err) => {
        this.setState({
          liffInitStatus: 'error'
        })
      }
    );
  }

  componentDidMount() {
    window.addEventListener('load', this.initialize)
    // this.setState(
    //   {
    //     context:{
    //       displayName: 'J',
    //       userId: 'Ud3f6ed0ecf179f61d9c325caec2ace0a',
    //       pictureUrl: 'https://profile.line-scdn.net/0h4AhU0SMea25VLEEbfMsUOWlpZQMiAm0mLR0jWnEoYAt6Sy8_OxonCHglNQwvTyQ_aUkiWHh4YV4q',
    //       statusMessage: 'status',
    //       groupId: 'Ce938b6c2ba40812b0afa36e11078ec56',
    //     },
    //   },
    // )

  }

  render() {
    const { liffInitStatus, getProfileStatus, stage, context } = this.state
    if (!context.displayName) {
      return (
        <h1>Waiting... data from LINE API</h1>
      )
    }
    if (liffInitStatus === 'error') return <h1>liffInitStatus ERROR !!!!</h1>
    if (getProfileStatus === 'error') return <h1>getProfile ERROR !!!!</h1>

    return (
      <div className="container">
        <Header />
        <div className="nav">
          <div onClick={() => { this.setState({ stage: 'AllList' }) }}>All List</div>
          <div onClick={() => { this.setState({ stage: 'YourList' }) }}>YourList</div>
        </div>
        <div className="container">
          {stage === 'AllList' && <AllList context={context} />}
          {stage === 'YourList' && <YourList context={context} />}
        </div>
      </div>
    )
  }
}

// ReactDOM.render(routing, document.getElementById('root'));
export default App