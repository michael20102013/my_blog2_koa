const mongoose = require('mongoose');
const articleScheam = require('../schema/articles.js');
const db = require('../config/db.js');
const articles = mongoose.model('articles', articleScheam);
const secret = require('../config/secret.json');
const jwt = require('jsonwebtoken');
const util = require('util');
const verify = util.promisify(jwt.verify);
class ArticleModel {
    //模型化文章表
    /**
     * 创建一条文章数据
     * @param data
     * @returns {Promise.<*>}
     */
    static async createArticle(data) {
        let example = new articles(data);
        try {
            return await example.save()
        }
        catch (err) {
            console.log('文章保存失败');
            return false;
        }
    }
    /**
     * 删除一条文章数据
     * @param id
     * @returns {Promise.<boolean>}
     */
    static async deleteArticle(id) {
        let _id = { _id: mongoose.Types.ObjectId(id) };
        return articles.findByIdAndRemove(_id);
    }
    /**
     * 更新一条文章数据
     * @param data
     * @returns {Promise.<boolean>}
     */
    static async updateArticle(data) {
        let conditions = { _id: mongoose.Types.ObjectId(data._id) };
            let setjson = {};
            (data.md_content !== undefined) && (setjson.md_content = data.md_content);
            (data.html_content !== undefined) && (setjson.html_content = data.html_content);
            (data.update_time !== undefined) && (setjson.update_time = data.update_time);
            (data.title !== undefined) && (setjson.title = data.title);

            let setupdate = { $set: setjson };
            return await articles.findByIdAndUpdate(conditions, setupdate, {new:true});
    }
    /**
     * 设置PV 和 UV
     * @param data
     * @returns {Promise.<boolean>}
     */
    static async setPVandUV(data) {
        let conditions = { _id: mongoose.Types.ObjectId(data._id) };
        //增操作
        let pushjson = {};
        //改操作
        let setjson = {};
        //pv总量
        data.page_view_count && (setjson.page_view_count = data.page_view_count);
        //pv时间
        data.page_view_time && (pushjson.page_view_time = data.page_view_time);
        //uv ip
        data.user_view_ip && (pushjson.user_view = data.user_view_ip);
        let pushupdate = { $addToSet: pushjson };
        let setupdate = { $set: setjson };
        await articles.findByIdAndUpdate(conditions, pushupdate, { new: true });
        return await articles.findByIdAndUpdate(conditions, setupdate, { new: true });        
    }

    /**
     * 评论文章
     * @param data
     * @returns {Promise.<boolean>}
     */
    static async commentArticle(data) {
        let conditions = { _id: mongoose.Types.ObjectId(data._id) };
        let pushjson = {};
        let setjson = {};
        data.comment && (pushjson.comment = data.comment);
        data.comment_count && (setjson.comment_count = data.comment_count);
        let pushupdate = { $addToSet: pushjson };
        let setupdate = { $set: setjson };
        await articles.findByIdAndUpdate(conditions, pushupdate, {new:true});
        return await articles.findByIdAndUpdate(conditions, setupdate, {new:true});
    }
     
    /**
     * 查询文章数据
     * @param id
     * @returns {Promise.<*>}
     */
    static async queryArticles(id, _limit, _skip) {
        let conditions = id ? {_id: mongoose.Types.ObjectId(id)} : {};
        if(_limit === -1) {
            return await articles.find(conditions, null, {new:true}, function (err, docs) {
                if (err) {
                    console.log(err);
                    return false;
                } else {
                    return docs;
                }
            }).skip(_skip);            
        }else{
            return await articles.find(conditions, null, {new:true}, function (err, docs) {
                if (err) {
                    console.log(err);
                    return false;
                } else {
                    return docs;
                }
            }).limit(_limit).skip(_skip);
        }
    }    
     
}
module.exports = ArticleModel

