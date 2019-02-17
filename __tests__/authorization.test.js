import Authorization from '../src/js/authorization';

jest.mock('../src/js/config', () => (
  {
    auth: {
      url: 'http://example.com',
      port: 3333,
      endpoints: {
        login: '/login',
        verifyToken: '/verifyToken',
      },
    }
  }
));

describe('authorisation class', () => {
  test('gets the correct login url', () => {
    const loginUrl = Authorization.getLoginUrl();
    expect(loginUrl).toBe('http://example.com:3333/login');
  });

  test('gets the correct verify token url', () => {
    const loginUrl = Authorization.getVerifyTokenUrl();
    expect(loginUrl).toBe('http://example.com:3333/verifyToken');
  });

  describe('when logging in', () => {
    const username = 'user01';
    const password = 'password';
    const data = { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTm9ybWFuIE5vcm1hbCJ9.iffiKTKqhx9qZHois_GxWSXm0nkHWnRY7kKkcEI-M_Y' }
    let successCb;
    let failureCb;
    let spy;

    beforeEach(() => {
      successCb = jest.fn();
      failureCb = jest.fn();
      spy = jest.spyOn(Storage.prototype, 'setItem');
    });

    afterEach(() => {
      spy.mockClear()
    });

    test('the login endpoint is called with the correct data', () => {
      const data = {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json',
        }
      }

      window.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => data
        })
      );

      Authorization.login(username, password, successCb, failureCb);
      expect(window.fetch).toHaveBeenCalledWith('http://example.com:3333/login', data);
    });

    test('successfully, the success callback is called', () => {
      window.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => data
        })
      );

      Authorization.login(username, password, successCb, failureCb)
        .then(() => expect(successCb).toHaveBeenCalled());
    });

    test('successfully, the token is stored in local storage', () => {
      window.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => data
        })
      );

      Authorization.login(username, password, successCb, failureCb)
        .then(() => expect(spy).toHaveBeenCalledWith('token', data.token));
    });

    test('unsuccessfully, the failure callback is called', () => {
      window.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          status: 401,
          ok: false
        })
      );

      Authorization.login(username, password, successCb, failureCb)
        .then(() => expect(failureCb).toHaveBeenCalled());
    });

    test('errors, the failure callback is called', () => {
      window.fetch = jest.fn().mockImplementation(() =>
        Promise.reject()
      );

      Authorization.login(username, password, successCb, failureCb)
        .then(() => expect(failureCb).toHaveBeenCalled());
    });

    test('unsuccessfully, the token is not stored in local storage', () => {
      window.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          status: 401,
          ok: false
        })
      );

      Authorization.login(username, password, successCb, failureCb)
        .then(() => expect(spy).toHaveBeenCalledTimes(0));
    });

    test('errors, the token is not stored in local storage', () => {
      window.fetch = jest.fn().mockImplementation(() =>
        Promise.reject()
      );

      Authorization.login(username, password, successCb, failureCb)
        .then(() => expect(spy).toHaveBeenCalledTimes(0));
    });
  });

  test('removes the token when log out is called', () => {
    const spy = jest.spyOn(Storage.prototype, 'removeItem');
    Authorization.logout();
    expect(spy).toHaveBeenCalledWith('token');
  });

  describe('when verifying the token', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTm9ybWFuIE5vcm1hbCJ9.iffiKTKqhx9qZHois_GxWSXm0nkHWnRY7kKkcEI-M_Y';
    let successCb;
    let failureCb;

    beforeEach(() => {
      successCb = jest.fn();
      failureCb = jest.fn();
      Storage.prototype.getItem = jest.fn(() => token);
    });

    test('the verify token endpoint is called with the correct data', () => {
      const data = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      window.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200
        })
      );

      Authorization.verify(successCb, failureCb);
      expect(window.fetch).toHaveBeenCalledWith('http://example.com:3333/verifyToken', data);
    });

    test('successfully, the success callback is called', () => {
      window.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200
        })
      );

      Authorization.verify(successCb, failureCb)
        .then(() => {
          expect(successCb).toBeCalled()
        });
    });

    test('and there is no token, the failure callback is called', () => {
      Storage.prototype.getItem = jest.fn(() => null);
      Authorization.verify(successCb, failureCb);
      expect(failureCb).toBeCalled();
    });

    test('and there is a token, but it fails, the failure callback is called', () => {
      window.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 401
        })
      );

      Authorization.verify(successCb, failureCb)
        .then(() => {
          expect(failureCb).toBeCalled()
        });
    });

    test('and there is a token, but it errors, the failure callback is called', () => {
      window.fetch = jest.fn().mockImplementation(() =>
        Promise.reject()
      );

      Authorization.verify(successCb, failureCb)
        .then(() => {
          expect(failureCb).toBeCalled()
        });
    });
  });
})
