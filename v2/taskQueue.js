"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskQueue = void 0;
var events_1 = __importDefault(require("events"));
var TaskQueue = /** @class */ (function (_super) {
    __extends(TaskQueue, _super);
    function TaskQueue(concurrency) {
        var _this = _super.call(this) || this;
        _this.concurrency = concurrency;
        _this.running = 0;
        _this.queue = [];
        return _this;
    }
    TaskQueue.prototype.pushTask = function (task) {
        this.queue.push(task);
        process.nextTick(this.next.bind(this));
        return this;
    };
    TaskQueue.prototype.next = function () {
        var _this = this;
        while (this.running < this.concurrency && this.queue.length) {
            var task = this.queue.shift();
            task(function () {
                _this.running--;
                process.nextTick(_this.next.bind(_this));
            });
            this.running++;
        }
    };
    return TaskQueue;
}(events_1.default));
exports.TaskQueue = TaskQueue;
//# sourceMappingURL=TaskQueue.js.map