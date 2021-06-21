import * as fs from 'fs';
import {download, urlToFilename} from "./utils";


export function spider(url: string, cb: Function) {
    const filename = urlToFilename(url);
    fs.access(filename, err => {
        if (!err || err.code !== 'ENOENT') {
            console.log('file exists', filename);
            return cb(null, filename, false);
        }
        download(url, filename, err => {
            if (err) return cb(err);
            cb(null, filename, true);
        });
    });
}

spider('https://www.reddit.com/r/funny/', console.log);
