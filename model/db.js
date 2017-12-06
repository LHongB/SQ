/**
 * Created by hama on 2017/5/9.
 */
const mongoose = require('mongoose');
const setting = require('../setting');
const crypto = require('crypto');
const url = require('url');
const User = require('./User');

//这句话说明我们使用的promise对象是ES6中原生的promise对象.
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${setting.host}/${setting.db}`);
const DbSet = {
    // let newUser = new User(req.body);
    // newUser.save().then( (data) =>{
    //     res.end('success');
    // }).catch((err)=>{
    //     res.end(err);
    // })
    // 增加一条新数据
    addOne:function(obj, req, res , msg){
        console.log('进入123');
        let newObj = new obj(req.body);
        newObj.save().then( (user) =>{
            res.end(msg);
        }).catch((err)=>{
            res.end(err);
        })
    },
    // 封装加密代码
    //加密
    encrypt : function(data,key){ // 密码加密
        let cipher = crypto.createCipher("bf",key);
        let newPsd = "";
        newPsd += cipher.update(data,"utf8","hex");
        newPsd += cipher.final("hex");
        return newPsd;
    },
    // 解密
    decrypt : function(data,key){ //密码解密
        let decipher = crypto.createDecipher("bf",key);
        let oldPsd = "";
        oldPsd += decipher.update(data,"hex","utf8");
        oldPsd += decipher.final("utf8");
        return oldPsd;
    },
}
module.exports = DbSet