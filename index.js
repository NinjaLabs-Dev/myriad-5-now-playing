const utils = require('./utils');
const fs = require('fs');
const parser = require('xml-js');
require('dotenv').config();
const env = process.env;
const stationNowPlaying = env.STATION_INFO_DIR;
const output = env.NOWPLAYING_OUTPUT || './NowPlaying.txt';

utils.checkForUpdate();

if(!stationNowPlaying || !output) return console.log("[ ERRR ] We're missing a value! Check your .env file");


console.log("[ INFO ] Application is up and running");

fs.writeFile(output, '', (err) => {
    if (err) console.log(`[ ERRR ] ` + err);
});

fs.watchFile(stationNowPlaying, (curr) => {
    const xml = fs.readFileSync(stationNowPlaying, 'utf8');

    let data = parser.xml2json(xml, {compact: true, spaces: 4});

    let item = JSON.parse(data);
    item = item.nowPlaying.logItem[0];

    if(!item._attributes) return console.log('[ ERRR ] Couldn\'t detect type')

    if(item._attributes.type !== 'song') return console.log('[ INFO ] Skipping, not valid song');

    let artists, title;

    console.log()

    if(Array.isArray(item.artists.artist)) {
        let a = [];
        item.artists.artist.forEach(artist => {
            a.push(artist.name._text)
        });
        
        artists = a.join(', ');
    } else {
        artists = item.artists.artist.name._text;
    }
    
    title = item.title.title._text;
	
	if((title === null) || (artists === null)){
		console.log('[ INFO ] Skipping, Song or Artist was empty')
	};

    console.log(`[ INFO ] Setting playing to: ${artists} - ${title}`)

    fs.writeFile(output, `${artists} - ${title}`, (err) => {
        if (err) console.log(`[ ERRR ] ` + err);
    });
});