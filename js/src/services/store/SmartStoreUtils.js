import { smartstore } from 'react-native-force';
import ContactReactiveStore from './ContactReactiveStore';



let isSoupRegistered = false;

export async function getContactsFromSmartStore() {
  if (!isSoupRegistered) {
    const exists = await new Promise((resolve) =>
      smartstore.soupExists(false, "contacts", resolve)
    );

    if (!exists) {
      await new Promise((resolve, reject) =>
        smartstore.registerSoup(
          false,
          "contacts",
          [
            { path: "Id", type: "string" },
            { path: "FirstName", type: "full_text" },
            { path: "LastName", type: "full_text" },
            { path: "__local__", type: "string" },
          ],
          resolve,
          reject
        )
      );
      console.log("[StoreMgr] contacts soup registered");
    } else {
      console.log("[StoreMgr] contacts soup already exists");
    }

    isSoupRegistered = true;
  }

  const querySpec = smartstore.buildAllQuerySpec("FirstName", "ascending", 1000);

  return new Promise((resolve, reject) => {
    smartstore.querySoup(
      false,
      "contacts",
      querySpec,
      (cursor) => resolve(cursor.currentPageOrderedEntries),
      reject
    );
  });
}


// export function saveEntry(soupName, entry, callback) {
//   smartstore.upsertSoupEntries(false, soupName, [entry], callback);
// }

// export function deleteContact(soupName, entry, callback) {
//   smartstore.removeFromSoup(false, soupName, [entry._soupEntryId], callback);
// }

export function saveContact(contact, callback) {
    smartstore.upsertSoupEntries(false, "contacts", [contact],
                                 () => {
                                     callback();
                                   //  emitSmartStoreChanged();
                                      ContactReactiveStore.initLoad(); 
                                 });
}

function addContact(successCallback, errorCallback) {
    const contact = {Id: `local_${(new Date()).getTime()}`,
                   FirstName: null, LastName: null, Title: null, Email: null, MobilePhone: null, Department: null, attributes: {type: "Contact"},
                   __locally_created__: true,
                   __locally_updated__: false,
                   __locally_deleted__: false,
                   __local__: true
                  };
    smartstore.upsertSoupEntries(false, "contacts", [ contact ],
                                 (contacts) => successCallback(contacts[0]),
                                 errorCallback);
}

export function deleteContact(contact, successCallback, errorCallback) {
    smartstore.removeFromSoup(false, "contacts", [ contact._soupEntryId ],
                              successCallback,
                              errorCallback);
}
