/**
 * Created by MengLei on 2016-05-31.
 */
"use strict";
const fs = require('fs-extra');

module.exports = (process.env.NODE_ENV == 'production' ? {
    key: fs.readFileSync('./cert/prod.key'),
    cert: fs.readFileSync('./cert/prod.crt')
} : {
    key: fs.readFileSync('./cert/test.key'),
    cert: fs.readFileSync('./cert/test.crt')
});