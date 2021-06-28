"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spider_js_1 = require("./spider.js");
var TaskQueue_js_1 = require("./TaskQueue.js");
var url = process.argv[2];
var nesting = Number.parseInt(process.argv[3], 10) || 1;
var concurrency = Number.parseInt(process.argv[4], 10) || 2;
var spiderQueue = new TaskQueue_js_1.TaskQueue(concurrency);
spiderQueue.on('error', console.error);
spiderQueue.on('empty', function () { return console.log('Download complete'); });
spider_js_1.spider(url, nesting, spiderQueue);
//# sourceMappingURL=spider-cli.js.map