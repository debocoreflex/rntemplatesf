
import EventEmitter from '../../views/events';
import {smartstore, mobilesync, forceUtil} from 'react-native-force';
import ContactReactiveStore from './ContactReactiveStore';

const registerSoup = forceUtil.promiser(smartstore.registerSoup);
const getSyncStatus = forceUtil.promiser(mobilesync.getSyncStatus);
const syncDown = forceUtil.promiserNoRejection(mobilesync.syncDown);
const syncUp = forceUtil.promiserNoRejection(mobilesync.syncUp);
const reSync = forceUtil.promiserNoRejection(mobilesync.reSync);

const syncName = "mobileSyncExplorerSyncDown";
let syncInFlight = false;
let lastStoreQuerySent = 0;
let lastStoreResponseReceived = 0;
const eventEmitter = new EventEmitter();

const SMARTSTORE_CHANGED = "smartstoreChanged";

function emitSmartStoreChanged() {
    eventEmitter.emit(SMARTSTORE_CHANGED, {});
}
function removeStoreChangeListener(listener) {
  eventEmitter.removeListener(SMARTSTORE_CHANGED, listener);
}


function syncDownContacts() {
    if (syncInFlight) {
        console.log("Not starting syncDown - sync already in fligtht");
        return Promise.resolve();
    }
    
    console.log("Starting syncDown");
    syncInFlight = true;
    const fieldlist = ["Id", "FirstName", "LastName", "Title", "Email", "MobilePhone","Department", "LastModifiedDate"];
    const target = {type:"soql", query:`SELECT ${fieldlist.join(",")} FROM Contact LIMIT 10000`};
    return syncDown(false, target, "contacts", {mergeMode:mobilesync.MERGE_MODE.OVERWRITE}, syncName)
        .then(() => {
            console.log("syncDown completed or failed");
            syncInFlight = false;
            //emitSmartStoreChanged();
             ContactReactiveStore.initLoad(); 
        });
}

function reSyncContacts() {
    if (syncInFlight) {
        console.log("Not starting reSync - sync already in fligtht");
        return Promise.resolve();
    }

    console.log("Starting reSync");
    syncInFlight = true;
    return reSync(false, syncName)
        .then(() => {
            console.log("reSync completed or failed");
            syncInFlight = false;
            //emitSmartStoreChanged();
             ContactReactiveStore.initLoad(); 
        });
}

function syncUpContacts() {
    if (syncInFlight) {
        console.log("Not starting syncUp - sync already in fligtht");
        return Promise.resolve();
    }

    console.log("Starting syncUp");
    syncInFlight = true;
    const fieldlist = ["FirstName", "LastName", "Title", "Email", "MobilePhone","Department"];
    return syncUp(false, {}, "contacts", {mergeMode:mobilesync.MERGE_MODE.OVERWRITE, fieldlist})
        .then(() => {
            console.log("syncUp completed or failed");
            syncInFlight = false;
            //emitSmartStoreChanged();
             ContactReactiveStore.initLoad(); 
        });
}

function firstTimeSyncData() {
    console.log("StoreMgr: firstTimeSyncData called");
    return registerSoup(false,
                        "contacts", 
                        [ {path:"Id", type:"string"}, 
                          {path:"FirstName", type:"full_text"}, 
                          {path:"LastName", type:"full_text"}, 
                          {path:"__local__", type:"string"} ])
        .then(syncDownContacts);
}

function syncData() {
    console.log("StoreMgr: syncData called");
    return getSyncStatus(false, syncName)
        .then((sync) => {
            if (sync == null) {
                return firstTimeSyncData();
            } else {
                return reSyncData();
            }
        });
}
// function syncData() {
//     return registerSoup(false,
//         "contacts", 
//         [
//           { path: "Id", type: "string" },
//           { path: "FirstName", type: "full_text" },
//           { path: "LastName", type: "full_text" },
//           { path: "__local__", type: "string" }
//         ]
//     ).then(() => {
//         return getSyncStatus(false, syncName)
//             .then((sync) => {
//                 if (sync == null) {
//                     return syncDownContacts();
//                 } else {
//                     return reSyncData();
//                 }
//             });
//     });
// }


function reSyncData() {
    console.log("StoreMgr: reSyncData called");
    return syncUpContacts()
        .then(reSyncContacts);
}

function addStoreChangeListener(listener) {
    eventEmitter.addListener(SMARTSTORE_CHANGED, listener);
}

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

function traverseCursor(accumulatedResults, cursor, pageIndex, successCallback, errorCallback) {
    accumulatedResults = accumulatedResults.concat(cursor.currentPageOrderedEntries);
    if (pageIndex < cursor.totalPages - 1) {
        smartstore.moveCursorToPageIndex(false, cursor, pageIndex + 1,
                                         (cursor) => {
                                             traverseCursor(accumulatedResults, cursor, pageIndex + 1, successCallback, errorCallback);
                                         },
                                         errorCallback);
    }
    else {
        successCallback(accumulatedResults);
    }
}

function searchContacts(queryId, query, successCallback, errorCallback) {
    let querySpec;
    
    if (query === "") {
        querySpec = smartstore.buildAllQuerySpec("FirstName", "ascending", 100);
    }
    else {
        const queryParts = query.split(/ /);
        const queryFirst = queryParts.length == 2 ? queryParts[0] : query;
        const queryLast = queryParts.length == 2 ? queryParts[1] : query;
        const queryOp = queryParts.length == 2 ? "AND" : "OR";
        const match = `{contacts:FirstName}:${queryFirst}* ${queryOp} {contacts:LastName}:${queryLast}*`;
        querySpec = smartstore.buildMatchQuerySpec(null, match, "ascending", 100, "LastName");
    }
    const that = this;

    const querySuccessCB = (contacts) => {
        console.log("StoreMgr: contacts received for query:", query, contacts); 
        successCallback(contacts, queryId);
    };

    const queryErrorCB = (error) => {
        console.log(`Error->${JSON.stringify(error)}`);
        errorCallback(error);
    };

    smartstore.querySoup(false,
                         "contacts",
                         querySpec,
                         (cursor) => {
                             traverseCursor([], cursor, 0, querySuccessCB, queryErrorCB);
                         },
                         queryErrorCB);

}
function subscribeToChanges(listener) {
  eventEmitter.addListener(SMARTSTORE_CHANGED, listener);
  return () => eventEmitter.removeListener(SMARTSTORE_CHANGED, listener);
}
// export async function getContactsFromSmartStore() {
//   const querySpec = smartstore.buildAllQuerySpec('lastName', 'ascending', 1000); // customize as needed

//   return new Promise((resolve, reject) => {


//     smartstore.querySoup( false,'contacts', querySpec,
//       result => resolve(result.entries || []),
//       error => reject(error)
//     );
//   });
// }

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


export default {
    syncData,
    reSyncData,
    saveContact,
    searchContacts,
    addContact,
    deleteContact,
    getContactsFromSmartStore
};
