console.log("Starting WebServer and API Server")
const express = require('express')
const zlib = require('zlib')
const tarfs = require('tar-fs')
const path = require("path")
const fs = require('fs')
const Docker = require('dockerode')
console.log("Connecting to Docker API Server")

const docker = new Docker({
    host: "localhost",
    port: 2375,
    version: 'v1.41'
})
docker.ping((error, result) => {
    if (error) console.log(error.toString())
    if (result == "OK") console.log("Connected to Docker API Server")
})

const request = require('./api/request')
// request("localhost", 2375, "/containers/208edde50876c2a8edbb49aaed2ed439eebbe4d56d7ec2d08171754487fe1015/logs", {
//     stdout: true, stderr: true, follow: true, timestamps: true, 
// }, "GET", res => {
//     res.on('data', (data) => {
//         console.log(data.toString())
//     })
// })

request("localhost", 2375, "/containers/7c192f3b21947e152a3e0c3780e3a0a45ed512e73f9fdebd29e392f851bf8e37/archive", {
    path: "/usr/src/apptest/"
}, "GET", res => {
    console.time("T")
    let s = fs.createWriteStream('./Text.tar', {encoding: 'utf8'})
    // let d = ""
    res.on('data', (data) => {
        s.write(data.toString())
        // d += data
        // console.log(data.toString())
    })
    res.on('end', () => {
        console.timeEnd("T")
        console.log("Done")
        s.close()
        
    })
})




function calculateCPUPercentUnix(previousCPU, previousSystem, v) {
    v = JSON.parse(v.toString())
    let cpuPercent = 0.0
    // calculate the change for the cpu usage of the container in between readings
    let cpuDelta = v.cpu_stats.cpu_usage.total_usage - previousCPU
    // calculate the change for the entire system between readings
    let systemDelta = v.cpu_stats.system_cpu_usage - previousSystem


    if (systemDelta > 0.0 && cpuDelta > 0.0) {
        cpuPercent = (cpuDelta / systemDelta) * 8 * 100.0
    }
    return cpuPercent
}
const app = express()
app.use(function apiHandler(req, res, next) {
    if (req.path == '/api') {
        require('./api/api')(req, res, next)
        next()
    }
})
app.use(function websiteHandler(req, res, next) {
    if (req.method === 'GET' && req.path != '/api') {
    }
})

app.listen(2000)