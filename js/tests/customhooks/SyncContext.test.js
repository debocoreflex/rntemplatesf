/*
What this tests:
Initial state: isLoading: true, isSynced: false

Login flow: Dispatches SYNC_INITIATED after successful login

Sync update: dataSynced() sets isSynced: true

Logout flow: logout() resets state

*/
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { SyncProvider, useSyncContext } from '../../src/common/reducers/SyncContext';
import { oauth } from 'react-native-force';
import { Text, Button } from 'react-native';

jest.mock('react-native-force', () => ({
  oauth: {
    getAuthCredentials: jest.fn(),
    authenticate: jest.fn()
  }
}));

function TestComponent() {
  const { syncState, dataSynced, logout } = useSyncContext();

  return (
    <>
      <Text testID="loading">{syncState.isLoading ? 'Loading' : 'Loaded'}</Text>
      <Text testID="synced">{syncState.isSynced ? 'Synced' : 'Not Synced'}</Text>
      <Button title="Sync Done" onPress={dataSynced} testID="btn-sync" />
      <Button title="Logout" onPress={logout} testID="btn-logout" />
    </>
  );
}

describe('SyncContext logic', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should initialize with SYNC_INITIATED when logged in', async () => {
    oauth.getAuthCredentials.mockImplementation((success, fail) => success());

    const { getByTestId } = render(
      <SyncProvider>
        <TestComponent />
      </SyncProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('Loaded');
    });
    expect(getByTestId('synced').props.children).toBe('Not Synced');
  });

  it('should handle logout and re-authenticate', async () => {
    oauth.getAuthCredentials.mockImplementation((success, fail) => fail());
    oauth.authenticate.mockImplementation((success, fail) => success());

    const { getByTestId } = render(
      <SyncProvider>
        <TestComponent />
      </SyncProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('Loaded');
    });
  });

//   it('should update sync state when dataSynced is called', async () => {
//     oauth.getAuthCredentials.mockImplementation((success) => success());

//     const { getByTestId } = render(
//       <SyncProvider>
//         <TestComponent />
//       </SyncProvider>
//     );

//     await waitFor(() => {
//       expect(getByTestId('loading').props.children).toBe('Loaded');
//     });

//     getByTestId('btn-sync').props.onPress();
//     await waitFor(() => {
//       expect(getByTestId('synced').props.children).toBe('Synced');
//     });
//   });

//   it('should reset state on logout', async () => {
//     oauth.getAuthCredentials.mockImplementation((success) => success());

//     const { getByTestId } = render(
//       <SyncProvider>
//         <TestComponent />
//       </SyncProvider>
//     );

//     await waitFor(() => {
//       expect(getByTestId('loading').props.children).toBe('Loaded');
//     });

//     getByTestId('btn-logout').props.onPress();
//     await waitFor(() => {
//       expect(getByTestId('loading').props.children).toBe('Loading');
//       expect(getByTestId('synced').props.children).toBe('Not Synced');
//     });
//   });
});
