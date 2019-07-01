// App.js
import React, { Component, setStage, stage } from 'react';
import Header from '../src/components/Header';
import YourList from './components/YourList';
import AllList from './components/AllList';
import firebase from 'firebase';
import 'firebase/firestore';
import './App.css'

const liff = window.liff;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
      userId: '',
      pictureUrl: '',
      groupId: '',
      statusMessage: '',
      stage: 'AllList'
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

  initialize = () => {
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
    // liff.init(this.liffSuccess, this.liffError)
  }

  

  componentDidMount() {
    window.addEventListener('load', this.initialize);
    
  }

  liffSuccess = () => {
    console.log("liffSuccess")
  }

  liffError = () => {
    console.log("liffError")
  }

//   test() {
//     return this.state.data.map((data) => {
//         var { groupId } = data
//         return (
//             <tr>
//                 <td>{groupId}</td>
                
//             </tr>
//         )
//     }
//     )
// }

  
  render() {
    // const { children } = this.props;

    return (
      <div className="container">
        <Header />
        {/* <Navbar></Navbar>
        {children} */}
        <div className="nav">
          <div onClick={() => { this.setState({stage:'AllList'}) }}>All List</div>
          <div onClick={() => { this.setState({stage:'YourList'}) }}>YourList</div>
        </div>
        <div className="container">
          {this.state.stage === 'AllList' && <AllList groupId = {this.state.groupId}/>}
          {this.state.stage === 'YourList' && <YourList />}
        </div>
        <p>
          {this.state.groupId}
        </p>
        
      </div>

    );
  }
}

// ReactDOM.render(routing, document.getElementById('root'));
export default App;