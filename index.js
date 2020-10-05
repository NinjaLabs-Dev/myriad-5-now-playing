const utils = require('./utils');
const fs = require('fs');
const parser = require('xml-js');
require('dotenv').config();
const env = process.env;
const stationNowPlaying = env.STATION_INFO_DIR;
const output = env.NOWPLAYING_OUTPUT || './NowPlaying.txt';

if(!stationNowPlaying || !output) return console.log("[ ERRR ] We're missing a value! Check your .env file");

console.log("[ INFO ] Application is up and running");

fs.writeFile(output, '', (err) => {
    if (err) console.log(`[ ERRR ] ` + err);
});

fs.watchFile(stationNowPlaying, (curr) => {
    const xml = fs.readFileSync(stationNowPlaying, 'utf8');

    let data = parser.xml2json(xml, {compact: true, spaces: 4});

    let item = JSON.parse(data);
    item = item.nowPlaying.logItem[0]

    if(item.itemType._text !== 'song') return console.log('[ INFO ] Skipping, not valid song');

    let title = item.title.title;
    let artists = item.artists.artist.name;

    if((title === null) && (artists === null)) return console.log('[ INFO ] Skipping, Song or Artist was empty');

    title = title._text;
    artists = artists._text;

    console.log(`[ INFO ] Setting playing to: ${title} - ${artists}`)

    fs.writeFile(output, `${title} - ${artists}`, (err) => {
        if (err) console.log(`[ ERRR ] ` + err);
    });
});
