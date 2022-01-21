import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';


import React from 'react';
import { render } from 'react-testing-library';
import Home from "containers/home/home_page";


it('renders welcome message', () => {
  const { getByText } = render(<Home/>);
  expect(getByText('Welcome to React')).toBeInTheDocument();
});

