// __tests__/SearchScreen.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

import SearchScreen from '../../src/views/SearchScreen';
import { reSyncContacts, syncUpContacts } from '../../src/services/store/SmartStoreUtils';
import ContactReactiveStore from '../../src/services/store/ContactReactiveStore';
const mockPerformSync = jest.fn();

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
    syncContacts: mockPerformSync,
  })
}));

jest.mock('../../src/common/reducers/SyncContext', () => ({
  useSyncContext: () => ({
    syncState: { isLoading: false, isSynced: true },
    dataSynced: jest.fn(),
    logout: jest.fn(),
  }),
}));

jest.mock('../../src/services/store/ContactReactiveStore', () => ({
  initLoad: jest.fn(),
}));

jest.mock('../../src/services/store/SmartStoreUtils', () => ({
  reSyncContacts: jest.fn(() => Promise.resolve()),
}));

describe('SearchScreen', () => {
  it('should display dummy contact list', () => {
    render(<SearchScreen navigation={{ setOptions: jest.fn(), push: jest.fn() }} />);

    expect(screen.getByPlaceholderText('Search a contact...')).toBeTruthy();
    //expect(screen.getByText('Add mukh')).toBeTruthy();
    expect(screen.getByText('Jane Smith')).toBeTruthy();
  });
   it('should trigger performSync when Sync button is pressed', async () => {
    render(<SearchScreen navigation={{ setOptions: jest.fn(), push: jest.fn() }} />);
    
    const syncButton = screen.getByTestId('cloud-sync-button');
    fireEvent.press(syncButton);

    await waitFor(() => {
      expect(mockPerformSync).toHaveBeenCalled();
    });
  });

  // it('calls reSync and updates store on sync button press', async () => {
  //   render(<SearchScreen navigation={{ setOptions: jest.fn(), push: jest.fn() }} />);

  //   const syncButton = await screen.findByTestId('cloud-sync-button');
  //   fireEvent.press(syncButton);

  //   await waitFor(() => {
  //     expect(reSyncContacts).toHaveBeenCalled();
  //     expect(ContactReactiveStore.initLoad).toHaveBeenCalled();
  //   });
  // });
});
