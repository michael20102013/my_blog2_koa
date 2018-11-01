const jwt = require('jsonwebtoken');
const secret = require('../config/secret.json');
const util = require('util');
const verify = util.promisify(jwt.verify);

/**
 * 判断token是否可用
 */
module.exports = function () {
    console.log('passing')
    return async function (ctx, next) {
        try{
            // 获取jwt
            let token = false;
            if(ctx.header.Authorization){
                token = ctx.header.Authorization;
                console.log('token1', token);                
            }else{}
            if(token)
            {
                try{
                    // 解密payload， 获取用户名和ID
                    let payload = await verify(token, secret.sign);
                    console.log('errorPayload', payload)
                    ctx.user = {
                        name: payload.name
                    }
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
            } else {
                err.status = 404;
                ctx.body = '404';
                console.log('不服就怼: ', err)
            }
        }
    }
}