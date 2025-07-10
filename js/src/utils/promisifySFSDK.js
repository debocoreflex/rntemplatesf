import { NativeModules, Platform } from 'react-native';
import { smartstore, mobilesync, net, oauth } from 'react-native-force';

let currentUserId = null;

const ensureUserId = () => {
  return new Promise((resolve, reject) => {
    if (currentUserId) return resolve(currentUserId);

    oauth.getAuthCredentials(
      (creds) => {
        currentUserId = creds.userId;
        resolve(currentUserId);
      },
      (err) => {
        console.error('❌ Failed to fetch auth credentials:', err);
        reject(err);
      }
    );
  });
};

const withDynamicSoupName = async (baseSoupName) => {
  const userId = await ensureUserId();
  return `${baseSoupName}_${userId}`;
};

export const registerSoupPromise = async (storeConfig, soupName, indexSpecs) => {
  const dynamicSoup = await withDynamicSoupName(soupName);
  return new Promise((resolve, reject) => {
    smartstore.registerSoup(storeConfig, dynamicSoup, indexSpecs, resolve, reject);
  });
};

export const soupExistsPromise = async (storeConfig, soupName) => {
  const dynamicSoup = await withDynamicSoupName(soupName);
  return new Promise((resolve, reject) => {
    smartstore.soupExists(storeConfig, dynamicSoup, resolve, reject);
  });
};

export const querySoupSpecPromise = async (storeConfig, soupName, querySpec) => {
  const dynamicSoup = await withDynamicSoupName(soupName);
  return new Promise((resolve, reject) => {
    smartstore.querySoup(storeConfig, dynamicSoup, querySpec, resolve, reject);
  });
};

export const upsertSoupEntriesPromise = async (storeConfig, soupName, entries) => {
  const dynamicSoup = await withDynamicSoupName(soupName);
  return new Promise((resolve, reject) => {
    smartstore.upsertSoupEntries(storeConfig, dynamicSoup, entries, resolve, reject);
  });
};

export const clearSoupPromise = async (storeConfig, soupName) => {
  const dynamicSoup = await withDynamicSoupName(soupName);
  return new Promise((resolve, reject) => {
    smartstore.clearSoup(storeConfig, dynamicSoup, resolve, reject);
  });
};

export const syncDownPromise = async (storeConfig, target, soupName, options, syncName) => {
  const dynamicSoup = await withDynamicSoupName(soupName);
  return new Promise((resolve, reject) => {
    const callback = (res) => resolve(res);
    const errback = (err) => reject(err);
    if (syncName) {
      mobilesync.syncDown(storeConfig, target, dynamicSoup, options, syncName, callback, errback);
    } else {
      mobilesync.syncDown(storeConfig, target, dynamicSoup, options, callback, errback);
    }
  });
};

export const syncUpPromise = async (storeConfig, target, soupName, options, syncName) => {
  const dynamicSoup = await withDynamicSoupName(soupName);
  return new Promise((resolve, reject) => {
    const callback = (res) => resolve(res);
    const errback = (err) => reject(err);
    if (syncName) {
      mobilesync.syncUp(storeConfig, target, dynamicSoup, options, syncName, callback, errback);
    } else {
      mobilesync.syncUp(storeConfig, target, dynamicSoup, options, callback, errback);
    }
  });
};

export const reSyncPromise = (storeConfig, syncIdOrName) => {
  return new Promise((resolve, reject) => {
    mobilesync.reSync(storeConfig, syncIdOrName, resolve, reject);
  });
};

export const getSyncStatusPromise = (storeConfig, syncIdOrName) => {
  return new Promise((resolve, reject) => {
    mobilesync.getSyncStatus(storeConfig, syncIdOrName, resolve, reject);
  });
};

export const upsertSoupEntriesWithExternalIdPromise = async (storeConfig, soupName, entries, externalIdPath) => {
  const dynamicSoup = await withDynamicSoupName(soupName);
  return new Promise((resolve, reject) => {
    smartstore.upsertSoupEntriesWithExternalId(
      storeConfig,
      dynamicSoup,
      entries,
      externalIdPath,
      resolve,
      reject
    );
  });
};

export const customSyncDown = (
  syncName,
  storeConfig,
  target,
  options,
  soupName
) => {
  return new Promise((resolve, reject) => {
    console.log('customSyncDown()')

    const iosModule = NativeModules.RedOneSyncManager
    const androidModule = NativeModules.REDOneBridgeModule

    if (Platform.OS === 'ios') {
      if (!iosModule || !iosModule.executeSync) {
        console.error('❌ iOS module or executeSync is not defined')
        return reject(new Error('RedOneSyncManager.executeSync not found'))
      }

      iosModule.executeSync(
        storeConfig,
        target,
        options,
        soupName,
        syncName,
        (error, result) => {
          if (error == null && result?.status === 'DONE') {
            resolve(result)
          } else {
            reject(error || result)
          }
        }
      )
    } else {
      if (!androidModule || !androidModule.executeSync) {
        console.error('❌ Android module or executeSync is not defined')
        return reject(new Error('REDOneBridgeModule.executeSync not found'))
      }

      androidModule.executeSync(
        storeConfig,
        target,
        soupName,
        options,
        syncName,
        (error, result) => {
          if (result?.status === 'DONE') {
            resolve(result)
          } else {
            reject(error || result)
          }
        }
      )
    }
  })
}

export const customReSync = (storeConfig, customSyncStatus, reSyncIds, syncName) => {
  return new Promise((resolve, reject) => {
    const nativeModule = Platform.OS === 'ios' ? NativeModules.RedOneSyncManager : NativeModules.REDOneBridgeModule;
    nativeModule.executeReSync(storeConfig, customSyncStatus, reSyncIds, syncName, (err, result) => {
      if (!err && result?.status === 'DONE') {
        resolve(result);
      } else {
        reject(err || result);
      }
    });
  });
};

export const removeAllStoresPromise = () => {
  return new Promise((resolve, reject) => {
    smartstore.removeAllStores(resolve, reject);
  });
};

export const buildSmartQuerySpecPromise = (storeConfig, querySpec) => {
  return new Promise((resolve, reject) => {
    smartstore.runSmartQuery(storeConfig, querySpec, resolve, reject);
  });
};

export const runSmartQueryPromise = (storeConfig, querySpec) => {
  return new Promise((resolve, reject) => {
    smartstore.runSmartQuery(storeConfig, querySpec, resolve, reject);
  });
};

export const sendRequestPromise = (
  endPoint,
  path,
  method,
  payload,
  headerParams,
  fileParams,
  returnBinary,
  doesNotRequireAuthentication
) => {
  return new Promise((resolve, reject) => {
    net.sendRequest(
      endPoint,
      path,
      resolve,
      reject,
      method,
      payload,
      headerParams,
      fileParams,
      returnBinary,
      doesNotRequireAuthentication
    );
  });
};

export const showSmartStoreDialog = () => {
  if (Platform.OS === 'ios') {
    NativeModules.RedOneSyncManager.showSmartStoreDialog();
  } else {
    NativeModules.REDOneBridgeModule.showDevSupportDialog();
  }
};
