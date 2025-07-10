import { smartstore, oauth } from 'react-native-force';
// import { querySoupSpecPromise, syncDownPromise, reSyncPromise, getSyncStatusPromise } from 'utils/promisifySFSDK';
import { querySoupSpecPromise, syncDownPromise, reSyncPromise, getSyncStatusPromise, customSyncDown } from '../utils/promisifySFSDK';
import { queueManager } from '../utils/queueManager';
const soupName = 'UserSoup';
const syncName = 'userSoupSync';
const storeConfig = { isGlobalStore: false };

const userQueue = new queueManager();

export const UserStoreManager = {
  syncData: async (userId) => {
    return userQueue.enqueue(async () => {
      console.log('📥 Starting user sync for:', userId);

    //   const storeConfig = false;
    //   const syncName = `userSync-${userId}`;
    //   const soupName = 'users';
      const target = {
        type: 'soql',
        query: `SELECT Id, Name, Email FROM User WHERE Id = '${userId}'`,
      };
      const options = {
        mergeMode: 'LEAVE_IF_CHANGED',
      };

      const status = await customSyncDown(syncName, storeConfig, target, options, soupName);
      console.log('✅ User sync complete:', status);
      return status;
    });
  },

  reSyncData: async (customStatus, ids) => {
    return userQueue.enqueue(() => {
      return customReSync(false, customStatus, ids, customStatus.syncName);
    });
  },
};
