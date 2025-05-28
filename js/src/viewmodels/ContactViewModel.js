import { useState, useEffect } from 'react';
import StoreMgr from '../../StoreMgr';
import Contact from '../models/ModelContact';



export function ContactViewModel() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    StoreMgr.addStoreChangeListener(refreshContacts);
    refreshContacts();

    return () => {
      StoreMgr.removeStoreChangeListener(refreshContacts);
    };
  }, []);

  function refreshContacts() {
    setIsLoading(true);
    StoreMgr.searchContacts(
      Date.now(),  // or a queryId generator
      filter,
      (contactsData) => {
        // Map raw JSON data to Contact model instances
        const contactModels = contactsData.map(data => new Contact(data));
        setContacts(contactModels);
        setIsLoading(false);
      },
      (error) => {
        console.error("Failed to search contacts:", error);
        setIsLoading(false);
      }
    );
  }

  function setSearchFilter(newFilter) {
    setFilter(newFilter);
    refreshContacts();
  }

  return {
    contacts,
    isLoading,
    filter,
    setSearchFilter,
    refreshContacts,
  };
}
