const ArticleModel = require('../models/articles.js');
const jwt = require('jsonwebtoken');
const util = require('util');
const verify = util.promisify(jwt.verify);
const commonObj = require('../common/common.js')
const fs = require('fs');
const path = require('path');

class ArticleController {
    //增加文章
    static async createArticle (ctx) {
        const data = ctx.request.body;
        let verifyTk = await commonObj.verifyToken(ctx);
        if(verifyTk === true){
            let addArticle = await ArticleModel.createArticle(data)
            if(addArticle){
                ctx.body = {
                    message:'文章添加成功',
                    cc:0
                }         
            }else{
                ctx.body = {
                    message:'文章添加失败',
                    cc:1
                }                
            }
        }else{
            throw(ctx.throw(401));
        }        
    }
    //删除文章
    static async deleteArticle (ctx) {
        const data = ctx.request.body;
        let id = data._id
        let articles = await ArticleModel.deleteArticle(id);
        if (articles) {
            ctx.body = {
                message: '文章删除成功',    
                cc: 0
            }
        } else {
            ctx.body = {
                message: '文章删除失败',
                cc: 1
            }
        }
    }
    //更新文章
    static async updateArticle (ctx) {
            let verifyTk = await commonObj.verifyToken(ctx);
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
        let verifyTk = await commonObj.verifyToken(ctx);
        //只有未登录才有统计
        if (verifyTk === false) {
            let user_view_ip =
                ctx.req.headers['x-forwarded-for'] ||
                ctx.req.connection.remoteAddress ||
                ctx.req.socket.remoteAddress ||
                ctx.req.connection.socket.remoteAddress;
            let article = await ArticleModel.queryArticles(ctx.request.body._id, 1, 0);
            let t = new commonObj.MYTime(this);
            let data = {
                _id: ctx.request.body._id,
                page_view_time: t.time(),
                page_view_count: article[0].page_view_count + 1,
                user_view_ip: user_view_ip
            }
            let articles = await ArticleModel.setPVandUV(data);
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
        let id = ctx.request.body._id;
        let article = await ArticleModel.queryArticles(id, 1, 0);
        let comment_count = parseInt(article[0].comment_count) + 1;
        let data = {
            _id: id,
            comment: ctx.request.body.comment,
            comment_count: comment_count
        }
        let comments = await ArticleModel.commentArticle(data);
        if(comments) {
            ctx.body = {
                message: '评论成功',
                articles: comments,
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
        let data = ctx.request.body;
        if(typeof data === 'string') {
            let obj = {};
            let urlArr = data.split('&');
            urlArr.forEach((item, index) => {
                let paramArr = item.split('=');
                obj[paramArr[0]] = parseInt(paramArr[1])
            })
            data = obj;
        }else {
            //do nothing
        }
        let verifyTk = await commonObj.verifyToken(ctx);
        let id = data.id ? data.id : undefined;
        let limit = data.limit ? parseInt(data.limit) : -1;
        let skip = data.skip ? data.skip : 0;  
        let articles = await ArticleModel.queryArticles(id, limit, skip);
        articles.forEach((item, index) => {
            item.user_view_count = item.user_view.length
        })
        if (articles) {
            ctx.body = {
                message: '文章查询成功',
                data: articles,
                cc: 0,
                islogin: verifyTk
            }
        }else{
            ctx.body = {
                message: '文章查询失败',
                cc: 1,
                islogin: verifyTk
            }
        }
    }
    //上传图片
    static async uploadimg(ctx) {
        let file = ctx.request.file; // 获取上传文件
        // 创建可读流
        const reader = fs.createReadStream(ctx.request.files['image']['path']);
        let filePath = `/shareSource/img/my_blog_img` + `/${ctx.request.files['image']['name']}`;
        let remotefilePath = `http://www.iwangcx.com:8887/img/my_blog_img` + `/${ctx.request.files['image']['name']}`;
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
        return ctx.body = {
            url: remotefilePath,
            message: "文件上传成功",
            cc: 0
        }   
    }   
}
module.exports = ArticleController