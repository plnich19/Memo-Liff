import React, { Component } from 'react';
import {Link, BrowserRouter as Router } from 'react-router-dom';
class Navbar extends Component {
    

  render() {
    return (
      <div>
        <ul>
            <li><Link to="/">All Tasks List</Link></li>
            <li><Link to="/YourList">Your Tasks List</Link></li>            
        </ul>
      </div>
    );
   }
  }
  export default Navbar;