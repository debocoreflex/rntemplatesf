import React from 'react';
import { render } from '@testing-library/react-native';
import SearchScreen from '../src/views/SearchScreen';

describe('SearchScreen', () => {
  it('renders without crashing', () => {
    const mockNavigation = {
      setOptions: jest.fn(),
      push: jest.fn(),
    };

    const { getByTestId } = render(
      <SearchScreen navigation={mockNavigation} />
    );

    expect(getByTestId('root-view')).toBeTruthy();
  });
});
