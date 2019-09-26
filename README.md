# node-monitor-client
 node monitor client

通过配置定时任务的方式，执行 shell 执行，然后往服务器端发送监控信息(websocket)。


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

## 内存 

其中包括： 总内存, 已用内存, 空闲内存, 缓冲(buffer), 缓存(cache)

## 日志信息
主要通过监听文件变化，发送日志到服务器。

## 网络
主要监听网络的下载带宽和上传带宽

## 系统基本情况
主要监听 currentTime， runningTime，users等信息。


# 部署(pm2)

> npm run build
