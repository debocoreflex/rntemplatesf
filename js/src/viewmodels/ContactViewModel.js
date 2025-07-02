import { useEffect, useState } from 'react';
import ContactReactiveStore from '../services/store/ContactReactiveStore';
import { detoxEnabled } from '../utils/detoxUtills';

export function ContactViewModel() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilterState] = useState('');

  useEffect(() => {
    const subscription = ContactReactiveStore.getObservable().subscribe(setContacts);

    // Load contacts once when ViewModel mounts
    if(detoxEnabled()) {
      ContactReactiveStore.initLoadDetox();
    } else {
      ContactReactiveStore.initLoad();
    }

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


  // Detox-specific methods
  const addDetoxContact = (contact) => {
    ContactReactiveStore.addDetoxContact(contact);
  };
  const deleteDetoxContact = (contact) => {
    ContactReactiveStore.deleteDetoxContact(contact);
  };

  //detox specific methods ends here

  return {
    contacts,
    filter,
    setSearchFilter,
    addContact,
    deleteContact,
    addDetoxContact,
    deleteDetoxContact
  };
}
