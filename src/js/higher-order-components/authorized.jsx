import React, { Component } from 'react';
import Login from '../components/login';
import Authorization from '../authorization';

function Authorized(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        isAuthorized: false,
        authChecked: false,
      };

      this.successCb = this.successCb.bind(this);
      this.failureCb = this.failureCb.bind(this);
    }

    componentDidMount() {
      Authorization.verify(this.successCb, this.failureCb);
    }

    authChecked(isAuthorized) {
      this.setState({ isAuthorized, authChecked: true });
    }

    failureCb() {
      this.authChecked(false);
    }

    successCb() {
      this.authChecked(true);
    }

    render() {
      const { authChecked, isAuthorized } = this.state;

      if (!authChecked) {
        return 'Loading...';
      }

      if (authChecked && isAuthorized) {
        return <WrappedComponent {...this.props} />;
      }
      return <Login />;
    }
  };
}

export default Authorized;
