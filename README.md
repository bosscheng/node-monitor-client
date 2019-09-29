# node-monitor-client
 node monitor client

通过配置定时任务的方式，执行 shell 执行，然后往服务器端发送监控信息(websocket)。

需要配合 node-monitor-server 一起使用才行。


# 配置信息
config/index.js

```js
module.exports = {
    // monitor-server 的服务器端地址
    server: {
        development: "",
        production: ""
    },
    // 日志存放地址，具体到文件。
    logDir:{
        development: "",
        production: ""
    }
};
```

# 收集的数据

## cpu

收集 cpu 使用情况。

使用的是 `top` 指令。

具体指令：`top -b -n 1 | grep Cpu | awk '{print $2}'|cut -f 1`

## 内存 

其中包括： 总内存, 已用内存, 空闲内存, 缓冲(buffer), 缓存(cache)

使用的是 `free` 指令。

具体指令：`free -wm | grep "Mem" | awk '{print $2,$3,$4,$6,$7}' OFS=","`

## 日志信息
主要通过监听文件变化，发送日志到服务器。

主要基于 `fs` 指令。

## 网络
主要监听网络的下载带宽和上传带宽。

使用的是 `iftop` 指令。

具体指令：`iftop -Pp -Nn -t -L 100 -s 1 -B|grep "Total send rate:"|awk '{print $4}'`

## 系统基本情况
主要监听 currentTime， runningTime，users等信息。

使用的是 `uptime` 指令。

具体指令 ： `uptime`

## 监听运行程序情况

主要监听的是监听程序的 cpu 占用率 和 内存占用情况。

具体指令：`top -b -n 1 |grep ${programName}|awk '{print $6,$9}' OFS=","`

# 部署(pm2)

> npm run build
