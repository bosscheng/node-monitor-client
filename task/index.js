// 任务合计。

const uptime = require('./uptime');
const cup = require('./cpu');
const network = require('./network');
const free = require('./free');
const program = require('./program');
const log = require('./log');


module.exports = {
    getUptime: uptime,
    getCpu: cup,
    getNetworkUpload: network.upload,
    getNetworkDownload: network.download,
    getMemory: free,
    getProgram: program,
    monitorLog: log
};
