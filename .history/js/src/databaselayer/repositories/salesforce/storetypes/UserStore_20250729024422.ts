import { SoupIndexSpec } from 'react-native-force/dist/react.force.smartstore'

// User Store Config
export const userStoreConfig = {
  isGlobalStore: false,
}

// List of syncs for user store
export const userStoreSync = {
  userSoupSync: 'userSoupSync',
  accountFirstSyncDown: 'accountFirstSyncDown',
  configurationSyncDown: 'configurationSyncDown',
  accountHoursSyncDown: 'accountHoursSyncDown',
  userCustomSyncStatus: 'userCustomSyncStatus',
  accountRuntimeSyncDown: 'accountRuntimeSyncDown',
}

// List of soups in user store
export const userStoreSoups = {
  UserSoup: 'UserSoup',
  AccountSoup: 'AccountSoup',
  ConfigurationSoup: 'ConfigurationSoup',
  AccountHoursSoup: 'AccountHoursSoup',
  CustomSyncStatusSoup: 'CustomSyncStatusSoup',
}




// Index Spec of Event Store
export const userStoreIndexSpec: { [key: string]: SoupIndexSpec[] } = {
  AccountSoup: [
    { path: 'Id', type: 'string' },
    { path: 'RecordType.Name', type: 'string' },
    { path: 'Name', type: 'string' },
    { path: '__local__', type: 'string' },
    { path: '__locally_created__', type: 'string' },
    { path: '__locally_updated__', type: 'string' },
    { path: '__locally_deleted__', type: 'string' },
  ],
  UserSoup: [
    { path: 'Id', type: 'string' },
    { path: '__local__', type: 'string' },
    { path: '__locally_created__', type: 'string' },
    { path: '__locally_updated__', type: 'string' },
    { path: '__locally_deleted__', type: 'string' },
  ],
  AccountHoursSoup: [
    { path: 'Id', type: 'string' },
    { path: 'Account__c', type: 'string' },
    { path: '__local__', type: 'string' },
    { path: '__locally_created__', type: 'string' },
    { path: '__locally_updated__', type: 'string' },
    { path: '__locally_deleted__', type: 'string' },
  ],
  ConfigurationSoup: [
    { path: 'Id', type: 'string' },
    { path: 'System_Config_Name__c', type: 'string' },
    { path: 'RecordType.Name', type: 'string' },
    { path: '__local__', type: 'string' },
    { path: '__locally_created__', type: 'string' },
    { path: '__locally_updated__', type: 'string' },
    { path: '__locally_deleted__', type: 'string' },
  ],
  CustomSyncStatusSoup: [
    { path: 'Id', type: 'string' },
    { path: 'syncName', type: 'string' },
    { path: '__local__', type: 'string' },
    { path: '__locally_created__', type: 'string' },
    { path: '__locally_updated__', type: 'string' },
    { path: '__locally_deleted__', type: 'string' },
  ],
}