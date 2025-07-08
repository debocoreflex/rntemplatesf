// src/common/reducers/SyncContext.js
import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { oauth } from 'react-native-force';

const SyncContext = createContext(null);

const initialState = {
  isLoading: true,
  isSynced: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SYNC_INITIATED':
      return { ...state, isLoading: false };
    case 'DATA_SYNCED':
      return { ...state, isSynced: true };
    case 'LOGOUT':
      return { isLoading: true, isSynced: false };
    default:
      return state;
  }
}

export function SyncProvider({ children }) {
  const [syncState, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    oauth.getAuthCredentials(
      () => {
        console.log('Logged In');
        dispatch({ type: 'SYNC_INITIATED' });
      },
      () => {
        console.log('Logged OUT');
        dispatch({ type: 'LOGOUT' });
        oauth.authenticate(
          () => dispatch({ type: 'SYNC_INITIATED' }),
          () => dispatch({ type: 'LOGOUT' })
        );
      }
    );
  }, []);

  const syncContext = useMemo(() => ({
    syncState,
    dataSynced: () => dispatch({ type: 'DATA_SYNCED' }),
    logout: () => dispatch({ type: 'LOGOUT' }),
  }), [syncState]);

  return (
    <SyncContext.Provider value={syncContext}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSyncContext() {
  return useContext(SyncContext);
}
