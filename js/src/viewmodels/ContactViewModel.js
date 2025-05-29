import { useState, useEffect, useCallback } from 'react';
import StoreMgr from '../services/store/StoreMgr';
import Contact from '../models/ModelContact';

export function ContactViewModel() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(() => {
    setIsLoading(true);
    StoreMgr.searchContacts(
      Date.now(),
      filter,
      (data) => {
        setContacts(data.map(item => new Contact(item)));
        setIsLoading(false);
      },
      (error) => {
        console.error('Contact fetch failed', error);
        setIsLoading(false);
      }
    );
  }, [filter]);

  useEffect(() => {
    // initial load and reactive updates
    refresh();
    const unsubscribe = StoreMgr.subscribeToChanges(refresh);
    return () => unsubscribe();
  }, [refresh]);

  const setSearchFilter = (value) => {
    setFilter(value); // re-runs refresh via useEffect
  };

  return {
    contacts,
    isLoading,
    filter,
    setSearchFilter,
  };
}
