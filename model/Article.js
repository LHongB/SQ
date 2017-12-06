/**
 * Created by hama on 2017/5/10.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');
const setting = require('../setting');
const _ = require('lodash');
const at = require('../common/at');
const Reply = require('./Reply');

//  日期格式化工具
const moment = require('moment');

// 设置全局语言  -- 使用中文
moment.locale('zh-cn');

const ArticleSchema = new Schema({
    // 标题、问题补充、分类、作者、创建时间、更新时间、回复数量、浏览次数、点赞数量、
    //  最后的回复作者、最后的回复时间、最后的回复内容、是否被删除
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    title:{
        type:String,
        require:true
    },
    content:{
        type:String,
        require:true
    },
    create_time:{
        type:Date,
        default:Date.now
    },
    update_time:{
        type:Date,
        default:Date.now
    },
    category:{
        type:String,
    },
    author:{
        type:String,
        ref:'User'   // 集合关联，ref：参考的集合名称
    },
    // 浏览次数 === 点击量
    click_num:{
        type:Number,
        default:0
    },
    // 回复次数
    reply_num:{
        type:Number,
        default:0
    },
    // 点赞数量
    likes_num:{
        type:Number,
        default:0
    },
    // 最后回复的那个人
    last_reply_author:{
        type:String,
        ref:'User'
    },
    // 最后回复的内容  === 最后的那个回复
    last_reply:{
        type:String,
        ref:'Reply'
    },
    // 最后回复的时间
    last_reply_time:{
        type:Date,
        default:Date.now
    },
    // 删除功能
    deleted:{
        type:Boolean,
        default:false
    }

})

// 设置虚拟属性(键值对)， 当前属性存在，可以读取值，但是不会保存至数据库中
ArticleSchema.virtual('categoryName').get(function(){
    console.log(this.category);
    let category = this.category;

    // 判断分类是否存在/是否合法  [[],[],[]]
    //  通过find方法查找第一个符合条件的元素，
    // 如果符合条件，返回第一个匹配条件的元素
    // 如果没有符合条件，返回undefined
    let cates = _.find(setting.categorys, function(item){
        // item:每个数组元素 []
        return item[0] === category;
    })

    // 通过return 返回值，设置该虚拟属性的值
    if( cates ){
        return cates[1];
    }else {
        return '';
    }

})


// 设置静态方法
ArticleSchema.statics = {
    // 通过id查找当前文章
    getArticleById:(id, callback) =>{
        // populate() 关联查询 --- 查询并获取参考集合的数据
        Article.findOne({'_id':id, deleted:false}).populate('author').then( (article) =>{
            // 判断文章是否存在
            if( !article ){
                return callback(null, '文章不存在或已删除')
            }
            // 获取当前文章所有的回复列表
            Reply.getReplysByArticleId(article._id, (err, replys) =>{
                callback(null,'',  article, replys);
            })



        }).catch( (err) =>{
            callback(err);
        })
    },
    // 获取所有的文章列表
    getFullArticles:(query, callback) =>{
        Article.find(query, {deleted:false}).sort({'create_time':-1}).populate('author').then( (articles) =>{
            callback(null, articles);
        }).catch( (err) =>{
            callback(err);
        })
    }
}
//  设置实例对象的方法
ArticleSchema.methods.create_time_ago = function(){
    // this.create_time;
    let time = moment(this.create_time).fromNow();
    return time;
}

const Article = mongoose.model('Article',ArticleSchema);
module.exports = Article

