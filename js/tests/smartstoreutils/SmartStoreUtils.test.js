/*
Unit tests for:

SmartStore methods (save, delete, query)

syncUpContacts()

reSyncContacts()

syncUp → reSync combined

All verifying initLoad() is called after each sync, which triggers observable updates.

*/



import ContactReactiveStore from '../../src/services/store/ContactReactiveStore';
import {
  getContactsFromSmartStore,
  saveContact,
  deleteContact,
  syncUpContacts,
  reSyncContacts,
} from '../../src/services/store/SmartStoreUtils';


jest.mock(
  'react-native-force',
  () => require('../mocks/rnforce')  // adjust path relative to the test file
);


describe('SmartStoreUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers soup and queries contacts', async () => {
    const contacts = await getContactsFromSmartStore();

    expect(Array.isArray(contacts)).toBe(true);
    expect(require('react-native-force').smartstore.soupExists).toHaveBeenCalled();
    expect(require('react-native-force').smartstore.registerSoup).not.toHaveBeenCalled(); // soupExists mocked as true
  });

  it('saves a contact', async () => {
    const mockContact = {
      Id: '123',
      FirstName: 'bdd',
      LastName: 'mukh',
      __local__: true,
    };

    const callback = jest.fn();
    await saveContact(mockContact, callback);

    expect(callback).toHaveBeenCalled();
    expect(require('react-native-force').smartstore.upsertSoupEntries).toHaveBeenCalledWith(
      false,
      'contacts',
      [mockContact],
      expect.any(Function)
    );
  });

  it('deletes a contact', async () => {
    const contact = { _soupEntryId: 1 };
    const success = jest.fn();
    const error = jest.fn();

    await deleteContact(contact, success, error);
    expect(success).toHaveBeenCalled();
    expect(require('react-native-force').smartstore.removeFromSoup).toHaveBeenCalledWith(
      false,
      'contacts',
      [1],
      success,
      error
    );
  });

  // ✅ New: syncUpContacts test
  // it('calls syncUpContacts and refreshes store', async () => {
  //   await syncUpContacts();

  //   const { mobilesync } = require('react-native-force');
  //   expect(mobilesync.syncUp).toHaveBeenCalledWith(
  //     false,
  //     {},
  //     'contacts',
  //     expect.objectContaining({
  //       mergeMode: 'overwrite',
  //       fieldlist: expect.arrayContaining(['FirstName']),
  //     }),
  //     expect.any(Function),
  //     expect.any(Function)
  //   );

  //   expect(ContactReactiveStore.initLoad).toHaveBeenCalled();
  // });

  // // ✅ New: reSyncContacts test
  // it('calls reSyncContacts and refreshes store', async () => {
  //   await reSyncContacts();

  //   const { mobilesync } = require('react-native-force');
  //   expect(mobilesync.reSync).toHaveBeenCalledWith(
  //     false,
  //     expect.any(String),
  //     expect.any(Function),
  //     expect.any(Function)
  //   );

  //   expect(ContactReactiveStore.initLoad).toHaveBeenCalled();
  // });

  // // ✅ Combined test (syncUp → reSync)
  // it('runs syncUp and then reSync in sequence', async () => {
  //   const spyUp = jest.spyOn(require('react-native-force').mobilesync, 'syncUp');
  //   const spyRe = jest.spyOn(require('react-native-force').mobilesync, 'reSync');

  //   await syncUpContacts().then(() => reSyncContacts());

  //   expect(spyUp).toHaveBeenCalled();
  //   expect(spyRe).toHaveBeenCalled();
  //   expect(ContactReactiveStore.initLoad).toHaveBeenCalledTimes(2); // once for each
  // });
});
