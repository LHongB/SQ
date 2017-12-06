/**
 * Created by Administrator on 2017/10/11.
 */
// 二级回复的数据集合   ---- 二级以及后面多级回复的集合
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');
const setting = require('../setting');
const _ = require('lodash');
const moment = require('moment');


const CommentSchema = new Schema({
    // 回复的id
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    // 回复的作者
    author:{
        type:String,
        ref:'User'
    },
    // 文章的作者
    article_author:{
        type:String,
        ref:'User'
    },
    // 文章的id
    article_id:{
        type:String,
        ref:'Article'
    },
    // 一级回复的作者
    reply_author:{
        type:String,
        ref:'User',
    },
    // 一级回复的id
    reply_id:{
        type:String,
        ref:'Reply'
    },
    // 回复的时间
    create_time:{
        type:Date,
        default:Date.now
    },
    // 多级回复的id    --- 可以忽略
    comment_id:{
        type:String,
        ref:'Comment'
    },
    // 多级回复的作者
    comment_author_id:{
        type:String,
        ref:'User'
    },
    // 回复的内容:
    content:{
        type:String,
    },
    // 点赞量
    likes:{
        type:Number,
        default:0
    },
    // 是否删除
    deleted:{
        type:Boolean,
        default:false
    }
})

CommentSchema.statics = {
    getCommentsByReplyId:(reply_id, callback) =>{
        Comment.find({reply_id:reply_id, deleted:false}).sort({create_time:1}).populate('author').then((comments) =>{
            callback(null, comments);
        }).catch( (err) =>{
            callback(err);
        })
    },
    getCommentById:(id, callback) =>{
        Comment.find({'_id':id, deleted:false}).populate('author').then((comments) =>{
            callback(null, comments);
        }).catch( (err) =>{
            callback(err);
        })
    }
}
//  设置实例对象的方法
CommentSchema.methods.create_time_ago = function(){
    // this.create_time;
    let time = moment(this.create_time).fromNow();
    return time;
}
const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;

