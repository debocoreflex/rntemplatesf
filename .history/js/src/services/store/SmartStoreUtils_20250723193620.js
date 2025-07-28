//import { smartstore } from 'react-native-force';
import {smartstore, mobilesync, forceUtil} from 'react-native-force';
import ContactReactiveStore from './ContactReactiveStore';



let isSoupRegistered = false;

let syncInFlight = false;
const syncName = "mobileSyncExplorerSyncDown";


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
    // smartstore.upsertSoupEntries(false, "contacts", [contact],
    //                              () => {
    //                                  callback();
    //                                //  emitSmartStoreChanged();
    //                                   ContactReactiveStore.initLoad(); 
    //                              });
  console.log("Contacts pushed ", contact);

    smartstore.upsertSoupEntries(
    false,  // Assuming this is a flag for whether to overwrite or not
    "contacts",  // The soup name
    [contact],  // The contact data
    (response) => {
      // Success callback
      console.log("Contact saved successfully:", response);
      callback();  // Invoke the callback on success
      ContactReactiveStore.initLoad();  // Reload data
    },
    (error) => {
      // Failure callback
      console.error("Failed to save contact:", error);
      // Optionally call the callback here with a failure status if needed
      callback(error);  // Pass the error to the callback if necessary
    }
  );
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

export function syncUpContacts() {
  if (syncInFlight) {
    console.log("Not starting syncUp - sync already in flight");
    return Promise.resolve();
  }

  console.log("Starting syncUp");
  syncInFlight = true;

  const fieldlist = ["FirstName", "LastName", "Title", "Email", "MobilePhone", "Department"];

  return new Promise((resolve, reject) => {
    mobilesync.syncUp(
      false,                              // isGlobalStore
      {},                                 // target (default: everything changed locally)
      "contacts",                         // soupName
      {
        mergeMode: mobilesync.MERGE_MODE.OVERWRITE,
        fieldlist: fieldlist,
      },
      (syncResult) => {
        console.log("syncUp completed");
        console.log("📊 Records Synced:", syncResult?.totalSize);
        syncInFlight = false;
        ContactReactiveStore.initLoad();  // 🔁 Refresh observable list
        resolve();
      },
      (err) => {
        console.error("syncUp failed", err);
        syncInFlight = false;
        reject(err);
      }
    );
  });
}

export function reSyncContacts() {
  if (syncInFlight) {
    console.log("Not starting reSync - sync already in flight");
    return Promise.resolve();
  }

  console.log("Starting reSync");
  syncInFlight = true;

  return new Promise((resolve, reject) => {
    mobilesync.reSync(
      false,             // isGlobalStore
      syncName,    // syncName used in syncDown
      () => {
        console.log("reSync completed");
        syncInFlight = false;
        ContactReactiveStore.initLoad();  // 🔁 Refresh observable list
        resolve();
      },
      (err) => {
        console.error("reSync failed", err);
        syncInFlight = false;
        reject(err);
      }
    );
  });
}

