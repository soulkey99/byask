/**
 * Created by MengLei on 2016-05-30.
 */
"use strict";
const model = require('../../model');

exports.getSession = function (session_id) {
    return model.UserSession.findById(session_id);
};

