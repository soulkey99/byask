/**
 * Created by MengLei on 2016-06-16.
 */
"use strict";
//mergeLog，将已有的console.log中的内容merge到日期log中，同时将console.log中的内容清空
const path = require('path');
const fs = require('fs-extra');

var logPath = path.join(__dirname, 'public', 'console.log');  //console log 的路径
var dateLog = path.join(__dirname, 'public', getDateStr() + '.log');

if (fs.existsSync(logPath)) {
    //如果不存在今天的dataLog，那么需要新建一个文件，如果已经存在今天的dateLog，那么将console.log中的内容附加到dateLog后面，然后清空console.log
    if (!fs.existsSync(dateLog)) {
        fs.ensureFileSync(dateLog);
    }
    let ws = fs.createWriteStream(dateLog, {flags: 'r+', start: fs.readFileSync(dateLog).length});
    let rs = fs.createReadStream(logPath, {flags: 'r', autoClose: true});
    rs.pipe(ws);
    ws.on('finish', ()=> {
        console.log('everything ok.');
        // fs.unlinkSync(logPath);
        fs.writeFileSync(logPath, `cleared: ${getDateStr()}\r\n`, 'utf8');
    });
}

function getDateStr() {
    var curDate = new Date();
    var yearStr = (curDate.getFullYear()).toString();
    var monthStr = (curDate.getMonth() + 1).toString();
    var dateStr = (curDate.getDate()).toString();
    monthStr = monthStr.length == 1 ? '0' + monthStr : monthStr;
    dateStr = dateStr.length == 1 ? '0' + dateStr : dateStr;

    return yearStr + monthStr + dateStr;
}