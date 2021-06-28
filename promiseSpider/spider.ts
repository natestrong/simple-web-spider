import superagent from 'superagent';
import mkdirp from 'mkdirp';
import {dirname} from 'path';
import {readFile, writeFile} from "fs/promises";
import {getPageLinks, urlToFilename} from "../utils";
import {TaskQueue} from "./taskQueue";

const spidering = new Set();

function download(url, filename): Promise<string> {
    console.log(`Downloading ${url}`);
    let content;
    return superagent.get(url)
        .then(res => {
            content = res.text;
            return mkdirp(dirname(filename));
        })
        .then(() => writeFile(filename, content))
        .then(() => {
            console.log(`Downloading and saved: ${url}`);
            return content;
        });
}

function spiderLinks(currentUrl, content, nesting, queue) {
    if (nesting === 0) {
        return Promise.resolve();
    }
    const links = getPageLinks(currentUrl, content);
    const promises = links.map(link => spiderTask(link, nesting - 1, queue));
    return Promise.all(promises);
}


function spiderTask(url, nesting, queue) {
    if (spidering.has(url)) {
        return Promise.resolve();
    }
    spidering.add(url);
    const filename = urlToFilename(url);
    return queue
        .runTask(() => {
            return readFile(filename, 'utf-8')
                .catch(err => {
                    if (err.code !== 'ENOENT') {
                        throw err;
                    }
                    // this file doesn't exist, download it
                    return download(url, filename);
                });
        })
        .then(content => spiderLinks(url, content, nesting, queue));
}


export function spider(url, nesting, concurrency) {
    const queue = new TaskQueue(concurrency);
    return spiderTask(url, nesting, queue);
}

spider('https://www.reddit.com', 1, 2)
    .then(() => console.log('Download Complete'))
    .catch(err => console.log(err));



