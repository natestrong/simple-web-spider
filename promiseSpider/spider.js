"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spider = void 0;
var superagent_1 = __importDefault(require("superagent"));
var mkdirp_1 = __importDefault(require("mkdirp"));
var util_1 = require("util");
var path_1 = require("path");
var promises_1 = require("fs/promises");
var utils_1 = require("../utils");
var mkdirpPromises = util_1.promisify(mkdirp_1.default);
function download(url, filename) {
    console.log("Downloading " + url);
    var content;
    return superagent_1.default.get(url)
        .then(function (res) {
        content = res.text;
        return mkdirpPromises(path_1.dirname(filename), null);
    })
        .then(function () { return promises_1.writeFile(filename, content); })
        .then(function () {
        console.log("Downloading and saved: " + url);
        return content;
    });
}
function spiderLinks(currentUrl, content, nesting) {
    var promise = Promise.resolve();
    if (nesting === 0) {
        return promise;
    }
    var links = utils_1.getPageLinks(currentUrl, content);
    var _loop_1 = function (link) {
        promise = promise.then(function () { return spider(link, nesting - 1); });
    };
    for (var _i = 0, links_1 = links; _i < links_1.length; _i++) {
        var link = links_1[_i];
        _loop_1(link);
    }
}
function spider(url, nesting) {
    var filename = utils_1.urlToFilename(url);
    return promises_1.readFile(filename, 'utf-8')
        .catch(function (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
        // this file doesn't exist, so download it
        return download(url, filename);
    })
        .then(function (content) { return spiderLinks(url, content, nesting); });
}
exports.spider = spider;
//# sourceMappingURL=spider.js.map