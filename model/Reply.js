/**
 * Created by Administrator on 2017/10/10.
 */
// 一级回复 ---- 留言集合

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');
const setting = require('../setting');
const _ = require('lodash');
const moment = require('moment');

const ReplySchema = new Schema({
    // 回复的id
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    // 回复的内容
    content:{
        type:String,
        require:true
    },
    // 回复时间：
    create_time:{
        type:Date,
        default:Date.now
    },
    // 回复的那个人
    author:{
        type:String,
        ref:'User'
    },
    // 回复的那篇文章
    article_id:{
        type:String,
        ref:'Article'
    },
    // 二级回复数量 --- comment
    comment_num:{
        type:Number,
        default:0
    },
    // 当前回复的点赞量
    likes:{
        type:Number,
        default:0
    },
    // 回复是否被删除
    deleted:{
        type:Boolean,
        default:false
    }

})
ReplySchema.statics = {
    // 查找当前文章所有的一级回复
    getReplysByArticleId:(article_id, callback) =>{
        Reply.find({article_id:article_id, deleted:false}).populate('author article_id').then((replys) =>{
            callback(null, replys);
        }).catch( (err) =>{
            callback(err);
        })
    },
    // 根据id查找某个回复
    getReplyById:(reply_id, callback) =>{
        Reply.findOne({'_id':reply_id, deleted:false}).then( (reply) =>{
            if( !reply ){
                return callback(null, '当前留言不存在，不能进行评论');
            }
            callback(null, '', reply);

        }).catch( (err) =>{
            callback(err);
        })
    }
}
//  设置实例对象的方法
ReplySchema.methods.create_time_ago = function(){
    // this.create_time;
    let time = moment(this.create_time).fromNow();
    return time;
}
const Reply = mongoose.model('Reply', ReplySchema);
module.exports = Reply;