/**
 * Created by MengLei on 2016-05-30.
 */
"use strict";
const mongoose = require('mongoose');
const BaseModel = require('../baseModel');
const Schema = mongoose.Schema;

let UserInfoSchema = new Schema({
    name: {type: String, default: ''},
    city: {type: String, default: ''}
}, {_id: false});

let CategorySchema = new Schema({
    categoryName: {type: String},
    subCategory: {type: [String], default: []}
}, {_id: false});

let ExpertInfoSchema = new Schema({
    title: {type: String, default: ''},     //专家头衔（职务）
    finished: {type: Number, default: 0},   //专家完成订单数
    card: {type: String, default: ''},  //专家名片
    work_year: {type: String, default: ''},     //工作年限，显示一个string
    banner: {type: String, default: ''},        //个性照片
    major: {type: [String], default: []},   //专家tag
    category: {type: [CategorySchema], default: []},    //专家分类
    company: {type: String, default: ''},   //专家就职公司
    note_price: {type: Number, default: 1000},  //小纸条收费价格
    note_replied: {type: Number, default: 0},   //回答小纸条数量
    note_listened: {type: Number, default: 0},  //小纸条被偷听数量
    self_intro: {type: String, default: ''},    //专家自我介绍
    status: {type: String, default: 'notVerified'}, //专家资格审核状态
    rating: {type: Number, default: 0},     //专家评分
    total_rating: {type: Number, default: 0},   //评分总和
    confirm_time: {type: Number, default: 0},   //平均回应时间（分钟）
    confirm_rate: {type: Number, default: 0},   //订单平均回应率
    note_confirm_rate: {type: Number, default: 0}   //小纸条平均回应率
}, {
    _id: false,
    toObject: {
        transform(doc, ret) {
            delete(ret._id);
            delete(ret.id);
            if (ret.confirm_rate == 0) {
                ret.confirm_rate_text = '暂无';
            } else if (ret.confirm_rate < 0.4) {
                ret.confirm_rate_text = '低';
            } else if (ret.confirm_rate_text < 0.7) {
                ret.confirm_rate_text = '中';
            } else {
                ret.confirm_rate_text = '高';
            }
            if (ret.note_confirm_rate == 0) {
                ret.note_confirm_rate_text = '暂无';
            } else if (ret.note_confirm_rate < 0.4) {
                ret.note_confirm_rate_text = '低';
            } else if (ret.note_confirm_rate_text < 0.7) {
                ret.note_confirm_rate_text = '中';
            } else {
                ret.note_confirm_rate_text = '高';
            }
        }
    }
});

let UserSchema = new Schema({
    _id: {type: Schema.ObjectId},
    phone: {type: String, default: ''},
    passwd: {type: String, default: ''},
    block_util: {type: Date, default: null},
    block_reason: {type: String, default: ''},
    order_phone: {type: String, default: ''},   //呼叫使用的手机号，如果phone为空，那么使用该号码进行呼叫，对于使用微信登陆的用户，进行订单呼叫之前，需要提示用户设置该手机号
    email: {type: String, default: ''},
    nick: {type: String, default: ''},
    intro: {type: String, default: ''},
    avatar: {type: String, default: ''},
    userInfo: {type: UserInfoSchema, default: {}},
    moneyInfo: {   //钱包信息
        money: {type: Number, default: 0},  //余额
        total: {type: Number, default: 0},  //总收益
        order: {type: Number, default: 0},  //订单收益
        note: {type: Number, default: 0},   //小纸条收益
        withdrawing: {type: Number, default: 0},    //提现中
        withdrawn: {type: Number, default: 0}   //已提现
    },
    expertInfo: {type: ExpertInfoSchema, default: {}},
    authSign: {type: String, default: ''},
    lastLogin: {type: Number, default: 0}
}, {
    timestamps: 1,
    toJSON: {
        transform(doc, ret) {
            delete ret.passwd;
        }
    },
    toObject: {
        transform(doc, ret) {
            delete(ret._id);
            delete(ret.id);
            delete(ret.__v);
        }
    }
});

let FollowSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    list: {type: [Schema.Types.ObjectId], default: []}
}, {timestamps: 1});

let PushTokenSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    token: {type: String, required: true},
    platform: {type: String}
}, {timestamps: 1});

