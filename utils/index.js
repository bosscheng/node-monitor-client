/*
* date: 2019-05-18
* desc:
*/

const watch = require('./watch');

const getRandomAddress = () => {
    let result = '192.168.0.';
    let last = Math.round(Math.random() * 100);

    return result + last;
};

const parseTime = (time, cFormat) => {
    if (arguments.length === 0) {
        return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
        date = time;
    } else if (typeof time === 'string') {
        date = new Date(time);
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000;
        time = +time; // 转成int 型
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
        if (result.length > 0 && value < 10) {
            value = '0' + value;
        }
        return value || 0;
    });
    return time_str;
};


// 获取 max - min
const getRandom = (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

//
const isDev = () => {
    return !(process.env.NODE_ENV && process.env.NODE_ENV === 'production');
};

// prod
const isProd = () => {
    return (process.env.NODE_ENV && process.env.NODE_ENV === 'production');
};

const getEnv = () => {
    return process.env.NODE_ENV || 'development';
};

const averageCount = (a, b) => {
    a = a || 0;
    b = b || 0;
    a = parseFloat(a);
    b = parseFloat(b);

    return parseFloat((a + b) / 2).toFixed(2);
};


module.exports = {
    getRandomAddress,
    getRandom,
    isDev,
    isProd,
    averageCount,
    watch,
    parseTime,
    getEnv
};
