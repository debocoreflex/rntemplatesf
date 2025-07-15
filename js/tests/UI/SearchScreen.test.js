import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import SearchScreen from '../../src/views/SearchScreen';
import ContactReactiveStore from '../../src/services/store/ContactReactiveStore';
import * as SmartStoreUtils from '../../src/services/store/SmartStoreUtils';
// Step 1: Mock performSync
const mockPerformSync = jest.fn();

// Step 2: Mock ContactViewModel to return mockPerformSync and dummy contacts
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
    ],
    filter: '',
    setSearchFilter: jest.fn(),
    addContact: jest.fn(),
    deleteContact: jest.fn(),
    syncContacts: mockPerformSync,
  }),
}));

// Step 3: Mock useSyncContext and SyncProvider with minimal context
jest.mock('../../src/common/reducers/SyncContext', () => {
  const React = require('react');
  const SyncContext = React.createContext(null);

  return {
    useSyncContext: () => ({
      syncState: { isLoading: false, isSynced: true },
      dataSynced: jest.fn(),
      logout: jest.fn(),
    }),
    SyncProvider: ({ children }) => (
      <SyncContext.Provider
        value={{
          syncState: { isLoading: false, isSynced: true },
          dataSynced: jest.fn(),
          logout: jest.fn(),
        }}
      >
        {children}
      </SyncContext.Provider>
    ),
  };
});

// Spy on actual sync functions
jest.mock('../../src/services/store/SmartStoreUtils', () => ({
  syncUpContacts: jest.fn(() => Promise.resolve('mock-syncUp')),
  reSyncContacts: jest.fn(() => Promise.resolve('mock-reSync')),
}));

// ✅ Test Suite
describe('SearchScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders contact list correctly', () => {
    render(<SearchScreen navigation={{ setOptions: jest.fn(), push: jest.fn() }} />);

    expect(screen.getByPlaceholderText('Search a contact...')).toBeTruthy();
    expect(screen.getByText('John Doe')).toBeTruthy();
  });

  it('should trigger performSync when Sync button is pressed', async () => {
    const { getByTestId } = render(
      <SearchScreen navigation={{ setOptions: jest.fn(), push: jest.fn() }} />
    );

    const syncButton = getByTestId('cloud-sync-button');
    fireEvent.press(syncButton);

    await waitFor(() => {
      expect(mockPerformSync).toHaveBeenCalledTimes(1);
    });
  });

  it('Queue processes ', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await ContactReactiveStore.performSync();

    // Wait for both to complete (2 queue operations)
    await new Promise((res) => setTimeout(res, 3000));

    expect(SmartStoreUtils.syncUpContacts).toHaveBeenCalledTimes(1);
    expect(SmartStoreUtils.reSyncContacts).toHaveBeenCalledTimes(1);

    // Optional: Assert log ordering
    const allLogs = logSpy.mock.calls.flat().join('\n');

    expect(allLogs).toMatch(/\[Queue] Enqueued: SyncUpContacts/);
    expect(allLogs).toMatch(/\[Queue] Processing: SyncUpContacts/);
    expect(allLogs).toMatch(/\[SyncUp] completed/);

    expect(allLogs).toMatch(/\[Queue] Enqueued: ReSyncContacts/);
    expect(allLogs).toMatch(/\[Queue] Processing: ReSyncContacts/);
    expect(allLogs).toMatch(/\[ReSync] completed/);

    logSpy.mockRestore();
  });
});
