import { BehaviorSubject } from 'rxjs';
import { saveContact, deleteContact, getContactsFromSmartStore } from '../../services/store/SmartStoreUtils';
import { deleteDetoxContacts, detoxContactLoad, saveDetoxContact } from '../../services/detoxstore/DetoxStoreUtils';

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




//this function is used to initialize the detox contacts

async function initLoadDetox() {
   try {
      const items = await detoxContactLoad() // for detox only
      allItems = items;
      applyFilter();
    } catch (error) {
      console.error(`[${soupName}] Failed to load data`, error);
    } 
  }

 function addDetoxItem(item) {
    saveDetoxContact(item, () => {
      allItems.unshift(item);
      applyFilter();
    });
  }
  function deleteDetoxItem(item) {
    deleteDetoxContacts(item, () => {
      allItems = allItems.filter(i => i.Id !== item.Id);
      applyFilter();
    });
  }

  //DETOX CONTACTS ENDS HERE


  return {
    getObservable: () => subject.asObservable(),
    initLoad,
    addContact: addItem, 
    addDetoxContact: addDetoxItem,  
    deleteDetoxContact: deleteDetoxItem,   
    deleteContact: deleteItem, 
    setSearchFilter: (filter) => {
      currentFilter = filter.toLowerCase();
      applyFilter();
    },
    initLoadDetox
  };
}
