import React, { Component } from 'react';

class Header extends Component {

  render() {
    return (
      <div className="page-header">
        <h1><a href="/">Online Homilies</a></h1>
        <p>This is a collection of homilies given at the <a alt="WashUCSC" href="http://washucsc.org">Washington University Catholic Student Center</a> from mid 2000 through present day.</p>
      </div>
    );
  }

}

export default Header;
