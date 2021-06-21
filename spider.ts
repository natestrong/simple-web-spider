const superagent = require('superagent');
import * as path from "path";
import * as fs from 'fs';
import {urlToFilename} from './utils';
import mkdirp = require("mkdirp");


export function spider(url: string, cb: Function) {
    const filename = urlToFilename(url);
    fs.access(filename, err => {
        if (err && err.code === 'ENOENT') {
            console.log(`Downloading ${url} into ${filename}`);
            superagent.get(url).end((err, res) => {
                if (err) {
                    cb(err);
                } else {
                    mkdirp(path.dirname(filename))
                        .then(() => fs.writeFile(filename, res.text, err => {
                                if (err) {
                                    cb(err);
                                } else {
                                    cb(null, filename, true);
                                }
                            }
                        ))
                        .catch(err => cb(err));
                }
            });
        } else {
            console.log('file exists', filename);
            cb(null, filename, false);
        }
    });
}

