const io = require('socket.io-client');
const schedule = require('node-schedule');
const CONFIG = require('./config');
const {getUptime, getCpu, getNetworkUpload, getNetworkDownload, getMemory, getProgram, monitorLog} = require('./task');
const {getRandomAddress, isDev, averageCount, parseTime, isProd} = require('./utils');
const {DATA_TYPE, SCHEDULE_SECOND_TIME, SCHEDULE_MINUTES_TIME, SCHEDULE_HOUR_TIME, SCHEDULE_DAY_TIME} = require('./constants');
//
let address = require('ip').address();

let env = 'development';

if (process.env.pm2_env) {
    const pm2_env = JSON.parse(process.env.pm2_env);
    if (pm2_env.NODE_ENV) env = pm2_env.NODE_ENV;
    process.env.NODE_ENV = env;
} else {
    if (process.env.NODE_ENV) env = process.env.NODE_ENV;
    else process.env.NODE_ENV = env;
}

// random address
if (isDev()) {
    address = getRandomAddress();
}

console.log(`local address:${address}`);


// socket
const socket = io(CONFIG.server[env]);
console.log(`ws address:${CONFIG.server[env]}`);


// 每次间隔多少秒之后执行任务。
const scheduleSecondTimeInterval = SCHEDULE_SECOND_TIME;

// 以分钟为单位。
const scheduleMinutesTimeInterval = SCHEDULE_MINUTES_TIME;

// 以小时为单位
const scheduleHourTimeInterval = SCHEDULE_HOUR_TIME;

// 以天为单位
const scheduleDayTimeInterval = SCHEDULE_DAY_TIME;

// 实时数据
let _info = {
    ip: address,
    systemInfo: {},
    cpuInfo: 0,
    memoryInfo: {},
    networkUploadInfo: 0,
    networkDownloadInfo: 0,
    programInfo: {},
    fireDate: ''
};

// 实时minutes数据
let _tenMinutesInfo = {
    ip: address,
    systemInfo: {},
    cpuInfo: 0,
    memoryInfo: {},
    networkUploadInfo: 0,
    networkDownloadInfo: 0,
    programInfo: {},
    fireDate: ''
};


// 以hour为单位
let _hourInfo = {
    ip: address,
    systemInfo: {},
    cpuInfo: 0,
    memoryInfo: {},
    networkUploadInfo: 0,
    networkDownloadInfo: 0,
    programInfo: {},
    fireDate: ''
};

// 以day为单位
let _dayInfo = {
    ip: address,
    systemInfo: {},
    cpuInfo: 0,
    memoryInfo: {},
    networkUploadInfo: 0,
    networkDownloadInfo: 0,
    programInfo: {},
    fireDate: ''
};


// 5s
let work1 = schedule.scheduleJob(scheduleSecondTimeInterval.five, async function () {
    let systemInfo = await getSystemInfo();
    let time = parseTime(new Date());
    updateAverageInfo(DATA_TYPE.system, systemInfo);
    isDev() && console.log(`time: ${time} , systemInfo`);
    socket.emit('sync-systemInfo', systemInfo);
});


// 15s
let work2 = schedule.scheduleJob(scheduleSecondTimeInterval.fifteen, async function (fireDate) {
    let cpuInfo = await getCpuInfo();
    let time = parseTime(new Date());
    updateAverageInfo(DATA_TYPE.cpu, cpuInfo);
    isDev() && console.log(`time: ${time} , cpuInfo`);
    socket.emit('sync-cpuInfo', cpuInfo);
});

// 3s
let work3 = schedule.scheduleJob(scheduleSecondTimeInterval.three, async function (fireDate) {
    let memoryInfo = await getMemoryInfo();
    let time = parseTime(new Date());
    updateAverageInfo(DATA_TYPE.memory, memoryInfo);
    isDev() && console.log(`time: ${time} , memoryInfo`);
    socket.emit('sync-memoryInfo', memoryInfo);
});

// 5s
let work4 = schedule.scheduleJob(scheduleSecondTimeInterval.five, async function (fireDate) {
    let networkUploadInfo = await getNetworkUploadInfo();
    let time = parseTime(new Date());
    updateAverageInfo(DATA_TYPE.networkUpload, networkUploadInfo);

    isDev() && console.log(`time: ${time} , networkUploadInfo`);
    socket.emit('sync-networkUploadInfo', networkUploadInfo);
});

