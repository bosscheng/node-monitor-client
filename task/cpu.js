/*
* date: 2019-05-18
* desc:
*/
const shell = require('shelljs');
const {getRandom} = require('../utils');
const {isDev} = require('../utils/index')

// ok
module.exports = () => {
    //
    return new Promise((resolve, reject) => {

        if (isDev) {
            let stdout = getRandom(1, 10);

            let result = stdout;

            resolve(result)

        } else {
            //
            if (!shell.which('top')) {
                shell.exit(1);
                reject()
            }

            // cpu useful
            shell.exec('top -b -n 1 | grep Cpu | awk \'{print $2}\'|cut -f 1', (code, stdout, stderr) => {
                if (code === 0) {
                    resolve(stdout);
                } else {
                    reject(stderr)
                }
            })
        }
    })
};
