import React, { Component } from 'react';
import Authorization from '../authorization';

class Login extends Component {
  static successCb() {
    window.location.reload();
  }

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlePassChange(evt) {
    this.setState({
      password: evt.target.value,
    });
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const { username, password } = this.state;
    Authorization.login(username, password, Login.successCb);
  }

  handleUserChange(evt) {
    this.setState({
      username: evt.target.value,
    });
  }

  render() {
    const { username, password } = this.state;

    return (
      <div>
        <div className="l-heading">
          <h1>Login</h1>
        </div>

        <form onSubmit={this.handleSubmit} className="c-login-form">
          <label className="c-login-form__label" htmlFor="username">
            Username
            <input id="username" className="c-login-form__input" type="text" value={username} onChange={this.handleUserChange} required />
          </label>
          <label className="c-login-form__label" htmlFor="password">
            Password
            <input id="password" className="c-login-form__input" type="password" value={password} onChange={this.handlePassChange} required />
          </label>

          <button className="c-button" type="submit">Login</button>
        </form>
      </div>

    );
  }
}

export default Login;
