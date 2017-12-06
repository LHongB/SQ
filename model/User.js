/**
 * Created by hama on 2017/5/10.
 */
//保存登录用户的信息
const mongoose = require('mongoose');
// 优化数据结构的主键，即_id，格式化为短的、不重复的、唯一的、字符串
const shortid = require('shortid');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    //用户的ID
    _id:{
        type:String,
        default:shortid.generate,
        unique:true //id经常会被查询，所以，把ID作为索引
    },
    //用户名
    name:{
        type:String,
        require:true
    },
    //密码
    password:{
        type:String,
        require:true
    },
    //邮箱
    email:{
        type:String
    },
    //个人简介
    motto:{
        type:String,
        default:'这家伙很懒,什么都没有留下..'
    },
    //个人头像
    avatar:{
        type:String,
        default:'/images/default-avatar.jpg'
    },
    //创建时间
    create_time:{
        type:Date,
        default:Date.now
    },
    // 更新时间
    update_time:{
        type:Date,
        default:Date.now
    },
    // 文章数量
    article_count:{
        type:Number,
        default:0
    },
    // 回复数量
    reply_count:{
        type:Number,
        default:0
    },
    // 积分
    score:{
        type:Number,
        default:0
    },
    // 关注量
    follows:{
        type:Number,
        default:0
    },
    // 被关注量
    be_followed:{
        type:Number,
        default:0
    }

})

// 设置静态方法
UserSchema.statics = {
    /// 通过id查找用户，并返回数据
    getUserById:(id, callback) => {
        User.findOne({'_id':id}).then((user)=>{
            callback(null, user);
        }).catch((err)=>{
            callback(err);
        })
    },
    // 通过name查找用户
    getUserByName:(name, callback) => {
        User.findOne({'name':name}).then((user)=>{
            callback(null, user);
        }).catch((err)=>{
            callback(err);
        })
    },
    // 通过email属性查找用户
    getUserByEmail:(email, callback) => {
        User.findOne({'email':email}).then((user)=>{
            callback(null, user);
        }).catch((err)=>{
            callback(err);
        })
    },
    // 通过多个名称，获取多个用户信息  $in
//  { field: { $in: [<value1>, <value2>, ... <valueN> ] } }
    getUsersByNames:(users, callback) =>{
        User.find({name:{$in:users}}).then((users) =>{
            callback(null, users);
        }).catch((err) =>{
            callback(err);
        })
    }
}


const User = mongoose.model('User',UserSchema);
module.exports = User;

