const secret = require('../config/secret.json');
const jwt = require('jsonwebtoken');
const util = require('util');
const verify = util.promisify(jwt.verify);
const UserModel = require('../models/user.js');
// 验证token
let verifyToken = async (ctx) => {
    if(ctx.request.header.authorization) {
        let token = ctx.request.header.authorization.split(' ')[1];
        let payload = await verify(token, secret.sign);
        let user = await UserModel.queryUser(payload.name);
        if (user[0]) {
            user = user[0];
        } else {
            //do nothing
        }
        //转化成json对象
        let strUser = JSON.stringify(user);
        let dbUser = JSON.parse(strUser);
        let f1 = function getLocalTime(nS) {
            return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
        }
        if (dbUser.token === token && payload.exp - Date.now() / 1000 > 0) {
            return true;
        } else {
            return false;
        }
    }else {
        console.log('token认证失败')
        return false;
    }
}
//时间格式化
function MYTime() {
    this.time = function () {
        let d = new Date();
        let hours = d.getHours();
        let minute = d.getMinutes();
        minute = minute < 10 ? '0' + minute : minute;
        let day = d.getDate();
        let month = d.getMonth() + 1;
        let year = d.getFullYear();
        return `${year}/${month}/${day}/${hours}:${minute}`
    }
}
module.exports = {
    verifyToken,
    MYTime
}