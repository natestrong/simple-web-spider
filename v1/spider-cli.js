"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spider_1 = require("./spider");
spider_1.spider(process.argv[2], function (err, filename, downloaded) {
    if (err) {
        console.error(err);
    }
    else if (downloaded) {
        console.log("Completed the download of \"" + filename + "\"");
    }
    else {
        console.log("\"" + filename + "\" was already downloaded");
    }
});
//# sourceMappingURL=spider-cli.js.map