const DATA_TYPE = {
    system: 'systemInfo',
    cpu: 'cpuInfo',
    memory: 'memoryInfo',
    networkUpload: 'networkUploadInfo',
    networkDownload: 'networkDownloadInfo',
    program: 'programInfo'
};

// second
const SCHEDULE_SECOND_TIME ={
    one: '*/1 * * * * *',
    two: '*/2 * * * * *',
    three: '*/3 * * * * *',
    four: '*/4 * * * * *',
    five: '*/5 * * * * *',
    ten: '*/5 * * * * *',
    fifteen: '*/15 * * * * *'
};

// minutes
const SCHEDULE_MINUTES_TIME ={
    one: '0 */1 * * * *',
    two: '0 */2 * * * *',
    three: '0 */3 * * * *',
    four: '0 */4 * * * *',
    five: '0 */5 * * * *',
    ten: '0 */10 * * * *',
};

// hour
const SCHEDULE_HOUR_TIME ={
    one: '0 0 */1 * * *',
    two: '0 0 */2 * * *'
};

// day
const SCHEDULE_DAY_TIME = {
    one: '0 0 0 */1 * *',
};


module.exports = {
    DATA_TYPE,
    SCHEDULE_SECOND_TIME,
    SCHEDULE_MINUTES_TIME,
    SCHEDULE_HOUR_TIME,
    SCHEDULE_DAY_TIME
};
