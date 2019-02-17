import React from 'react';
import ReactDom from 'react-dom';
import AuthorizedHOC from './higher-order-components/authorized';
import Welcome from './components/welcome';

const Authorized = AuthorizedHOC(Welcome);

ReactDom.render(
  <Authorized />,
  document.getElementById('root'),
);
