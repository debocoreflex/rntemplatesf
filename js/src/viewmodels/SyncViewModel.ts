import { makeAutoObservable } from "mobx";
import SyncService from "../services/SyncService";
import AuthService from "../services/AuthServices";

class SyncViewModel {
  isSyncing = false;
  syncStatus: 'idle' | 'inProgress' | 'success' | 'failed' = 'idle';

  constructor() {
    makeAutoObservable(this);
  }

  async startSync() {
    this.isSyncing = true;
    this.syncStatus = 'inProgress';

    try {
      const user = await AuthService.getUser();
      const lastSync = await SyncService.getLastSyncTime();

      const shouldFullSync = !lastSync || new Date(lastSync).getDate() !== new Date().getDate();
      if (shouldFullSync) {
        await SyncService.fullSync();
      } else {
        await SyncService.partialSync();
      }

      this.syncStatus = 'success';
    } catch (e) {
      this.syncStatus = 'failed';
    } finally {
      this.isSyncing = false;
    }
  }
}

export default new SyncViewModel();
