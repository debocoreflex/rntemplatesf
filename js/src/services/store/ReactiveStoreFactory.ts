import { BehaviorSubject } from 'rxjs';
import { getContactsFromSmartStore, saveContact, deleteContact } from './StoreMgr'; // adjust this path if needed

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

  return {
    getObservable: () => subject.asObservable(),
    initLoad,
    addContact: addItem,      // ✅ EXPORT THIS
    deleteContact: deleteItem, // ✅ EXPORT THIS
    setSearchFilter: (filter) => {
      currentFilter = filter.toLowerCase();
      applyFilter();
    },
  };
}
