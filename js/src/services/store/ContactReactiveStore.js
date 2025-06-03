import { BehaviorSubject } from 'rxjs';
import {
  getContactsFromSmartStore,
  saveContact,
  deleteContact as storeDeleteContact
} from './StoreMgr';

const contactSubject = new BehaviorSubject([]);
let currentFilter = '';
let allContactsCache = [];

function applyFilterToCache() {
  const filtered = currentFilter
    ? allContactsCache.filter(contact =>
        `${contact.FirstName ?? ''} ${contact.LastName ?? ''}`
          .toLowerCase()
          .includes(currentFilter)
      )
    : allContactsCache;

  contactSubject.next(filtered);
}

async function loadContacts() {
  try {
    const contacts = await getContactsFromSmartStore();
    allContactsCache = contacts;
    applyFilterToCache();
  } catch (error) {
    console.error('[ContactReactiveStore] Failed to load contacts', error);
  }
}

const ContactReactiveStore = {
  getObservable() {
    return contactSubject.asObservable();
  },

  initLoad() {
    loadContacts();
  },

  addContact(contact) {
    saveContact(contact, () => {
      console.log('[ContactReactiveStore] Contact saved, reloading...');
      loadContacts();
    });
  },

  deleteContact(contact) {
    storeDeleteContact(contact, () => {
      console.log('[ContactReactiveStore] Contact deleted, reloading...');
      loadContacts();
    });
  },

  setSearchFilter(filter) {
    currentFilter = filter.toLowerCase();
    applyFilterToCache();
  }
};

export default ContactReactiveStore;
