import React, { Component } from "react";
import logo from "./logo.svg";
import "./Rover.scss";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>

        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p><a href="http://localhost:3001/auth/google
        ">Sign in with Google</a></p>
      </div>
    );
  }
}

export default App;
