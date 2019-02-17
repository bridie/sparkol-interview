import React, { Component } from 'react';
import Authorization from '../authorization';

class Welcome extends Component {
  static generateGreeting() {
    const greetings = ['Aloha', 'Ahoy', 'Bonjour', 'G\'day', 'Hello', 'Hey', 'Hi', 'Hola', 'Howdy', 'Rawr', 'Sup', 'What\'s up'];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  static getUserName() {
    return Authorization.getUserName();
  }

  static logout() {
    Authorization.logout();
    window.location.reload();
  }

  render() {
    const greeting = Welcome.generateGreeting();
    const name = Welcome.getUserName();
    return (
      <div>
        <h1>{`${greeting}, ${name}`}</h1>
        <button className="c-button" type="button" onClick={Welcome.logout}>Logout</button>
      </div>
    );
  }
}

export default Welcome;
