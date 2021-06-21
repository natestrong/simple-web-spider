import * as path from 'path';
import {URL} from 'url';
import slug from "slug";
import fs from "fs";
import superagent from 'superagent';
import mkdirp from "mkdirp";

export function urlToFilename(url) {
    const parsedUrl = new URL(url);
    const urlPath = parsedUrl.pathname.split('/')
        .filter(c => c !== '')
        .map(c => slug(c, {remove: null}))
        .join('/');
    let filename = path.join(parsedUrl.hostname, urlPath);
    if (!path.extname(filename).match(/htm/)) {
        filename += '.html';
    }
    return filename;
}

export function saveFile(filename, contents, cb) {
    mkdirp(path.dirname(filename))
        .then(() => {
            fs.writeFile(filename, contents, err => {
                if (err) return cb(err);
                cb(null, filename, true);
            });
        })
        .catch(err => cb(err));

}

export function download(url, filename, cb) {
    console.log(`Downloading ${url} into ${filename}`);
    superagent.get(url).end((err, res) => {
        if (err) return cb(err);
        saveFile(filename, res.text, err => {
            if (err) return cb(err);
            console.log(`Downloaded and saved: ${url}`);
            cb(null, res.text);
        });
    });
}
