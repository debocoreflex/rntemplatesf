import ContactReactiveStore from '../../src/services/store/ContactReactiveStore';
import { getContactsFromSmartStore } from '../../src/services/store/SmartStoreUtils';

// Mock SmartStoreUtils to return dummy contacts
jest.mock('../../src/services/store/SmartStoreUtils');

describe('ContactReactiveStore', () => {
  beforeEach(() => {
    getContactsFromSmartStore.mockResolvedValue([
      { Id: '1', FirstName: 'Add', LastName: 'mukh' },
      { Id: '2', FirstName: 'Test', LastName: 'User' },
    ]);
  });

  it('should load and emit all contacts on initLoad()', async () => {
    const received = [];

    const sub = ContactReactiveStore.getObservable().subscribe(data => {
      received.push(data);
    });

    await ContactReactiveStore.initLoad();

    expect(received[1].length).toBe(2);
    expect(received[1][0].FirstName).toBe('Add');
    sub.unsubscribe();
  });

  it('should filter by FirstName or LastName on setSearchFilter()', async () => {
    await ContactReactiveStore.initLoad();

    const received = [];
    const sub = ContactReactiveStore.getObservable().subscribe(data => {
      received.push(data);
    });

    ContactReactiveStore.setSearchFilter('test');

    expect(received.pop()).toEqual([
      { Id: '2', FirstName: 'Test', LastName: 'User' },
    ]);

    sub.unsubscribe();
  });
});
