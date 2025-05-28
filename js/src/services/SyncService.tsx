import AsyncStorage from "@react-native-async-storage/async-storage";

// src/services/SyncService.ts
export default {
  async getLastSyncTime() {
    return await AsyncStorage.getItem("lastSync");
  },

  async fullSync() {
    // clear local store
    // fetch all master data (Accounts, POS, etc.)
    // insert to SmartStore/local DB
  },

  async partialSync() {
    // fetch delta updates
  },
};
