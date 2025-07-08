import { useEffect, useState } from 'react';
import ContactReactiveStore from '../services/store/ContactReactiveStore';
import { useSyncContext } from '../common/reducers/SyncContext';
export function ContactViewModel() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilterState] = useState('');
  const { dataSynced } = useSyncContext();
  useEffect(() => {
    // const subscription = ContactReactiveStore.getObservable().subscribe(setContacts);

    const subscription = ContactReactiveStore.getObservable().subscribe(contacts => {
      if (contacts && contacts.length > 0) {
       
        setContacts(contacts);
       // syncContext.dataSynced(); // ✅ This sets isSynced = true
         dataSynced(); // ✅ Updates shared sync state
      }
    });

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
  const syncContacts = async () => {
    await ContactReactiveStore.performSync(); // ✅ SYNC triggered
  };

  return {
    contacts,
    filter,
    setSearchFilter,
    addContact,
    deleteContact,
    syncContacts
  };
  
}
