// __tests__/SearchScreen.test.js

import React from 'react';
import { render, screen } from '@testing-library/react-native';

import SearchScreen from '../../src/views/SearchScreen';

jest.mock('../../src/viewmodels/ContactViewModel', () => ({
  ContactViewModel: () => ({
    contacts: [
      {
        Id: '1',
        FirstName: 'John',
        LastName: 'Doe',
        Title: 'Engineer',
        Email: 'john@example.com',
        MobilePhone: '1234567890',
        Department: 'Engineering',
      },
      {
        Id: '2',
        FirstName: 'Jane',
        LastName: 'Smith',
        Title: 'Designer',
        Email: 'jane@example.com',
        MobilePhone: '0987654321',
        Department: 'Design',
      },
    ],
    filter: '',
    setSearchFilter: jest.fn(),
    addContact: jest.fn(),
    deleteContact: jest.fn(),
  })
}));

describe('SearchScreen', () => {
  it('should display dummy contact list', () => {
    render(<SearchScreen navigation={{ setOptions: jest.fn(), push: jest.fn() }} />);

    expect(screen.getByPlaceholderText('Search a contact...')).toBeTruthy();
    //expect(screen.getByText('Add mukh')).toBeTruthy();
    expect(screen.getByText('Jane Smith')).toBeTruthy();
  });
});
