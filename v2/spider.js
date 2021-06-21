"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spider = void 0;
var fs = __importStar(require("fs"));
var utils_1 = require("./utils");
var spidering = new Set();
function spider(url, nesting, cb) {
    if (spidering.has(url)) {
        return process.nextTick(cb);
    }
    spidering.add(url);
    var filename = utils_1.urlToFilename(url);
    fs.readFile(filename, 'utf8', function (err, fileContent) {
        if (err) {
            if (err && err.code !== 'ENOENT') {
                return cb(err);
            }
            // The file doesn't exist, so let's download it
            return utils_1.download(url, filename, function (err, requestContent) {
                if (err)
                    return cb(err);
                spiderLinks(url, requestContent, nesting, cb);
            });
        }
        // The file already exists, let's process the links
        spiderLinks(url, fileContent, nesting, cb);
    });
}
exports.spider = spider;
function spiderLinks(currentUrl, body, nesting, cb) {
    if (nesting === 0) {
        return process.nextTick(cb);
    }
    var links = utils_1.getPageLinks(currentUrl, body);
    if (links.length === 0) {
        return process.nextTick(cb);
    }
    var completed = 0;
    var hasErrors = false;
    function done(err) {
        if (err) {
            hasErrors = true;
            return cb(err);
        }
        if (++completed === links.length && !hasErrors) {
            return cb();
        }
    }
    links.forEach(function (link) { return spider(link, nesting - 1, done); });
}
// spider('https://www.reddit.com/r/funny/', console.log);
//# sourceMappingURL=spider.js.map