// 5s
let work5 = schedule.scheduleJob(scheduleSecondTimeInterval.five, async function (fireDate) {
    let networkDownloadInfo = await getNetworkDownloadInfo();
    let time = parseTime(new Date());
    updateAverageInfo(DATA_TYPE.networkDownload, networkDownloadInfo);

    isDev() && console.log(`time: ${time} , networkDownloadInfo`);
    socket.emit('sync-networkDownloadInfo', networkDownloadInfo);
});

// 5s
let work6 = schedule.scheduleJob(scheduleSecondTimeInterval.five, async function (fireDate) {
    let programInfo = await getProgramInfo();
    let time = parseTime(new Date());
    updateAverageInfo(DATA_TYPE.program, programInfo);
    isDev() && console.log(`time: ${time} , programInfo`);
    socket.emit('sync-programInfo', programInfo);
});


// 一分钟一次的频率 平均值
let work7 = schedule.scheduleJob(scheduleMinutesTimeInterval.one, function (fireDate) {
    let runTime = new Date().getTime();
    let time = parseTime(runTime);
    _info.fireDate = runTime;
    isDev() && console.log(_info);
    console.log(`time: ${time} , history-minutes`);
    socket.emit('sync-history-minutes', _info);
});

// 十分钟一次的频率 平均值
let work8 = schedule.scheduleJob(scheduleMinutesTimeInterval.ten, function (fireDate) {
    let runTime = new Date().getTime();
    let time = parseTime(runTime);
    _tenMinutesInfo.fireDate = runTime;

    isDev() && console.log(_tenMinutesInfo);
    console.log(`time: ${time} , history-10minutes`);
    socket.emit('sync-history-10minutes', _tenMinutesInfo);
});

// 一小时一次的频率 平均值;
let work9 = schedule.scheduleJob(scheduleHourTimeInterval.one, function (fireDate) {
    let runTime = new Date().getTime();
    let time = parseTime(runTime);
    _hourInfo.fireDate = runTime;

    isDev() && console.log(_hourInfo);
    console.log(`time: ${time} , history-hour`);
    socket.emit('sync-history-hour', _hourInfo);
});


// 24小时一次的频率
let work10 = schedule.scheduleJob(scheduleDayTimeInterval.one, function (fireDate) {
    let runTime = new Date().getTime();
    let time = parseTime(runTime);
    _dayInfo.fireDate = runTime;

    isDev() && console.log(_dayInfo);
    console.log(`time: ${time}, history-day`);
    socket.emit('sync-history-day', _dayInfo);
});

// 上报日志信息。
monitorLog(socket, address);

//
let getSystemInfo = async () => {
    let systemInfo = await getUptime();

    let result = {
        ip: address,
        data: systemInfo
    };

    return result;
};


//
let getCpuInfo = async () => {
    let cpuInfo = await getCpu();

    let result = {
        ip: address,
        data: cpuInfo
    };

    return result;
};


//
let getMemoryInfo = async () => {
    let memoryInfo = await getMemory();

    let result = {
        ip: address,
        data: memoryInfo
    };

    return result;
};

//
let getNetworkUploadInfo = async () => {
    let networkUpload = await getNetworkUpload();
    let result = {
        ip: address,
        data: networkUpload + ''
    };

    return result;
};

//
let getNetworkDownloadInfo = async () => {
    let networkDownload = await getNetworkDownload();

    let result = {
        ip: address,
        data: networkDownload + ''
    };

    return result;
};

let getProgramInfo = async () => {
    let programInfo = await getProgram();

    let result = {
        ip: address,
        data: programInfo
    };

    return result;
};

