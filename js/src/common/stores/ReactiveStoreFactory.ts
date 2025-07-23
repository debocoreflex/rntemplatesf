import { BehaviorSubject } from 'rxjs';
import { saveContact,deleteContact, getContactsFromSmartStore, syncUpContacts, reSyncContacts } from '../../services/store/SmartStoreUtils';
import { OperationQueue } from '../../operations/OperationQueue';
import { SyncOperationManager } from '../../operations/SyncOperationManager';
const queue = new OperationQueue();
const manager = new SyncOperationManager(queue);


export function ReactiveStoreFactory({ soupName, filterKeys }: { soupName: string; filterKeys: string[] }) {
  const subject = new BehaviorSubject<any[]>([]);
  let allItems: any[] = [];
  let currentFilter = '';

  function applyFilter() {
    const filtered = currentFilter
      ? allItems.filter(item =>
          filterKeys.some(key =>
            (typeof item[key] === 'string' ? item[key] : '').toLowerCase().includes(currentFilter)
          )
        )
      : allItems;

    subject.next(filtered);
  }

  async function initLoad() {
    try {
      const items = await getContactsFromSmartStore(); // or use soupName if needed
      allItems = items;
      //console.log(`init load [${soupName}] Loaded: ${JSON.stringify(items)}`);
      applyFilter();
    } catch (error) {
      console.error(`[${soupName}] Failed to load data`, error);
    }
  }

  function addItem(item) {
    saveContact(item, () => {
      allItems.unshift(item);
      applyFilter();
    });
  }

  function deleteItem(item) {
    deleteContact(item, () => {
      allItems = allItems.filter(i => i.Id !== item.Id);
      applyFilter();
    });
  }
  // async function performSync() {
  //   console.log('[ReactiveStore] performSync called');
  //   try {
  //     // await syncUpContacts();
  //     // await reSyncContacts();
    
  //     await syncUpContacts().then(() => {reSyncContacts()});
  //   } catch (error) {
  //     console.error('[ReactiveStore] performSync failed', error);
  //   }
  // }

  async function performSync() {
  console.log('[performSync] triggered');
  try {
    manager.syncUp();
    manager.reSync();
  } catch (error) {
    console.error('[performSync] failed', error);
  }
}

  return {
    getObservable: () => subject.asObservable(),
    initLoad,
    addContact: addItem,      // ✅ EXPORT THIS
    deleteContact: deleteItem, // ✅ EXPORT THIS
    setSearchFilter: (filter) => {
      currentFilter = filter.toLowerCase();
      applyFilter();
    },
    performSync, // ✅ EXPORT THIS
  };
}
