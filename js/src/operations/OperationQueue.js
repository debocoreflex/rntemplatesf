export class OperationQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

   enqueue(op) {
    console.log(`[Queue] Enqueued: ${op.name}`);
    return new Promise((resolve, reject) => {
      this.queue.push({ op, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    const { op, resolve, reject } = this.queue.shift();
    this.isProcessing = true;

    console.log(`[Queue] Processing: ${op.name}`);
    try {
      await op.run();
      resolve();
    } catch (err) {
      console.error(`[Queue] Failed: ${op.name}`, err);
      reject(err);
    }

    this.isProcessing = false;
    this.processQueue();
  }
}

