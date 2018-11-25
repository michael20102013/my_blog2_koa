const mongoose = require('mongoose');
const userScheam = require('../schema/user.js');
const db = require('../config/db.js');
const _models = mongoose.model('_models', userScheam);
// const _models = mongoose.model('_models',mongoose.Schema({
//     name:String,
//     password:String
// }))
const secret = require('../config/secret.json');
const jwt = require('jsonwebtoken');
const util = require('util');
const verify = util.promisify(jwt.verify);
class UserModel {
    //模型化用户表
    /**
     * 创建一条user数据
     * @param data
     * @returns {Promise.<*>}
     */
    static async createUser(data) {
        let example = new _models(data);
        return await example.save(function (err, example) {
            if (err) {
                console.log('用户保存失败');
                return false
            } else {
                console.log(example)
                console.log('用户保存成功')
                return true
            }
        })

        // const userSchema2 = mongoose.Schema({
        //     name:String,
        //     password:String
        // });
        // const modelTest = mongoose.model('modelTest', userSchema2);
        // let _data = new _models({
        //     name:'wcxTest2018'
        // });
        // // const unitiy = new modelTest(data);
        // _data.save(function(err,docs){
        //     if(err){
        //         console.log(err)
        //     }
        //     else{
        //         console.log(docs)
        //     }
        // })    
    }
    /**
     * 更新一条user数据
     * @param name
     * @returns {Promise.<boolean>}
     */
    static async updateUser(name, data) {
        let conditions = { name };
        let update = { $set: data };//要更新的数据
        return await _models.update(conditions, update, function (err, res) {
            if (err) {
                console.log('err', err)
                return false;
            } else {
                console.log(`update ${name} succcess`);
                return true;
            }
        })
    }
    /**
     * 查询一条user数据
     * @param name
     * @returns {Promise.<*>}
     */
    static async queryUser(name) {
        console.log('entering db')
        return await _models.find({ name: name }, function (err, docs) {
            if (err) {
                console.log(err);
            } else {
                return docs;
            }
        });
    }
}
module.exports = UserModel

