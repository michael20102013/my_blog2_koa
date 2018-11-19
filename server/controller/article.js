const ArticleModel = require('../models/articles.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secret = require('../config/secret.json');
const util = require('util');
const verify = util.promisify(jwt.verify);
const common = require('../common/common.js')
class ArticleController {
    //增加文章
    static async createArticle (ctx) {
        const data = ctx.request.body;
        let verifyTk = await common.verifyToken(ctx);
        if(verifyTk === true){
            let addArticle = await ArticleModel.createArticle(data)
            if(addArticle){
                ctx.body = {
                    message:'文章添加成功',
                    cc:0,
                }         
            }else{
                ctx.body = {
                    message:'文章添加失败',
                    cc:1,
                }                
            }
        }else{
            throw(ctx.throw(401));
        }        
    }
    static async deleteArticle (ctx) {
        
    }
    //更新文章
    static async updateArticle (ctx) {
            let verifyTk = await common.verifyToken(ctx);
            const data = ctx.request.body;
            if (verifyTk === true) {
                let articles = await ArticleModel.updateArticle(data);
                if (articles) {
                    ctx.body = {
                        message: '文章更新成功',    
                        cc: 0,
                        data: articles                  
                    }
                } else {
                    ctx.body = {
                        message: '文章更新失败',
                        cc: 1
                    }
                }
            }else {}
    }
    //设置PV 和 UV 信息
    static async setPVandUV(ctx) {
        let verifyTk = await common.verifyToken(ctx);
        console.log('verifyTk', verifyTk)
        //只有未登录才有统计
        if (verifyTk === false) {
            let user_view_ip =
                ctx.req.headers['x-forwarded-for'] ||
                ctx.req.connection.remoteAddress ||
                ctx.req.socket.remoteAddress ||
                ctx.req.connection.socket.remoteAddress;
            let data = {
                _id: ctx.request.body._id,
                page_view_time: ctx.request.body.page_view_time,
                page_view_count: ctx.request.body.page_view_count,
                user_view_ip: user_view_ip,
                user_view_count: ctx.request.body.user_view_count
            }
            let articles = await ArticleModel.setPVandUV(data, false);
            if (articles) {
                ctx.body = {
                    message: '文章PV更新成功',
                    cc: 0,
                }
            } else {
                ctx.body = {
                    message: '文章PV更新失败',
                    cc: 1
                }
            }
        }else {
            ctx.body = {
                message: '登录用户不设置PV和UV',
                cc: 1,
            }            
        }
    }
    //评论文章
    static async commentArticle(ctx) {
        let data = {
            _id: ctx.request.body._id,
            comment: ctx.request.body.comment
        }
        let comments = await ArticleModel.commentArticle(data);
        if(comments) {
            ctx.body = {
                message: '评论成功',
                data: comments,
                cc: 0
            }
        }else {
            ctx.body = {
                message: '评论失败',
                cc: 1
            }
        }   
    }
    //查询文章
    static async queryArticle (ctx) {
        const data = ctx.request.body;
        let id = data.id ? data.id : undefined;
        let limit = data.limit ? data.limit : -1;
        let skip = data.skip ? data.skip : 0; 
        let articles = await ArticleModel.queryArticles(id, limit, skip);
        if (articles) {
            ctx.body = {
                message: '文章查询成功',
                data: articles,
                cc: 0
            }
        }else{
            ctx.body = {
                message: '文章查询成功',
                data: articles,
                cc: 0
            }            
        }
    }
}
module.exports = ArticleController