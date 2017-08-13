/**
 * Created by MengLei on 2016-06-17.
 */
"use strict";
const fs = require('fs');
const path = require('path');

//遍历指定路径
function Walk(pa) {
    pa = path.resolve(pa);
    let list = [];
    walk(pa);
    function walk(pa) {
        let s = fs.lstatSync(pa);
        if(!s.isDirectory()){
            return list.push(pa);
        }
        fs.readdirSync(pa).forEach(item=>{
            walk(path.join(pa, item));
        });
    }
    return list;
}

module.exports = Walk;
