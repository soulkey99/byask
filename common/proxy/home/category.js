/**
 * Created by MengLei on 2016-06-16.
 */
"use strict";
const model = require('../../model');

/**
 * 获取首页返回的分类列表
 * Callback;
 * - err, 数据库异常
 * - doc, 返回结果
 */
exports.homeCategory = function*() {
    let res = yield model.Category.find({type: 'category', isHome: true, valid: true}).sort({seq: 1});
    let list = [];
    res.forEach(item => {
        list.push({
            categoryName: item.categoryName,
            img: item.img,
            type: item.type
        });
    });
    return list;
};

/**
 * 根据query内容获取category
 * @param query
 * @param opt
 * @returns {*}
 */
exports.getCategoryByQuery = function *(query, opt) {
    return yield model.Category.find(query, {}, opt);
};

/**
 * 获取新建话题时候的可用分类、子分类列表
 * @param categoryName
 * @returns {Array}
 */
exports.getCategoryList = function *(categoryName) {
    let query = {valid: true};
    let list = [];
    if (categoryName) {
        query['type'] = 'subCategory';
        query['categoryName'] = categoryName;
        let res = yield model.Category.find(query).sort({seq: 1});
        res.forEach(item=>list.push(item.subCategoryName));
    } else {
        let res = yield model.Category.find({valid: true}).sort({seq: 1});
        for (let i = 0; i < res.length; i++) {
            if (res[i].type == 'category') {
                list.push({name: res[i].categoryName, list: []});
            }
        }
        for (let i = 0; i < res.length; i++) {
            if (res[i].type == 'subCategory') {
                for (let j = 0; j < list.length; j++) {
                    if (res[i].categoryName == list[j].name) {
                        list[j].list.push(res[i].subCategoryName);
                    }
                }
            }
        }
    }
    return list;
};

/**
 * 获取管理端查看的首页分类列表
 * @param param = {start: '', page: '', limit: '', valid: '', key: ''， type: '', isHome: ''}
 * @returns {Array}
 */
exports.getAdminList = function *(param) {
    let list = [];
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {};
    if (param.valid) {
        query['valid'] = param.valid == 'true';
    }
    if (param.key) {
        query['desc'] = {$regex: param.key};
    }
    if (param.categoryName) {
        query['categoryName'] = param.categoryName;
    }
    if (param.type) {
        query['type'] = param.type;
    }
    let res = yield model.Category.find(query).sort({createdAt: -1}).skip(start).limit(count);
    res.forEach(i=>list.push(i.toItem()));
    return list;
};

/**
 * 新增、编辑分类
 * @param info = {category_id: '', type: '', categoryName: '', subCategoryName: '', desc: '', keywords: [], img: '', isHome: '', homeSeq: ''}
 * @returns {*}
 */
exports.editCategory = function *(info) {
    let type = info.type == 'subCategory' ? 'subCategory' : 'category';
    let category = null;
    if (info.category_id) {
        category = yield model.Category.findById(info.category_id);
    }
    if (!category) {
        category = new (model.Category)();
        category.type = type;
    }
    if (info.categoryName != undefined) {
        category.categoryName = info.categoryName;
    }
    if (type == 'subCategory' && info.subCategoryName != undefined) {
        category.subCategoryName = info.subCategoryName;
    }
    if (info.desc != undefined) {
        category.desc = info.desc;
    }
    if (info.keywords) {
        category.keywords = info.keywords;
    }
    if (info.order_banner != undefined) {
        category.order_banner = info.order_banner;
    }
    if (info.img != undefined) {
        category.img = info.img;
    }
    if (info.isHome != undefined) {
        category.isHome = info.isHome == 'true';
    }
    if (info.seq != undefined) {
        category.seq = info.seq;
    }
    if (info.valid != undefined) {
        category.valid = info.valid == 'true';
    }
    return yield category.save();
};


