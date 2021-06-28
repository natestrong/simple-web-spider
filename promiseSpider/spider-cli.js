"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spider_1 = require("./spider");
var url = process.argv[2];
var nesting = Number.parseInt(process.argv[3], 10) || 1;
spider_1.spider(url, nesting)
    .then(function () { return console.log('Download Complete'); })
    .catch(function (err) { return console.log(err); });
//# sourceMappingURL=spider-cli.js.map