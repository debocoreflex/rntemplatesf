
import {
  getContactsFromSmartStore,
  saveContact,
  deleteContact,
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
});
