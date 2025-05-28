import { useState, useEffect, useCallback } from 'react';
import StoreMgr from '../services/store/StoreMgr';
import Contact from '../models/ModelContact';

export function ContactViewModel() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const refreshContacts = useCallback(() => {
    setIsLoading(true);
    StoreMgr.searchContacts(
      Date.now(), // unique queryId for latest request
      filter,
      (contactsData) => {
        const contactModels = contactsData.map(data => new Contact(data));
        setContacts(contactModels);
        setIsLoading(false);
      },
      (error) => {
        console.error("Failed to search contacts:", error);
        setIsLoading(false);
      }
    );
  }, [filter]);

  useEffect(() => {
    StoreMgr.addStoreChangeListener(refreshContacts);
    refreshContacts();
    return () => {
      StoreMgr.removeStoreChangeListener(refreshContacts);
    };
  }, [refreshContacts]);

  const setSearchFilter = (newFilter) => {
    setFilter(newFilter);
    // refreshContacts automatically runs because it depends on filter
  };

  return {
    contacts,
    isLoading,
    filter,
    setSearchFilter,
    refreshContacts,
  };
}
