// 日志收集

// 监听文件夹的内容变化，然后发送最新内容到服务器端。
const shell = require('shelljs');
const {isDev, watch, parseTime, getEnv} = require('../utils/index');
const path = require('path');
const CONFIG = require('../config');
const fs = require('fs');
const readline = require('readline');
const schedule = require('node-schedule');
const {SCHEDULE_SECOND_TIME} = require('../constants');
const _ = require('lodash');

//
let _logDir = CONFIG.logDir[getEnv()];
let _logName = CONFIG.logName[getEnv()];
let _logPath = _logDir + _logName;

let _buffer = null;
let _socket = null;
let _address = null;
// 缓存 cache
let _localCacheList = [];
let worker = null;

// 获取日志更新时间
function _sendLogChange(curr, prev) {
    if (curr.mtime > prev.mtime) {
        let size = curr.size - prev.size;
        if (size > 0) {
            if (!fs.existsSync(_logPath)) {
                return;
            }
            let fd = fs.openSync(_logPath, 'a+');
            _buffer = Buffer.alloc(size);
            fs.read(fd, _buffer, 0, size, prev.size, function (err, bytesRead, b) {
                let newLog = b.toString();
                newLog = newLog.indexOf('\n') === 0 ? newLog.replace(/\n/, '') : newLog;
                _localCacheList.push(newLog);
                _buffer = null;
                fs.closeSync(fd);
            });
        }
    }
}

// 格式化日志，
// 字符串日志，需要格式化。
// time，level，content
function _formatLog(logs) {
    let result = [];
    // line chart
    let tempList = logs.split('\n');
    tempList = _.compact(tempList);
    console.log(tempList);
    return tempList;
}


function _doWork() {
    // 3s
    worker = schedule.scheduleJob(SCHEDULE_SECOND_TIME.five, async function (fireDate) {
        if (_localCacheList && _localCacheList.length > 0) {
            console.log(`time: ${parseTime(new Date().getTime())} , programLog`);
            let _data = {
                ip: _address,
                data: _localCacheList
            };
            _socket.emit('sync-programLog', _data);
            _localCacheList = [];
        }
    });
}


// 每个5s 的间隔把间隔产生的日志，上报到服务器上面去。然后服务器存储在数据库中。
module.exports = (socket, address) => {
    if (socket && address) {
        _socket = socket;
        _address = address;
        _doWork();
    }

    if (!fs.existsSync(_logDir)) {
        console.error(`${_logDir} is not exist`);
        return false;
    }

    // 监听文件目录变化
    watch.createMonitor(_logDir, function (monitor) {
        monitor.on("created", function (f, stat) {
            console.log(f + " created");
            // 历史文件被生成了。
        });

        monitor.on("changed", function (f, curr, prev) {
            console.log(f + " changed");
            // 监听文件变化
            if (f === _logPath) {
                _sendLogChange(curr, prev);
            } else {
                console.error(`${_logPath} is not equal ${f}`);
            }
        });

        monitor.on("removed", function (f, stat) {
            console.log(f + " removed");
        });
    });
};
