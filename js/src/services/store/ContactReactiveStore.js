import { BehaviorSubject } from 'rxjs';
import StoreMgr from './StoreMgr';
import Contact from '../../models/ModelContact';

const contactMap = new Map();
const contactSubject = new BehaviorSubject([]);
let currentFilter = '';

// Subscribe to store changes and reload cache automatically
StoreMgr.subscribeToChanges(() => {
  console.log('[ContactReactiveStore] StoreMgr change event received');
  initLoad();
});

function applyFilterToCache() {
  const filtered = Array.from(contactMap.values()).filter(contact =>
    contact.FirstName?.toLowerCase().includes(currentFilter) ||
    contact.LastName?.toLowerCase().includes(currentFilter)
  );
  contactSubject.next(filtered);
}

function initLoad() {
  StoreMgr.searchContacts(Date.now(), '', (records) => {
    contactMap.clear();
    records.forEach(record => contactMap.set(record.Id, new Contact(record)));
    applyFilterToCache();
  }, (err) => {
    console.error('[ContactReactiveStore] SmartStore Init Failed', err);
  });
}

function addContact(contact) {
  StoreMgr.saveContact(contact, () => {
    // No manual cache update here — store event triggers reload
    console.log('[ContactReactiveStore] Contact saved, waiting for store event...');
  });
}

function deleteContact(contact) {
  StoreMgr.deleteContact(contact, () => {
    // No manual cache update here — store event triggers reload
    console.log('[ContactReactiveStore] Contact deleted, waiting for store event...');
  });
}

function setSearchFilter(filter) {
  currentFilter = filter.toLowerCase();
  applyFilterToCache();
}

function getObservable() {
  return contactSubject.asObservable();
}

export default {
  initLoad,
  addContact,
  deleteContact,
  setSearchFilter,
  getObservable,
};
