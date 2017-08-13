/**
 * Created by MengLei on 2016-06-15.
 */
"use strict";

module.exports = {
    genDateStr: genDateStr,
    genTimeStr: genTimeStr,
    genDateTimeStr: genDateTimeStr
};

function genDateStr(t) {
    if (!t) {
        t = Date.now();
    }
    //生成八位日期字符串
    let curDate = new Date(t);
    let month = (curDate.getMonth() + 1).toString();
    let date = curDate.getDate().toString();
    return `${curDate.getFullYear().toString()}-${month.length < 2 ? '0' + month : month}-${date.length < 2 ? '0' + date : date}`;
}

function genTimeStr(t) {
    if (!t) {
        t = Date.now();
    }
    //生成时间字符串12:00:00
    let curDate = new Date(t);
    let hour = (curDate.getHours()).toString();
    let minute = (curDate.getMinutes()).toString();
    let second = (curDate.getSeconds()).toString();
    return `${hour.length < 2 ? ( '0' + hour) : hour}:${minute.length < 2 ? ( '0' + minute) : minute}:${second.length < 2 ? ( '0' + second) : second}`;
}

function genDateTimeStr(t) {
    if (!t) {
        t = Date.now();
    }
    //生成日期时间字符串 2016-01-02 12:00:00
    return genDateStr(t) + ' ' + genTimeStr(t);
}
