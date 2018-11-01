const mongoose = require('mongoose');
const articleScheam = require('../schema/articles.js');
const db = require('../config/db.js');
const articles = mongoose.model('articles', articleScheam);
// const _models = mongoose.model('_models',mongoose.Schema({
//     name:String,
//     password:String
// }))
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
        console.log('data', data);
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
        console.log('delete');
        let conditons = { id: id };
        articles.remove(conditons, (err, res) => {
            if (err) {
                console.log('删除失败:', err);
            } else {
                console.log('删除成功：', res);
            }
        })
    }
    /**
     * 更新一条文章数据
     * @param id, data
     * @returns {Promise.<boolean>}
     */
    static async updateArticle(data) {
        console.log('data._id', data._id)
        let conditions = { _id: mongoose.Types.ObjectId(data._id) };
        // let conditions = mongoose.Types.ObjectId(data._id);
        let update = { $set: {
            content:data.content,
            update_time:data.update_time,
            title:data.title
        } };//要更新的数据
        // return await articles.findByIdAndUpdate(conditions, update, {}, (err, res) => {
        //     if (err) {
        //         console.log('err', err)
        //         return false;
        //     } else {
        //         return true;
        //     }
        // })

        return await articles.findByIdAndUpdate(conditions, update, {new:true})        
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

