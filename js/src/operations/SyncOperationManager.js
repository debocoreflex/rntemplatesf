
import { Operations } from './Operations';
import { syncUpContacts , reSyncContacts } from '../services/store/SmartStoreUtils';
export class SyncOperationManager {
  constructor(queue) {
    this.queue = queue;
  }

  syncUp() {
    const op = new Operations('SyncUpContacts', async () => {
      console.log('[SyncUp] started');
      await new Promise((res) => setTimeout(res, 1000));
      await syncUpContacts(); // Your actual function
      await new Promise((res) => setTimeout(res, 1000));
      console.log('[SyncUp] completed');
    });
    this.queue.enqueue(op);
  }

  reSync() {
    const op = new Operations('ReSyncContacts', async () => {
      console.log('[ReSync] started');
    //  await new Promise((res) => setTimeout(res, 1000)); // Simulating a delay for demonstration
      await reSyncContacts(); // Your actual function
      console.log('[ReSync] completed');
    });
    this.queue.enqueue(op);
  }
}