// 更新 平均值
let updateAverageInfo = (type, data) => {
    data = data || {};
    let _data = data.data;

    switch (type) {
        case DATA_TYPE.system:
            _info.systemInfo = _data;
            _tenMinutesInfo.systemInfo = _data;
            _hourInfo.systemInfo = _data;
            _dayInfo.systemInfo = _data;
            break;
        case DATA_TYPE.cpu:
            _info.cpuInfo = averageCount(_info.cpuInfo, _data);
            _tenMinutesInfo.cpuInfo = averageCount(_tenMinutesInfo.cpuInfo, _data);
            _hourInfo.cpuInfo = averageCount(_hourInfo.cpuInfo, _data);
            _dayInfo.cpuInfo = averageCount(_dayInfo.cpuInfo, _data);
            break;
        case DATA_TYPE.program:
            // 1 minute
            let tempInfo = {
                memory: averageCount(_info.programInfo.memory, _data.memory),
                cpu: averageCount(_info.programInfo.cpu, _data.cpu)
            };
            _info.programInfo = tempInfo;

            // 10 minute
            let temp10MinInfo = {
                memory: averageCount(_tenMinutesInfo.programInfo.memory, _data.memory),
                cpu: averageCount(_tenMinutesInfo.programInfo.cpu, _data.cpu)
            };
            _tenMinutesInfo.programInfo = temp10MinInfo;

            // hour
            let tempHourInfo = {
                memory: averageCount(_hourInfo.programInfo.memory, _data.memory),
                cpu: averageCount(_hourInfo.programInfo.cpu, _data.cpu)
            };
            _hourInfo.programInfo = tempHourInfo;

            // day
            let tempDayInfo = {
                memory: averageCount(_dayInfo.programInfo.memory, _data.memory),
                cpu: averageCount(_dayInfo.programInfo.cpu, _data.cpu)
            };
            _dayInfo.programInfo = tempDayInfo;
            break;
        case DATA_TYPE.memory:
            let tempInfo2 = {
                total: _data.total,
                used: averageCount(_info.memoryInfo.used, _data.used),
                free: averageCount(_info.memoryInfo.free, _data.free),
                buffer: averageCount(_info.memoryInfo.free, _data.buffer),
                cache: averageCount(_info.memoryInfo.cache, _data.cache)
            };
            _info.memoryInfo = tempInfo2;

            // 10 minute
            let temp10MinInfo2 = {
                total: _data.total,
                used: averageCount(_tenMinutesInfo.memoryInfo.used, _data.used),
                free: averageCount(_tenMinutesInfo.memoryInfo.free, _data.free),
                buffer: averageCount(_tenMinutesInfo.memoryInfo.free, _data.buffer),
                cache: averageCount(_tenMinutesInfo.memoryInfo.cache, _data.cache)
            };
            _tenMinutesInfo.memoryInfo = temp10MinInfo2;

            // hour
            let tempHourInfo2 = {
                total: _data.total,
                used: averageCount(_hourInfo.memoryInfo.used, _data.used),
                free: averageCount(_hourInfo.memoryInfo.free, _data.free),
                buffer: averageCount(_hourInfo.memoryInfo.free, _data.buffer),
                cache: averageCount(_hourInfo.memoryInfo.cache, _data.cache)
            };
            _hourInfo.memoryInfo = tempHourInfo2;

            // day
            let tempDayInfo2 = {
                total: _data.total,
                used: averageCount(_dayInfo.memoryInfo.used, _data.used),
                free: averageCount(_dayInfo.memoryInfo.free, _data.free),
                buffer: averageCount(_dayInfo.memoryInfo.free, _data.buffer),
                cache: averageCount(_dayInfo.memoryInfo.cache, _data.cache)
            };
            _dayInfo.memoryInfo = tempDayInfo2;

            break;
        case DATA_TYPE.networkUpload:
            _info.networkUploadInfo = averageCount(_info.networkUploadInfo, _data);
            _tenMinutesInfo.networkUploadInfo = averageCount(_tenMinutesInfo.networkUploadInfo, _data);
            _hourInfo.networkUploadInfo = averageCount(_hourInfo.networkUploadInfo, _data);
            _dayInfo.networkUploadInfo = averageCount(_hourInfo.networkUploadInfo, _data);
            break;
        case DATA_TYPE.networkDownload:
            _info.networkDownloadInfo = averageCount(_info.networkDownloadInfo, _data);
            _tenMinutesInfo.networkDownloadInfo = averageCount(_tenMinutesInfo.networkDownloadInfo, _data);
            _hourInfo.networkDownloadInfo = averageCount(_hourInfo.networkDownloadInfo, _data);
            _dayInfo.networkDownloadInfo = averageCount(_dayInfo.networkDownloadInfo, _data);
            break;
    }
};


//
socket.on('connect_error', () => {
    console.log('connect error');
});

//
socket.on('connect_timeout', () => {
    console.log('connect timeout');
});

socket.on('reconnect', () => {
    console.log('have been reconnected');
});

socket.on('reconnect_attempt', () => {
    console.log('attempt to reconnect has failed');
});

socket.on('reconnect_error', () => {
    console.log('reconnect error');
});

socket.on('reconnect_failed', () => {
    console.log('reconnect failed');
});


//
socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        socket.connect();
    }
    // else the socket will automatically try to reconnect
});





