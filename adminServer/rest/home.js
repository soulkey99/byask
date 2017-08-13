/**
 * Created by MengLei on 2016-07-20.
 */
"use strict";

//获取banner列表
exports.getBannerList = function *(next) {
    let body = this.request.query;
    let param = {
        start: body.start,
        page: body.page,
        limit: body.limit
    };
    if (body.valid) {
        param['valid'] = body.valid;
    }
    if (body.key) {
        param['key'] = body.key;
    }
    if (body.type) {
        param['type'] = body.type;
    }
    let list = yield proxy.HomeBanner.getAdminList(param);
    return result(this, {code: 900, list});
};

//新增、编辑banner记录
exports.editBanner = function *(next) {
    let body = this.request.body;
    let param = {
        img: body.img,
        dest: body.dest,
        remark: body.remark,
        valid: body.valid,
        seq: body.seq,
        type: body.type,
        startAt: body.startAt,
        endAt: body.endAt
    };
    if (this.params.banner_id) {
        param['banner_id'] = this.params.banner_id;
    }
    let banner = yield proxy.HomeBanner.editBanner(param);
    return result(this, {code: 900, banner_id: banner.banner_id});
};

//获取推荐列表
exports.getRecommendList = function*(next) {
    let body = this.request.query;
    let param = {
        start: body.start,
        page: body.page,
        limit: body.limit
    };
    if (body.valid) {
        param['valid'] = body.valid;
    }
    if (body.key) {
        param['key'] = body.key;
    }
    if (body.type) {
        param['type'] = body.type;
    }
    if (body.ad) {
        param['ad'] = body.ad;
    }
    if (body.special) {
        param['special'] = body.special;
    }
    let list = yield proxy.HomeRecommend.getAdminList(param);
    return result(this, {code: 900, list});
};

//新增、编辑推荐内容
exports.editRecommend = function*(next) {
    let body = this.request.body;
    let recommend = null;
    if (this.params.recommend_id) {//修改
        recommend = yield proxy.HomeRecommend.getRecommendById(this.params.recommend_id);
        if (!recommend) {
            return result(this, {code: 911, msg: '要修改的记录不存在！'});
        }
        if (body.type != undefined) {
            recommend.type = body.type;
        }
        if (body.category != undefined) {
            recommend.category = body.category;
        }
        if (body.dest != undefined) {
            recommend.dest = body.dest;
        }
        if (recommend.type == 'hot' || recommend.type == 'hotNote') {
            if (!validator.isMongoId(recommend.dest)) {
                return result(this, {code: 904, msg: 'dest参数格式不正确！'});
            }
        }
        if (body.remark != undefined) {
            recommend.remark = body.remark;
        }
        if (body.seq != undefined) {
            recommend.seq = body.seq;
        }
        if (body.special != undefined) {
            recommend.special = body.special == 'true';
        }
        if (body.ad != undefined) {
            recommend.ad = body.ad == 'true';
        }
        if (body.valid != undefined) {
            recommend.valid = body.valid == 'true';
        }
        if (body.startAt) {
            recommend.startAt = body.startAt;
        }
        if (body.endAt) {
            recommend.endAt = body.endAt;
        }
        recommend = yield recommend.save();
    } else {//新增
        let param = {
            type: body.type,
            category: body.category,
            dest: body.dest,
            remark: body.remark,
            seq: body.seq,
            special: body.special,
            ad: body.ad,
            valid: body.valid,
            startAt: body.startAt,
            endAt: body.endAt
        };
        if (param.type == 'hot' || param.type == 'hotNote') {
            if (!validator.isMongoId(param.dest)) {
                return result(this, {code: 904, msg: 'dest参数格式不正确！'});
            }
        }
        recommend = yield proxy.HomeRecommend.createRecommend(param);
    }
    return result(this, {code: 900, recommend_id: recommend.recommend_id});
};

//获取分类列表
exports.getCategoryList = function *(next) {
    let body = this.request.query;
    let param = {
        start: body.start,
        page: body.page,
        limit: body.limit,
        type: body.type,
        categoryName: this.params.categoryName || body.categoryName,
        desc: body.desc
    };
    if (body.valid) {
        param['valid'] = body.valid;
    }
    if (body.key) {
        param['key'] = body.key;
    }
    if (body.isHome) {
        param['isHome'] = body.isHome;
    }

    let list = yield proxy.Category.getAdminList(param);
    return result(this, {code: 900, list});
};

//新增、编辑分类
exports.editCategory = function *(next) {
    let body = this.request.body;
    let param = {
        category_id: this.params.category_id,
        categoryName: body.categoryName,
        type: body.type || 'category',
        order_banner: body.order_banner,
        subCategoryName: body.subCategoryName,
        isHome: body.isHome,
        img: body.img,
        seq: body.seq,
        valid: body.valid,
        desc: body.desc
    };
    if (body.keywords) {
        param.keywords = body.keywords.split(',');
    }
    let category = yield proxy.Category.editCategory(param);
    return result(this, {code: 900, category_id: category.category_id});
};

//获取广告列表
exports.getAdList = function *(next) {
    let body = this.request.query;
    let param = {
        start: body.start,
        limit: body.limit,
        valid: body.valid,
        platform: body.platform,
        type: body.type
    };
    let list = yield proxy.Advertise.getList(param);
    return result(this, {code: 900, list});
};

//编辑广告
exports.editAd = function *(next) {
    let body = this.request.body;
    if (this.params.ad_id) {
        body['ad_id'] = this.params.ad_id;
    }
    let ad = yield proxy.Advertise.editAd(body);
    return result(this, {code: 900, ad_id: ad.ad_id});
};

//预览广告
exports.previewAd = function *(next) {
    let body = this.request.query;
    let param = {
        time: body.time,
        platform: body.platform,
        resolution: body.resolution
    };
    let info = yield proxy.Advertise.getCurrentAd(param);
    return result(this, {code: 900, info});
};



