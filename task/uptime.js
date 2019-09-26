/*
* date: 2019-05-11
* desc: uptime
*/

const shell = require('shelljs');
const _ = require('lodash');

// ok
function formatUpTime(str) {
    let result = {};
    if (!str) {
        return result;
    }

    try {
        let arg1 = str.split('  ');
        let arg2 = arg1[1].split(',');
        let loadAverages = arg2[3] ? arg2[3].split(': ')[1].split(' ') : [];

        loadAverages = loadAverages.map((loadAverage) => {
            return _.trim(loadAverage);
        });

        result = {
            currentTime: arg1[0],
            runningTime: arg2[0] + ',' + arg2[1],
            users: arg2[2],
            loadAverages
        };
    } catch (e) {
        console.error(e);
    }

    return result;
}

//
module.exports = () => {
    return new Promise((resolve, reject) => {
        //
        if (!shell.which('uptime')) {
            shell.exit(1);
            reject();
        }
        //
        shell.exec('uptime', (code, stdout, stderr) => {
            if (code === 0) {
                resolve(formatUpTime(stdout));
            } else {
                reject(stderr);
            }
        });
    });

};
