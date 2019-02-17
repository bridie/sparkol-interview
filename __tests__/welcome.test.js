import React from 'react';
import renderer from 'react-test-renderer';

import Welcome from '../src/js/components/welcome';

it('renders correctly', () => {
  Welcome.generateGreeting = jest.fn(() => 'Hola');
  Welcome.getUserName = jest.fn(() => 'Will Shakes')

  const tree = renderer.create(<Welcome />).toJSON();
  expect(tree).toMatchSnapshot();
});
