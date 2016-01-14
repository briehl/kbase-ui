/*global define*/
/*jslint white:true*/
/*
 * Cleans out everything that is created with build.
 */
'use strict';

var Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs-extra')),
    findit = require('findit2'),
    mutant = require('./mutant'),
    yaml = require('js-yaml'),
    bower = require('bower'),
    glob = Promise.promisify(require('glob').Glob),
    ini = require('ini'),
    underscore = require('underscore');


function evaluateSystem(state) {
    return Promise.try(function () {
        return state;
    });
}

var uiTarget = process.argv[2] || 'dev';
var deployTarget = process.argv[3] || 'ci';

evaluateSystem({
    uiTarget: uiTarget,
    deployTarget: deployTarget
})
    .then(function (state) {
        // remove mutant files
        return [state, fs.removeAsync(['mutantfiles'].join('/'))];
        // remove build and dist dirs in /dev
    })
    .spread(function (state) {
        return [state, fs.removeAsync(['..', 'dev', 'build'].join('/'))];
    })
    .spread(function (state) {
        return [state, fs.removeAsync(['..', 'dev', 'dist'].join('/'))];
    })
    .catch(function (err) {
        console.log('ERROR');
        console.log(err);
    });
