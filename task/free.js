const shell = require('shelljs')
const {isDev, getRandom} = require('../utils/index')
const _ = require('lodash')

// ok
const formatFree = (string) => {
    string = string || ''

    let array = string.split(',')

    // 总内存, 已用内存, 空闲内存, 缓冲(buffer), 缓存(cache)
    let result = {
        total: array[0] || 0,
        used: array[1] || 0,
        free: array[2] || 0,
        buffer: array[3] || 0,
        cache: array[4] || 0,
    }

    return result
}

const getTestData = () => {
    let result = {
        total: 20000,
        used: getRandom(350, 450),
        free: 0,
        buffer: getRandom(200, 300),
        cache: getRandom(1000, 1500),
    }

    result.free = result.total - result.used - result.buffer - result.cache

    return result
}


module.exports = () => {
    return new Promise((resolve, reject) => {

        if (isDev) {
            let stdout = '14871,367,12505,258,1740'

            let result = getTestData()

            resolve(result)

        } else {
            //
            if (!shell.which('free')) {
                shell.exit(1)
                reject()
            }

            // mem
            shell.exec('free -wm | grep "Mem" | awk \'{print $2,$3,$4,$6,$7}\' OFS=","', (code, stdout, stderr) => {
                if (code === 0) {
                    resolve(formatFree(stdout))
                } else {
                    reject(stderr)
                }
            })
        }

    })

}
