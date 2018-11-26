const UserModel = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secret = require('../config/secret.json');
const util = require('util');
const verify = util.promisify(jwt.verify);
class UserController {
    static async postLogin (ctx) {
        const data = ctx.request.body;
        //查询用户
		let user = await UserModel.queryUser(data.name);
		if(user[0]){
			user = user[0];
		}else{
			//do nothing
		}
        //转化成json对象
        let strUser = JSON.stringify(user);
		let jsonUsesr = JSON.parse(strUser);
        if(user) {
            // if(bcrypt.compareSync(data['password'], jsonUsesr.password)) {
            if(data['password']===jsonUsesr.password) {
                //用户 token
                const userToken = {
                    name: jsonUsesr.name,
                    id: user.id
                }
                // 签发 token
                const token = jwt.sign(userToken, secret.sign, {expiresIn: 3600 * 24 * 30 * 12 * 10})
                let data = {'token':token};
                //把token存储到数据库
                // UserModel.updateUser(token,data);
                UserModel.updateUser( jsonUsesr.name,data);
                //解析token
                // let payload = await verify(token, secret.sign);
                ctx.body = {
                    name:userToken.name,
                    message: '成功',
                    token,
                    code: 0,
                    cc:0
                }
            }
            else {
                ctx.body = {
                    code: 1,
					message: '用户名和密码错误',
					cc:1
                }
            }
        }
        else {
            ctx.body = {
                code: 2,
                message: '用户名不存在'
            }
        }
    }
    //登出
    static async loginOut (ctx) {
        let token = ctx.request.header.authorization.split(' ')[1];
        let data = {token:"null"};
            let payload = await verify(token, secret.sign);
            let upTk = await UserModel.updateUser(payload.name, data);
            if(upTk){
                ctx.body = {
                    message:'登出成功',
                    cc:0,
                    token:data.token
                }         
            }else{
                ctx.body = {
                    message:'登出失败',
                    cc:1,
                    token
                }                
            }
    }
    static async judgeJWT(ctx){
        // let token = ctx.request.header.authorization.split(' ')[1];
        // let verifyTk = await common.verifyToken(ctx);
        // if(verifyTk === true){
        //     ctx.body = {
        //         message:'登录状态未失效',
        //         cc:0
        //     }             
        // }
        // else{
        //     ctx.body = {
        //         message:'登录状态已失效',
        //         cc:1
        //     }             
        // }
        ctx.body = {
            message:'登录状态未失效',
            cc:0
        }         
    }
    static async test(ctx){
        ctx.body = {
            message:"成功"
        }
    }
}
module.exports = UserController