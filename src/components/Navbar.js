import React, { Component } from 'react';
import {NavLink
    // , BrowserRouter as Router 
  } from 'react-router-dom';
import './Navbar.css';

class Navbar extends Component {

    

  render() {
    return (
      <div>
        
          <NavLink to="/"><button className='allTaskButton'> All Tasks List</button> </NavLink>
          <NavLink to="/YourList"><button className='yourTaskButton'> Your Tasks List </button> </NavLink>        
        
      </div>
    );
   }
  }
  export default Navbar;