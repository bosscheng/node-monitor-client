/*
* date: 2019-05-18
* desc: network
*/

const shell = require('shelljs');
const {isDev} = require('../utils/index');
const {getRandom} = require('../utils');


// ok
const formatNetwork = (str) => {
    str = str || '';
    // remove
    let result = str.replace('B', '');
    // B -> KB
    result = parseInt(result, 10) / 1024;

    return result.toFixed(2);
}

module.exports = {
    upload: () => {
        //
        return new Promise((resolve, reject) => {

            if (isDev) {
                let stdout = getRandom(50, 80) + 'B';

                let result = formatNetwork(stdout);

                resolve(result)

            } else {
                //
                if (!shell.which('iftop')) {
                    shell.exit(1);
                    reject()
                }

                // 发送速率
                // iftop -Pp -Nn -t -L 100 -s 1 -B|grep "Total send rate:"|awk '{print $4}'
                shell.exec('iftop -Pp -Nn -t -L 100 -s 1 -B|grep "Total send rate:"|awk \'{print $4}\'', (code, stdout, stderr) => {
                    if (code === 0) {
                        let speed = formatNetwork(stdout);
                        resolve(speed)
                    } else {
                        reject(stderr)
                    }
                })
            }


        })
    },
    download: () => {
        //
        return new Promise((resolve, reject) => {

            if (isDev) {
                let stdout = getRandom(100, 300) + 'B';

                let result = formatNetwork(stdout);

                resolve(result)

            } else {
                //
                if (!shell.which('iftop')) {
                    shell.exit(1);
                    reject()
                }

                // 接收速率
                // iftop -Pp -Nn -t -L 100 -s 1 -B|grep "Total receive rate:"|awk '{print $4}'
                shell.exec('iftop -Pp -Nn -t -L 100 -s 1 -B|grep "Total receive rate:"|awk \'{print $4}\'', (code, stdout, stderr) => {
                    if (code === 0) {
                        //
                        let speed = formatNetwork(stdout);
                        resolve(speed)
                    } else {
                        reject(stderr)
                    }
                })
            }
        })
    }
}
