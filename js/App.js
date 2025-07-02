import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import styles from './src/views/Styles';
import SearchScreen from './src/views/SearchScreen';
import ContactScreen from './src/views/ContactScreen';
import ContactReactiveStore from './src/services/store/ContactReactiveStore';
import { smartstore } from 'react-native-force';
import mitt from 'mitt';
import { detoxEnabled } from './src/utils/detoxUtills';
import { checkSoupExists, registerDetoxDB, registerDetoxSoup, saveDetoxInitialContact, saveinitialContact } from './src/services/detoxstore/DetoxStoreUtils';


const SmartStoreEvents = mitt();
const Stack = createStackNavigator();

export const SOUP_NAME = 'contacts';
const indexSpecs = [
  { path: 'Id', type: 'string' },                        // For upsert
  { path: 'FirstName', type: 'string' },                // Search/filter
  { path: 'LastName', type: 'string' },
  { path: 'Email', type: 'string' },
  { path: 'MobilePhone', type: 'string' },
  { path: 'Department', type: 'string' },
  { path: '__locally_created__', type: 'string' },      // Offline status
  { path: '__locally_updated__', type: 'string' },
  { path: '__locally_deleted__', type: 'string' },
  { path: '__local__', type: 'string' },
];

const EVENT_KEY = 'users_updated';

export const dummyContacts = [
  {
    Id: `local_10`,
    FirstName: 'Add',
    LastName: 'mukh',
    Title: 'Dev',
    Email: 'john.oe@example.com',
    MobilePhone: '123-456-7864',
    Department: 'DEV',
    attributes: { type: "Contact" },
    __locally_created__: true,
    __locally_updated__: false,
    __locally_deleted__: false,
    __local__: true,
  },
  {
    Id: `local_20`,
    FirstName: 'Test',
    LastName: 'User',
    Title: 'QA',
    Email: 'test.user@example.com',
    MobilePhone: '999-999-9977',
    Department: 'QA',
    attributes: { type: "Contact" },
    __locally_created__: true,
    __locally_updated__: false,
    __locally_deleted__: false,
    __local__: true,
  }
];

export default function App() {

  // React.useEffect(() => {
  //   if (detoxEnabled()) {
  //     // Register the soup for Detox testing
  //     registerDetoxDB()
  //       .then(() => {
  //         console.log('✅ Detox soup registered');



  //       })


  //     function insertDummyContacts() {

  //     //  smartstore.removeSoup(
  //     //   SOUP_NAME,
  //     //   () => console.log(`Removed soup: ${SOUP_NAME}`),
  //     //   (error) => console.error(`Error removing soup ${SOUP_NAME}:`, error)
  //     // );

  //       smartstore.upsertSoupEntries(
  //         true,
  //         SOUP_NAME,
  //         dummyContacts,
  //         () => {
  //           console.log('✅ Dummy contacts inserted');
  //           ContactReactiveStore.initLoadDetox(); // Load into observable
  //         },
  //         (err) => console.error('❌ Upsert failed', err)
  //       );
  //     }
  //     insertDummyContacts();
  //   } else {
  //     async function initializeContacts() {
  //       await StoreMgr.syncData();            // 🟢 Register soup + sync down
  //       ContactReactiveStore.initLoad();      // 🟢 Safe to query now
  //     }

  //     initializeContacts();
  //   }
  // }, []);

  //  React.useEffect(() => {
  //   async function setupDetoxStore() {
  //     if (detoxEnabled()) {
  //       try {
  //         const exists = await checkSoupExists();
  //         if (!exists) {
  //           smartstore.registerSoup(
  //             true,
  //             SOUP_NAME,
  //             indexSpecs,
  //             () => {
  //               console.log('✅ Soup registered');
  //               saveinitialContact(dummyContacts, () => {
  //                 console.log('✅ Dummy contacts saved');
  //                 ContactReactiveStore.initLoadDetox();
  //               });
  //             },
  //             (err) => console.error('❌ Error registering soup:', err)
  //           );
  //         } else {
  //           console.log('⚠️ Soup already exists');
  //           saveinitialContact(dummyContacts, () => {
  //             console.log('✅ Dummy contacts saved');
  //             ContactReactiveStore.initLoadDetox();
  //           });
  //         }
  //       } catch (err) {
  //         console.error('❌ Error checking soup existence:', err);
  //       }
  //     } else {
  //       await StoreMgr.syncData();
  //       ContactReactiveStore.initLoad();
  //     }
  //   }

  //   setupDetoxStore();
  // }, []);

  useEffect(() => {

    if (detoxEnabled()) {
      // Register the soup for Detox testing
      smartstore.registerSoup(
        true,
        SOUP_NAME,
        indexSpecs,
        () => {
          console.log('✅ Soup registered');
          saveDetoxInitialContact(dummyContacts, () => { })
        }
      )

    } else {
      async function initializeContacts() {
        await StoreMgr.syncData();            // 🟢 Register soup + sync down
        ContactReactiveStore.initLoad();      // 🟢 Safe to query now
      }

      initializeContacts();
    }

  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Contacts"
        screenOptions={{
          headerStyle: styles.navBar,
          headerTitleStyle: styles.navBarTitleText,
        }}
      >
        <Stack.Screen name="Contacts" component={SearchScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
