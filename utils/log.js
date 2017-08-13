/**
 * Created by MengLei on 2016-06-13.
 */
"use strict";
const log4js = require('log4js');
const path = require('path');
const fs = require('co-fs-extra');

const logPath = path.join(__dirname, '../public', 'logs');

fs.ensureDirSync(path.join(logPath));

let logType = !!process.env.NODE_ENV ? 'dateFile' : 'console';

log4js.configure({
    appenders: [
        {
            type: logType,
            filename: path.join(logPath, 'http.log'),
            pattern: '_MMddhh.log',
            alwaysIncludePattern: false,
            category: 'http'
        }, {
            type: logType,
            filename: path.join(logPath, 'file.log'),
            pattern: '_MMddhh.log',
            alwaysIncludePattern: false,
            category: 'file'
        }, {
            type: logType,
            filename: path.join(logPath, 'mqtt.log'),
            pattern: '_MMddhh.log',
            alwaysIncludePattern: false,
            category: 'mqtt'
        }, {
            type: logType,
            filename: path.join(logPath, 'umeng.log'),
            pattern: '_MMddhh.log',
            alwaysIncludePattern: false,
            category: 'umeng'
        }, {
            type: logType,
            filename: path.join(logPath, 'some.log'),
            pattern: '_MMddhh.log',
            alwaysIncludePattern: false,
            category: 'some'
        }, {
            type: logType,
            filename: path.join(logPath, 'admin.log'),
            pattern: '_MMddhh.log',
            alwaysIncludePattern: false,
            category: 'admin'
        }, {
            type: 'console',
            category: 'console'
        }
    ],
    replaceConsole: true
});

let logger = log4js.getLogger('console');
logger.admin = log4js.getLogger('admin');
logger.http = log4js.getLogger('http');
logger.file = log4js.getLogger('file');
logger.mqtt = log4js.getLogger('mqtt');
logger.umeng = log4js.getLogger('umeng');
logger.some = log4js.getLogger('some');

module.exports = logger;