// let SSOSchema = new Schema({
//     _id: {type: Schema.Types.ObjectId},
//     union_id: {type: String, default: ''},  //微信union_id
//     qq: {
//         openid: {type: String, default: ''},
//         token: {type: String, default: ''},
//         nick: {type: String, default: ''},
//         avatar: {type: String, default: ''},
//         expire: {type: Number, default: 0}
//     },
//     weixin: {
//         openid: {type: String, default: ''},
//         token: {type: String, default: ''},
//         nick: {type: String, default: ''},
//         avatar: {type: String, default: ''},
//         expire: {type: Number, default: 0}
//     },
//     weixinWeb: {
//         openid: {type: String, default: ''},
//         token: {type: String, default: ''},
//         refresh_token: {type: String, default: ''},
//         scope: {type: [String], default: []},
//         expire: {type: Number, default: 0},
//         wx_info: {
//             nickname: {type: String, default: ''},
//             sec: {
//                 type: String, default: '', set: i=>i == '1' ? '男' : '女',
//                 province: {type: String, default: ''},
//                 city: {type: String, default: ''},
//                 country: {type: String, default: ''},
//                 headimgurl: {type: String, default: ''},
//                 privilege: {type: [String], default: []},
//             }
//         },
//     },
//     weibo: {
//         openid: {type: String, default: ''},
//         token: {type: String, default: ''},
//         nick: {type: String, default: ''},
//         avatar: {type: String, default: ''},
//         expire: {type: Number, default: 0}
//     }
// }, {_id: false, timestamps: 1});

let SSOSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId, required: true},
    valid: {type: Boolean, default: true},
    type: {type: String, required: true},//weixin,weibo,qq
    openid: {type: String, default: ''},
    unionid: {type: String, default: ''},
    access_token: {type: String, default: ''},
    expire_at: {type: Date, default: null},
    refresh_token: {type: String, default: ''},
    refresh_at: {type: Date, default: null},
    nick: {type: String, default: ''},
    avatar: {type: String, default: ''}
});

let UserWithdrawSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    passwd: {type: String, default: ''},
    answer1: {type: String, default: ''},
    answer2: {type: String, default: ''},
    answer3: {type: String, default: ''},
    withdraw: {
        type: {type: String, default: 'alipay'},    //支付类型，alipay、weixin
        id: {type: String, default: ''},
        name: {type: String, default: ''}
    }
}, {timestamps: 1});

UserSchema.plugin(BaseModel);
SSOSchema.plugin(BaseModel);

UserSchema.virtual('userID').get(function () {
    return this._id.toString();
});

UserSchema.virtual('expert_status').get(function () {
    return this.expertInfo.status;
});

UserSchema.method('toInfo', function (userID) {
    let info = {
        avatar: this.avatar,
        intro: this.intro,
        nick: this.nick,
        email: this.email,
        phone: this.phone,
        userID: this._id.toString(),
        expert_status: this.expertInfo.status,
        user_info: this.toUser(),
        expert_info: {},
        updatedAt: this.updatedAt,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin
    };
    let self = this;
    return function *() {
        info.expert_info = yield self.toExpert(userID);
        return info;
    }
});

UserSchema.method('toUser', function () {
    return {
        userID: this._id.toString(),
        nick: this.nick,
        city: this.userInfo.city,
        avatar: this.avatar
    }
});

UserSchema.method('toExpert', function (userID) {
    let info = {
        userID: this._id.toString(),
        name: this.userInfo.name,
        avatar: this.avatar,
        title: this.expertInfo.title,
        major: this.expertInfo.major,
        finished: this.expertInfo.finished,
        note_replied: this.expertInfo.note_replied,
        note_listened: this.expertInfo.note_listened,
        confirm_time: this.expertInfo.confirm_time,
        confirm_rate: this.expertInfo.confirm_rate,
        rating: this.expertInfo.rating,
        note_price: this.expertInfo.note_price,
        is_follow: false,
        category: this.expertInfo.category,
        city: this.userInfo.city,
        company: this.expertInfo.company,
        work_year: this.expertInfo.work_year
    };
    if (info.confirm_rate == 0) {
        info.confirm_rate_text = '暂无';
    } else if (info.confirm_rate < 0.4) {
        info.confirm_rate_text = '低';
    } else if (info.confirm_rate_text < 0.7) {
        info.confirm_rate_text = '中';
    } else {
        info.confirm_rate_text = '高';
    }
    return function *() {
        if (userID) {
            info.is_follow = yield require('../../proxy/user/user').isFollow(userID, info.userID);
        }
        return info;
    }
});

SSOSchema.pre('save', function (next) {
    switch (this.type) {
        case 'weixin':
        case 'weixinweb':
        case 'weixinwap':
            break;
        case 'qq':
        case 'weibo':
            delete(this.info);
            break;
    }
    next();
});

UserSchema.index({phone: 1});
UserSchema.index({email: 1});

SSOSchema.index({'qq.openid': 1});
SSOSchema.index({'weixin.openid': 1});
SSOSchema.index({'weibo.openid': 1});

PushTokenSchema.index({token: 1});
// PushTokenSchema.index({createdAt: 1}, {expireAfterSeconds: 86400 * 30});

mongoose.model('User', UserSchema, 'user');
mongoose.model('UserSSO', SSOSchema, 'userSSO');
mongoose.model('Follow', FollowSchema, 'userFollow');
mongoose.model('UserWithdraw', UserWithdrawSchema, 'userWithdraw');
mongoose.model('UserPushToken', PushTokenSchema, 'userPushToken');

