import createEventEmitter from "../utils/events";

class Operation {
  constructor(name, priority = 0, isReady = true, callback = async () => {}) {
    this.name = name;
    this.priority = priority;
    this.isReady = isReady;
    this.callback = callback;
    this.dependencies = [];
    this.completed = false;
    this.isRunning = false;
    this.isError = false;
    this.dependent = [];
    this.retryCount = 1;
    this.event = createEventEmitter();
  }

  addDependency(operation) {
    this.dependencies.push(operation);
    operation.dependent.push(this.name);
  }

  checkDependencies() {
    return this.dependencies.every((dep) => dep.completed);
  }

  async run() {
    if (!this.isReady) {
      console.log(`Operation ${this.name} is not ready`);
      return;
    }

    this.isRunning = true;
    console.log(`Running operation: ${this.name}`);

    try {
      await this.callback();
      this.completed = true;
      this.isError = false;
      console.log(`Operation: ${this.name} Success`);
      this.event.emit('SyncStatus', { name: this.name, status: 'success' });
    } catch (e) {
      if (this.retryCount === 0) {
        this.isError = true;
        console.log(`Operation: ${this.name} Failed`);
        this.event.emit('SyncStatus', { name: this.name, status: 'error' });
      } else {
        console.log(`Operation: ${this.name} retrying (${this.retryCount})`);
        this.retryCount--;
        this.run();
      }
    } finally {
      this.isRunning = false;
    }
  }
}

class OperationQueue {
  constructor() {
    this.queue = new Map();
  }

  add(operation) {
    this.queue.set(operation.name, operation);
  }

  sort() {
    this.queue = new Map([...this.queue.entries()].sort(([, a], [, b]) => b.priority - a.priority));
  }

  async run() {
    this.sort();
    for (let [, op] of this.queue) {
      if (!op.isRunning && op.checkDependencies()) {
        op.run();
      }
    }
  }

  clear() {
    this.queue.clear();
  }
}

export const SyncQueue = new OperationQueue();
export { Operation };
