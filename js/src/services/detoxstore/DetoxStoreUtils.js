import { smartstore,forceUtil } from 'react-native-force';
import ContactReactiveStore from '../store/ContactReactiveStore';
import { dummyContacts, SOUP_NAME } from '../../../App';

const registerSoup = forceUtil.promiser(smartstore.registerSoup);
const upsertSoupEntries = forceUtil.promiser(smartstore.upsertSoupEntries);


const indexes = [
  { path: 'Id', type: 'string' },
  { path: 'FirstName', type: 'string' },
  { path: 'LastName', type: 'string' },
  { path: 'Email', type: 'string' },
  { path: 'MobilePhone', type: 'string' },
  { path: '__local__', type: 'string' },
];


export function detoxContactLoad() {
  return new Promise((resolve, reject) => {
    try {
      const querySpec = smartstore.buildAllQuerySpec('id', 'ascending', 1000);
      smartstore.querySoup(
        true,
       SOUP_NAME,
        querySpec,
        (cursor) => {
          const result = cursor.currentPageOrderedEntries.map((entry) => ({
            Id: entry.Id,
            FirstName: entry.FirstName,
            LastName: entry.LastName,
            Title: entry.Title,
            Email: entry.Email,
            MobilePhone: entry.MobilePhone,
            Department: entry.Department,
            attributes: entry.attributes,
            __locally_created__: entry.__locally_created__,
            __locally_updated__: entry.__locally_updated__,
            __locally_deleted__: entry.__locally_deleted__,
            __local__: entry.__local__,
          }));

          smartstore.closeCursor(true, cursor, () => {}, console.error);
          resolve(result);
        },
        (err) => {
          console.error('SOUP_NAME Failed to query soup', err);
          reject(err);
        }
      );
    } catch (error) {
      console.error('SOUP_NAME Failed to load data', error);
      reject(error);
    }
  });
}
// export function registerDetoxDB() {
//   return new Promise((resolve, reject) => {
//       smartstore.registerSoup(
//             SOUP_NAME,
//             indexes,
//             () => {
//               console.log(`Soup '${SOUP_NAME}' registered.`);
//               resolve(true); // Newly registered
//             },
//             (error) => {
//               console.error('Failed to register soup:', error);
//               reject(error);
//             }
//           );
//   });
// }
export async function registerDetoxSoup() {
  console.log('[StoreMgr] Detox: Registering soup and inserting dummy data');

  try {
    await registerSoup(false, 'contacts', [
      { path: 'Id', type: 'string' },
      { path: 'FirstName', type: 'full_text' },
      { path: 'LastName', type: 'full_text' },
      { path: '__local__', type: 'string' }
    ]);
  } catch (e) {
    console.log('[StoreMgr] Soup registration may have failed (may already exist):', e?.message);
  }

  const dummyContacts = [
    {
      Id: 'local_1',
      FirstName: 'John',
      LastName: 'Doe',
      Title: 'Engineer',
      Email: 'john@example.com',
      MobilePhone: '1234567890',
      Department: 'Engineering',
      attributes: { type: "Contact" },
      __locally_created__: true,
      __locally_updated__: false,
      __locally_deleted__: false,
      __local__: true,
    },
    {
      Id: 'local_2',
      FirstName: 'Jane',
      LastName: 'Smith',
      Title: 'Designer',
      Email: 'jane@example.com',
      MobilePhone: '0987654321',
      Department: 'Design',
      attributes: { type: "Contact" },
      __locally_created__: true,
      __locally_updated__: false,
      __locally_deleted__: false,
      __local__: true,
    }
  ];

  await upsertSoupEntries(true, 'contacts', dummyContacts);

  ContactReactiveStore.initLoadDetox(); // Notify the observable
}
export function registerDetoxDB() {
  return new Promise((resolve, reject) => {
    smartstore.registerSoup(
      SOUP_NAME,
      indexes,
      () => {
        console.log(`✅ Soup '${SOUP_NAME}' registered`);
        resolve();
      },
      (error) => {
        if (error?.message?.includes('already exists')) {
          console.log(`⚠️ Soup '${SOUP_NAME}' already exists`);
          resolve(); // Still okay
        } else {
          console.error('❌ Failed to register soup:', error);
          reject(error);
        }
      }
    );
  });
}

export function addDetoxContact(contact) {
    const newContact = {
        ...contact,
        __locally_created__: true,
        __locally_updated__: false,
        __locally_deleted__: false,
        __local__: true
    };
    smartstore.upsertSoupEntries(true, SOUP_NAME, [newContact],
                                 (contacts) => {
                                     ContactReactiveStore.addDetoxContact(contacts[0]);
                                 },
                                 (error) => {
                                     console.error('Failed to add detox contact:', error);
                                 });
}



export function saveDetoxContact(contact, callback) {
    smartstore.upsertSoupEntries(true, SOUP_NAME, [contact],
                                 () => {
                                     callback();
                                   //  emitSmartStoreChanged();
                                      ContactReactiveStore.initLoadDetox(); 
                                 });
}
export function saveDetoxInitialContact(contact, callback) {
    smartstore.upsertSoupEntries(true, SOUP_NAME, contact,
                                 () => {
                                     callback();
                                   //  emitSmartStoreChanged();
                                      ContactReactiveStore.initLoadDetox(); 
                                 });
}

export function deleteDetoxContacts(contact, successCallback, errorCallback) {
    smartstore.removeFromSoup(true, SOUP_NAME, [ contact._soupEntryId ],
                              successCallback,
                              errorCallback);
}
export function clearDB(){
smartstore.removeSoup(
  true,             // isGlobalStore (usually true)
  SOUP_NAME,        // string soup name
  () => {
    console.log(`✅ Soup '${SOUP_NAME}' removed`);
  },
  (error) => {
    console.error('❌ Failed to remove soup:', error);
  }
);

}

// export function checkSoupExists() {
//   smartstore.soupExists(
//     SOUP_NAME,
//     (exists) => {
//       if (exists) {
//         console.log(`✅ Soup '${SOUP_NAME}' exists.`);
//         return true;
//       } else {
//         console.log(`❌ Soup '${SOUP_NAME}' does NOT exist.`);
//         return false;
//       }
//     },
//     (error) => {
//       console.error('Error checking soup existence:', error);
//       return false;
//     }
//   );
// }
export function checkSoupExists() {
  return new Promise((resolve, reject) => {
    smartstore.soupExists(
      SOUP_NAME,
      (exists) => resolve(exists),
      (error) => reject(error)
    );
  });
}


