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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageLinks = exports.download = exports.saveFile = exports.urlToFilename = void 0;
var path = __importStar(require("path"));
var url_1 = require("url");
var slug_1 = __importDefault(require("slug"));
var fs_1 = __importDefault(require("fs"));
var superagent_1 = __importDefault(require("superagent"));
var mkdirp_1 = __importDefault(require("mkdirp"));
var cheerio_1 = __importDefault(require("cheerio"));
function urlToFilename(url) {
    var parsedUrl = new url_1.URL(url);
    var urlPath = parsedUrl.pathname.split('/')
        .filter(function (c) { return c !== ''; })
        .map(function (c) { return slug_1.default(c, { remove: null }); })
        .join('/');
    var filename = path.join(parsedUrl.hostname, urlPath);
    if (!path.extname(filename).match(/htm/)) {
        filename += '.html';
    }
    return filename;
}
exports.urlToFilename = urlToFilename;
function saveFile(filename, contents, cb) {
    mkdirp_1.default(path.dirname(filename))
        .then(function () {
        fs_1.default.writeFile(filename, contents, function (err) {
            if (err)
                return cb(err);
            cb(null, filename, true);
        });
    })
        .catch(function (err) { return cb(err); });
}
exports.saveFile = saveFile;
function download(url, filename, cb) {
    console.log("Downloading " + url + " into " + filename);
    superagent_1.default.get(url).end(function (err, res) {
        if (err)
            return cb(err);
        saveFile(filename, res.text, function (err) {
            if (err)
                return cb(err);
            console.log("Downloaded and saved: " + url);
            cb(null, res.text);
        });
    });
}
exports.download = download;
function getLinkUrl(currentUrl, element) {
    var parsedLink = new url_1.URL(element.attribs.href || '', currentUrl);
    var currentParsedUrl = new url_1.URL(currentUrl);
    if (parsedLink.hostname !== currentParsedUrl.hostname ||
        !parsedLink.pathname) {
        return null;
    }
    return parsedLink.toString();
}
;
function getPageLinks(currentUrl, body) {
    return Array.from(cheerio_1.default.load(body)('a'))
        .map(function (element) {
        return getLinkUrl(currentUrl, element);
    })
        .filter(Boolean);
}
exports.getPageLinks = getPageLinks;
//# sourceMappingURL=utils.js.map