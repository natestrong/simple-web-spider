import EventEmitter from "events";

export class TaskQueue extends EventEmitter {
    concurrency: number;
    running: number;
    queue: any[];

    constructor(concurrency) {
        super();
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }

    pushTask(task) {
        this.queue.push(task);
        process.nextTick(this.next.bind(this));
        return this;
    }

    next() {
        while (this.running < this.concurrency && this.queue.length) {
            const task = this.queue.shift();
            task(() => {
                this.running--;
                process.nextTick(this.next.bind(this));
            });
            
            this.running++;
        }
    }
}
