/**
 * Created by MengLei on 2016-06-24.
 */
"use strict";
const model = require('../../model');

/**
 * 根据小纸条ID获取小纸条记录
 * @param note_id
 * @returns {Query}
 */
exports.getNoteByID = function *(note_id) {
    return model.Note.findById(note_id);
};

/**
 * 根据query获取小纸条列表
 * @param query
 * @param opt
 * @returns {*}
 */
exports.getNotesByQuery = function *(query, opt) {
    return yield model.Note.find(query, {}, opt);
};

/**
 * 获取指定用户的小纸条回应率
 * @param userID
 * @returns {*}
 */
exports.getNoteConfirmRate = function *(userID) {
    let total = yield model.Note.count({expert_id: userID});
    let replied = yield model.Note.count({expert_id: userID, status: 'replied'});
    return total == 0 ? 0 : (replied / total).toFixed(3);
};

/**
 * 用户获取自己发出的小纸条列表
 * @param param = {userID: '', page: '', limit: '', status: ['', '', '']}
 * @returns {Array}
 */
exports.getUserNoteList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {
        userID: param.userID
    };
    if (param.status) {
        query['status'] = {$in: param.status};
    }
    let notes = yield model.Note.find(query).sort({createdAt: -1}).skip(start).limit(count);
    return yield arrangeNotes(notes, {user: true, expert: true, reply: true, userID: param.userID});
};

/**
 * 偷听支付成功
 * @param param = {userID: '', note_id: ''}
 */
exports.payListenSuccess = function *(param) {
    let note = yield model.Note.findById(param.note_id);
    if (!note) {
        return null;
    }
    if (note.list.indexOf(param.userID) >= 0) {
        return null;
    }
    return yield [
        model.Note.findByIdAndUpdate(param.note_id, {$addToSet: {list: param.userID}}),
        model.NoteListen.findByIdAndUpdate(param.userID, {
            $addToSet: {
                list: {
                    note_id: param.note_id,
                    t: new Date()
                }
            }
        }, {upsert: true})];
};

/**
 * 用户获取自己偷听过的小纸条列表
 * @param param = {userID: '', start: '', page: '', limit: ''}
 * @returns {Array}
 */
exports.getListenList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let history = yield model.NoteListen.findById(param.userID, {list: {$slice: [start, count]}});
    if (!history) {
        return [];
    }
    if (history.list.length == 0) {
        return [];
    }
    let ids = [];
    history.list.forEach(item =>ids.push(item.note_id));
    let notes = yield model.Note.find({_id: {$in: ids}});
    let list = yield arrangeNotes(notes, {user: true, expert: true, reply: true, userID: param.userID});
    list.forEach(item=> {
        for (let j = 0; j < history.list.length; j++) {
            if (!history.list[j].note_id) {
                continue;
            }
            if (history.list[j].note_id.toString() == item.note_id) {
                item.listenAt = item.t;
            }
        }
    });
    list.sort((a, b)=>b.listenAt - a.listenAt);
    return list;
};

/**
 * 用户查看专家回答过的小纸条列表
 * @param param = {userID: '', expert_id: '', page: '', limit: ''}
 * @returns {Array}
 */
exports.getExpertAnsweredList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let notes = yield model.Note.find({
        expert_id: param.expert_id,
        status: 'replied'
    }).sort({replyAt: -1}).skip(start).limit(count);
    return yield arrangeNotes(notes, {user: true, expert: true, userID: param.userID || ''});
};

/**
 * 专家获取自己接到的小纸条列表
 * @param param = {userID: '', page: '', limit: '', status: ''}
 * @returns {Array}
 */
exports.expertList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {expert_id: param.userID};
    if (param.status) {
        query['status'] = param.status;
    }
    let notes = yield model.Note.find(query).sort({createdAt: -1}).skip(start).limit(count);
    return yield arrangeNotes(notes, {user: true, reply: true, expert: true});
};

/**
 * 创建小纸条
 * @param param = {userID: '', expert_id: '', price: '', content: ''}
 * @returns {*}
 */
exports.createNote = function *(param) {
    let note = new (model.Note)();
    note.userID = param.userID;
    note.expert_id = param.expert_id;
    note.anonymous = param.anonymous;
    note.price = param.price;
    note.content = param.content;
    return yield note.save();
};

/**
 * 专家回复完小纸条后，如果小纸条是被支付成功的，那么将钱打入专家的余额中
 * @param note_id
 * @returns {*}
 */
exports.replied = function *(note_id) {
    let pay = yield model.Pay.findOne({note_id: note_id, status: 'paid'});
    if (!pay) {
        throw(new Error('小纸条支付信息不存在！'));
    }
    yield require('../other/money').addMoney(pay.pay_id);
    return pay;
};

