/**
 * Created by MengLei on 2016-06-12.
 */
"use strict";
const userConn = require('../index').userConn;
const Schema = require('mongoose').Schema;
const BaseModel = require('../baseModel');

let UserSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    phone: {type: String, default: ''},
    email: {type: String, default: ''},
    nick: {type: String, default: ''},
    authSign: {type: String, default: ''},
    status: {type: String, default: 'offline'},
    userType: {type: String, default: ''},
    userInfo: {
        name: {type: String, default: ''},
        gender: {type: String, default: ''},
        id_no: {type: String, default: ''},
        age: {type: String, default: ''},
        birthday: {type: String, default: ''},
        channel: {type: String, default: ''},
        address: {
            country: {type: String, default: '中国'},
            province: {type: String, default: ''},
            city: {type: String, default: ''},
            region: {type: String, default: ''},
            address: {type: String, default: ''}
        },
        school: {type: String, default: ''},
        student_info: {
            grade: {type: String, default: ''},
            watchedTeachers: [String]
        },
        promoter: {type: Boolean, default: false},
        teacher_info: {
            grades: [{
                grade: {type: String},
                subjects: [{
                    subject: {type: String}
                }]
            }],
            verify_type: {type: String, default: 'notVerified'},
            id_pic: {type: String, default: ''},
            certificate_pic: {type: String, default: ''},
            verify_desc: {type: String, default: ''},
            admin_reason: {type: String, default: ''},
            orders_grabbed: {type: Number, default: 0},
            order_finished: {type: Number, default: 0},
            stars: {type: Number, default: 0},
            point: {type: Number, default: 0},
            senior_grades: [{   //付费教师开的年级科目
                grade: {type: String},
                subjects: [{
                    subject: {type: String}
                }]
            }],
            senior_pre_grades: [{   //付费教师申请中的年级科目
                grade: {type: String},
                subjects: [{
                    subject: {type: String}
                }]
            }],
            senior_type: {type: String, default: 'notVerified'},    //付费教师审核状态，notVerified\verified\waitingVerify\fail
            order_type: {type: String, default: 'all'},    //仅针对付费教师，接所有单或者仅付费单，all、senior
            senior_grabbed: {type: Number, default: 0},     //接付费单数量
            senior_stars: {type: Number, default: 0},   //付费单获得的星数
            channel: {type: String, default: ''},    //内部使用，标识教师特殊渠道
            senior_info: {  //付费教师的详细信息
                teach_years: {type: String, default: ''},
                teach_feature: {type: String, default: ''},
                honor_pics: {type: [String], default: []},
                honors: {type: [String], default: []}
            },
            updateAt: {type: Number, default: 0}    //教师信息的更新时间
        },
        special_info: { //特殊科目信息
            subject: {type: [String]}
        },
        verify_info: {
            verify_desc: {type: String, default: ''},
            id_pic: {type: String, default: ''},
            certificate_pic: {type: String, default: ''},
            verify_type: {type: String, default: 'notVerified'},
            admin_reason: {type: String, default: ''}
        },
        ext_info: {
            first: {type: Boolean, default: false},
            promoterShareCode: {type: String, default: ''}
        },
        money: {type: Number, default: 0},  //学生端的钱包信息
        create_time: {type: Number, default: 0},
        last_login: {type: Number, default: 0},
        avatar: {type: String, default: ''},
        bonus: {type: Number, default: 0},
        money_info: {   //教师端的钱包信息
            money: {type: Number, default: 0},  //余额
            withdrawing: {type: Number, default: 0},    //提现中
            withdrawn: {type: Number, default: 0}   //已提现
        }
    },
    sso_info: {
        qq: {
            openid: {type: String, default: ''},
            token: {type: String, default: ''},
            nick: {type: String, default: ''},
            avatar: {type: String, default: ''},
            expire: {type: Number, default: 0}
        },
        weixin: {
            openid: {type: String, default: ''},
            token: {type: String, default: ''},
            nick: {type: String, default: ''},
            avatar: {type: String, default: ''},
            expire: {type: Number, default: 0}
        },
        weibo: {
            openid: {type: String, default: ''},
            token: {type: String, default: ''},
            nick: {type: String, default: ''},
            avatar: {type: String, default: ''},
            expire: {type: Number, default: 0}
        }
    },
    withdraw_info: [{
        type: {type: String},
        id: {type: String},
        name: {type: String},
        t: {type: Number}
    }],
    passwd: {type: String, default: ''},
    autoReply: {type: String, default: ''},
    intro: {type: String, default: '这个人很懒，什么也没留下！！！'},
    pubID: {type: String, default: ''},
    blocked: {type: Boolean, default: false},
    linkID: {type: [String], default: []},
    config: {},
    menu: [{
        type: {type: String, default: ''},
        text: {type: String, default: ''},
        dest: {type: String, default: ''},
        list: [{
            type: {type: String, default: ''},
            text: {type: String, default: ''},
            dest: {type: String, default: ''}
        }]
    }],
    checkCode: {type: String, default: ''}
}, {_id: false});

UserSchema.plugin(BaseModel); //为了引入BaseModel

UserSchema.virtual('userID').get(function () {    //userID
    return this._id.toString();
});

UserSchema.pre('save', function (next) {
    if (this.userType == 'public') {
        this.userInfo.student_info = undefined;
        this.userInfo.teacher_info = undefined;
        this.autoReply = undefined;
        this.sso_info = undefined;
        this.linkID = undefined;
    } else {
        this.checkCode = undefined;
        this.pubID = undefined;
        this.userInfo.verify_info = undefined;
        this.menu = undefined;
    }
    next();
});

let ConfSchema = new Schema({
    _id: {type: Schema.ObjectId},
    phonenum: {type: String, default: ''},
    name: {type: String, default: ''},
    desc: {type: String, default: ''},
    type: {type: String, default: ''},
    smscode: {type: String},
    status: {type: String, default: 'normal'},
    expire: {type: Date},
    delete: {type: Boolean, default: false}
});
ConfSchema.plugin(BaseModel);
ConfSchema.index({phonenum: 1});

ConfSchema.index({expire: 1}, {expireAfterSeconds: 60});

UserSchema.index({'phone': 1}, {unique: false});
UserSchema.index({'email': 1}, {unique: true});

userConn.model('ByUser', UserSchema, 'users');
userConn.model('ByUserConf', ConfSchema, 'userConf');
