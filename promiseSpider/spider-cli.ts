import {spider} from "./spider";

const url = process.argv[2];
const nesting = Number.parseInt(process.argv[3], 10) || 1;

spider(url, nesting)
    .then(() => console.log('Download Complete'))
    .catch(err => console.log(err));