/**
 * 用户获取发现专区内的小纸条列表
 * @param param = {start: '', page: '', limit: '', userID: ''}
 * @returns {*}
 */
exports.getDiscover = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let notes = yield model.Note.find({
        status: 'replied'
    }).sort({replyAt: -1}).skip(start).limit(count);
    return yield arrangeNotes(notes, {user: true, expert: true, userID: param.userID || ''});
};

/**
 * 根据给定的小纸条ID列表获取小纸条列表
 * @param ids = [] 小纸条id列表
 * @param userID 用户ID
 * @returns {*}
 */
exports.getNoteListByIDs = function*(ids, userID) {
    let res = yield model.Note.find({_id: {$in: ids}});
    let rawList = yield arrangeNotes(res, {user: true, expert: true, userID});
    let list = [];
    for (let i = 0; i < ids.length; i++) {
        for (let j = 0; j < rawList.length; j++) {
            if (ids[i].toString() == rawList[j].note_id.toString()) {
                list.push(rawList[j]);
            }
        }
    }
    return rawList;
};

/**
 * 根据给定的一个userID获取
 * @param id
 * @param userID
 * @returns {*}
 */
exports.getOneNoteInfo = function *(id, userID) {
    let note = yield model.Note.findById(id);
    if (!note) {
        return null;
    }
    let list = yield arrangeNotes([note], {user: true, expert: true, userID});
    return list[0];
};

/**
 * 管理端获取小纸条列表
 * @param param = {userID: '', expert_id: '', status: [], start: '', limit: ''}
 * @returns {Array}
 */
exports.getAdminList = function*(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {};
    if (param.userID) {
        query['userID'] = param.userID;
    } else if (param.expert_id) {
        query['expert_id'] = param.expert_id;
    }
    if (param.status) {
        query['status'] = param.status;
    }
    let res = yield model.Note.find(query).sort({createdAt: -1}).skip(start).limit(count);
    return yield arrangeNotes(res, {user: true, expert: true, reply: true});
};


/**
 * 重新组织小纸条列表数据
 * 说明：opt.user=true在返回结果中加入user信息，opt.expert=true在返回结果中加入专家信息，opt.reply=true在结果中直接返回回复语音URL
 * 对于opt.reply=false的情况，需要判断用户是否支付过该纸条，如果支付过，那么返回reply内容，否则不返回，同时，判断如果用户是该纸条
 * 的提出者或者回答者，那么不判断是否支付，直接返回回答语音URL
 * @param notes，从db中查询出来的小纸条列表数据
 * @param opt = {user: true/false, expert: true/false, reply: true/false, userID: ''}，是否加入用户信息、专家信息
 * @returns {Array}
 */
function* arrangeNotes(notes, opt) {
    let list = [];
    for (let i = 0; i < notes.length; i++) {
        let item = {
            note_id: notes[i].note_id,
            userID: notes[i].userID,
            expert_id: notes[i].expert_id,
            price: notes[i].price,
            anonymous: !!notes[i].anonymous,
            status: notes[i].status,
            content: notes[i].content,
            reply: opt.reply ? notes[i].reply : '',
            needPay: !opt.reply,    //是否需要支付收听
            length: notes[i].length,
            listen: notes[i].list.length,
            ups: notes[i].ups.length,
            createdAt: notes[i].createdAt,
            replyAt: notes[i].replyAt || '',
            cancelAt: notes[i].cancelAt || '',
            payAt: notes[i].payAt || ''
        };
        if (item.status == 'paid') {
            item.time_left = 48 * 60 * 60 * 1000 - (Date.now() - notes[i].createdAt);
        }
        if (!opt.userID) {
            opt.userID = '';
        }
        if (!opt.reply) {
            if (notes[i].userID.toString() == opt.userID.toString() || notes[i].expert_id.toString() == opt.userID.toString()) {
                item.reply = notes[i].reply;
                item.needPay = false;
            } else {
                for (let j = 0; j < notes[i].list.length; j++) {
                    if (opt.userID.toString() == notes[i].list[j].toString()) {
                        item.reply = notes[i].reply;
                        item.needPay = false;
                    }
                }
            }
        }
        if (opt.user && !item.anonymous) {
            let user = yield model.User.findById(item.userID);
            item.user_info = user.toUser();
        }
        if (opt.expert) {
            let expert = yield model.User.findById(item.expert_id);
            item.expert_info = yield expert.toExpert(opt.userID);
        }
        list.push(item);
    }
    return list;
}

exports.arrangeNote = arrangeNotes; //export给外界使用
