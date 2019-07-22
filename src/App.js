// App.js
import React, { Component } from "react";
import firebase from "firebase";
import AllList from "./components/AllList";
import YourList from "./components/YourList";
import Header from "./components/Header";
import "firebase/firestore";
import "./App.css";
import queryString from "query-string";

const liff = window.liff;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: "AllList",
      getProfileStatus: "",
      liffInitStatus: "",
      context: {
        displayName: "",
        userId: "",
        pictureUrl: "",
        statusMessage: "",
        groupId: ""
      }
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
    liff.init(
      data => {
        const groupId = data.context.groupId;
        liff
          .getProfile()
          .then(profile => {
            this.setState({
              context: {
                displayName: profile.displayName,
                userId: profile.userId,
                pictureUrl: profile.pictureUrl,
                statusMessage: profile.statusMessage,
                groupId: groupId
              },
              getProfileStatus: "success"
            });
          })
          .catch(err => {
            this.setState({
              getProfileStatus: "error"
            });
          });
      },
      err => {
        this.setState({
          liffInitStatus: "error"
        });
      }
    );
  };

  getTypePage = () => {
    const parsed = queryString.parse(window.location.search);
    if (parsed.mytask === "1") {
      this.setStage("YourList");
    }
  };

  setStage = stage => {
    this.setState({ stage });
  };

  componentDidMount() {
    this.getTypePage();
    window.addEventListener("load", this.initialize);
    // this.setState({
    //   context: {
    //     displayName: "J",
    //     userId: "Ud3f6ed0ecf179f61d9c325caec2ace0a",
    //     pictureUrl:
    //       "https://profile.line-scdn.net/0hGpx_kG9jGF9FJjKE5tFnCHljFjIyCB4XPURSPmEjQ2dtFQpbfEZWPDMlQjtvEAwKfkRQamZyEWZq",
    //     statusMessage: "status",
    //     groupId: "C1b9ec9ba0309c11507913a79bd39a945"
    //   }
    // });
  }

  render() {
    const { liffInitStatus, getProfileStatus, stage, context } = this.state;
    if (!context.displayName) {
      return (
        <h1>
          Waiting... data <br /> from LINE API
        </h1>
      );
    }
    if (liffInitStatus === "error") return <h1>FAIL: Initial LIFF</h1>;
    if (getProfileStatus === "error") return <h1>FAIL: Get Profile</h1>;

    const propToHeader = {
      title: stage === "AllList" ? "ALL TASKS" : "YOUR TASKS",
      context,
      stage,
      setStage: this.setStage,
      showBack: stage === "YourList"
    };
    return (
      <div className="container">
        <Header {...propToHeader} />
        <div className="container">
          {stage === "AllList" && <AllList context={context} />}
          {stage === "YourList" && <YourList context={context} />}
        </div>
      </div>
    );
  }
}

export default App;
