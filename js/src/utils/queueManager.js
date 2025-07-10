// utils/QueueManager.js
export class queueManager {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  enqueue(taskFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ taskFn, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const { taskFn, resolve, reject } = this.queue.shift();

    try {
      const result = await taskFn();
      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      this.isProcessing = false;
      this.processQueue(); // Continue to next task
    }
  }
}
