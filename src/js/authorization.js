import config from './config';
import jwtDecode from 'jwt-decode';

class Authorization {
  static getLoginUrl() {
    const { url, port, endpoints } = config.auth;
    return `${url}:${port}${endpoints.login}`;
  }

  static getVerifyTokenUrl() {
    const { url, port, endpoints } = config.auth;
    return `${url}:${port}${endpoints.verifyToken}`;
  }

  static getUserName() {
    const token = localStorage.getItem('token');
    if (!token) {
      return '';
    }

    const decoded = jwtDecode(token);
    return decoded.user.name;
  }

  static login(username, password, successCb, failureCb) {
    const authData = { username, password };
    const url = Authorization.getLoginUrl();

    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(authData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then((response) => {
      localStorage.setItem('token', response.token);
      successCb();
    })
    .catch(() => failureCb());
  }

  static logout() {
    localStorage.removeItem('token');
  }

  static verify(successCb, failureCb) {
    const token = localStorage.getItem('token');

    if (!token) {
      failureCb();
      return;
    }

    const url = Authorization.getVerifyTokenUrl();
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const isAuthorized = (response.status === 200 && response.ok === true);
      isAuthorized ? successCb() : failureCb();
    })
    .catch(() => failureCb());
  }
}

export default Authorization;
