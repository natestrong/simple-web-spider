"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spider_js_1 = require("./spider.js");
var url = process.argv[2];
var nesting = Number.parseInt(process.argv[3], 10) || 1;
spider_js_1.spider(url, nesting, function (err) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Download complete');
});
//# sourceMappingURL=spider-cli.js.map