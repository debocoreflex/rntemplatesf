export class OperationQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  enqueue(operation) {
    this.queue.push(operation);
    this.processQueue();
  }

 async processQueue() {
  if (this.isProcessing || this.queue.length === 0) return;

  this.isProcessing = true;
  console.log(`[Queue] Processing next operation. Queue length: ${this.queue.length}`);

  const currentOperation = this.queue.shift();
  try {
    await currentOperation.run();
  } catch (error) {
    console.error(`[Queue] Operation failed: ${currentOperation.name}`, error);
  }

  this.isProcessing = false;
  console.log(`[Queue] Operation completed: ${currentOperation.name}`);
  this.processQueue(); // Move to next
}

}
