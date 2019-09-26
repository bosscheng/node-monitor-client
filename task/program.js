/*
* date: 2019-05-22
* desc:
*/
const shell = require('shelljs');
const {isDev, getRandom,getEnv} = require('../utils/index');
const CONFIG = require('../config');

const programName = CONFIG.programName[getEnv()];

const formatProgram = (str) => {
    str = str || '';
    let arg = str.split(',');
    let result = {
        memory: arg[0] || 0,
        cpu: parseFloat(arg[1]) || 0
    };

    return result;
};

const testProgram = () => {
    let result = {
        memory: getRandom(1000, 15000),
        cpu: getRandom(15, 30)
    };

    return result;
};


module.exports = () => {

    return new Promise((resolve, reject) => {

        if (isDev) {
            // 前面是该进程的占用内存(kb), 后面是CPU占用率。
            let result = testProgram();
            resolve(result);

        } else {
            //
            if (!shell.which('ps')) {
                shell.exit(1);
                reject();
            }

            // ps
            // >1就是存活
            shell.exec(`ps -ef|grep ${programName}|wc -l`, (code, stdout, stderr) => {
                if (code === 0) {
                    if (stdout > 1) {
                        // 内存，cpu 占用情况
                        shell.exec(`top -b -n 1 |grep ${programName}|awk \'{print $6,$9}\' OFS=","`, (code1, stdout1, stderr1) => {
                            if (code1 === 0) {
                                resolve(formatProgram(stderr1));
                            }
                        });
                    } else {
                        reject();
                    }

                } else {
                    reject(stderr);
                }
            });
        }
    });
};

// ps -ef|grep gortmp|wc -l
// >1 就是存活

