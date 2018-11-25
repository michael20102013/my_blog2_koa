const jwt = require('jsonwebtoken');
const secret = require('../config/secret.json');
const util = require('util');
const verify = util.promisify(jwt.verify);

/**
 * 判断token是否可用
 */
module.exports = function () {
    return async function (ctx, next) {
        try{
            // 获取jwt
            let token = false;
            if(ctx.header.authorization){
                token = ctx.header.authorization;
            }else{}
            if(token)
            {
                try{
                    // 解密payload， 获取用户名和ID
                    // let payload = await verify(token, secret.sign);
                    // console.log('errorPayload', payload)
                    // ctx.user = {
                    //     name: payload.name
                    // }
                }
                catch(err){
                    console.log(`token verify fail: `, err)
                }
            }
            console.log(`token2: ${token}`);

            await next();
        }
        catch(err){
            if(err.status === 401) {
                ctx.body = {
                    cc: 401,
                    message: '认证失败'
                }
            }else if(err.message.indexOf('jwt expired') !== -1) {
                err.status = 200;
                ctx.body = {
                    cc: 2,
                    message: 'token 过期'
                }
                console.log(err);
            } 
            else {
                err.status = 404;
                ctx.body = '404';
                console.log('不服就怼: ', err)
            }
        }
    }
}