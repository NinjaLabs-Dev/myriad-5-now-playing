const package = require('./package.json');

getPackageName = () => {
    let repo = package.repository.url;
    repo = repo.split('/');
    repo = repo[repo.length - 2] + '/' + repo[repo.length - 1].split('.git')[0];
    return repo;
}

const github = require('octonode');
const gclient = github.client();
const https = require('https');
const ghrepo = gclient.repo(getPackageName())

checkForUpdate = () => {
    ghrepo.releases(function(...args) {
        console.log(args);
    })
}

exports.checkForUpdate = checkForUpdate;
