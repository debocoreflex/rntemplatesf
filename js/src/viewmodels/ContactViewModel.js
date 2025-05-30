import { useEffect, useState } from 'react';
import ContactReactiveStore from '../services/store/ContactReactiveStore';

export function ContactViewModel() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilterState] = useState('');

  useEffect(() => {
    const subscription = ContactReactiveStore.getObservable().subscribe(setContacts);

    // Load contacts once when ViewModel mounts
    ContactReactiveStore.initLoad();

    return () => subscription.unsubscribe();
  }, []);

  const setSearchFilter = (newFilter) => {
    setFilterState(newFilter);
    ContactReactiveStore.setSearchFilter(newFilter);
  };

  const addContact = (contact) => {
    ContactReactiveStore.addContact(contact);
  };

  const deleteContact = (contact) => {
    ContactReactiveStore.deleteContact(contact);
  };

  return {
    contacts,
    filter,
    setSearchFilter,
    addContact,
    deleteContact,
  };
}
