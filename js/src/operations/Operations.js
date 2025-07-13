export class Operations {
  constructor(name, taskFn) {
    this.name = name;
    this.taskFn = taskFn;
  }

  async run() {
    console.log(`[Operation] Running: ${this.name}`);
    return this.taskFn();
  }
}
