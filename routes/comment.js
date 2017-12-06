/**
 * Created by Administrator on 2017/10/11.
 */
// 二级回复的路由函数处理
//引入静态
const mapping = require('../static');
const setting = require('../setting');
const validator = require('validator');
const Article = require('../model/Article');
const User = require('../model/User');
// 导入消息通知机制
const at = require('../common/at');
const Reply = require('../model/Reply');

const saveMessage = require('../common/message');

const Comment = require('../model/Comment');
// 添加二级回复
exports.postComment = (req, res, next) =>{
    console.log(req.body);
    let content = validator.trim( String(req.body.content) );
    let article_id = req.params.article_id;
    let reply_id = req.body.reply_id;
    let reply_author = req.body.reply_author;
    // 当是三级以上的回复时，获取二级回复的id
    let comment_author_id = req.body.comment_author_id;

    if( content === '' ){
        return res.end('内容不能为空');
    }
    // 判断文章是否存在
    Article.getArticleById(article_id, (err, msg, article) =>{
        if(err){
            return res.end(err);
        }
        if(msg){
            return res.render('error', {
                message:'',
                error:msg
            })
        }
        // 判断一级留言是否存在
        Reply.getReplyById(reply_id, (err, replyMsg, reply) =>{
            if(err){
                return res.end(err);
            }
            if(replyMsg){
                return res.render('error', {
                    message:'',
                    error:replyMsg
                })
            }

            let comment = new Comment();
            comment.author = req.session.user._id;
            comment.content = content;
            comment.article_author = article.author._id;
            comment.article_id = article_id;
            comment.reply_id = reply_id;
            comment.reply_author = reply_author;

            if( comment_author_id ){
                comment.comment_author_id = comment_author_id;
            }

            comment.save().then( ( data ) =>{

                return data;
            }).then( (data) =>{
                // 1. 发表评论的人，积分+5，回复数量+1
                User.getUserById(req.session.user._id, (err, user) =>{
                    user.score += 5;
                    user.reply_count += 1;
                    user.save();
                    req.session.user = user;
                })

                return data;
            }).then( (data) =>{
                // 2. 相对应的一级回复，回复数量+1
                reply.comment_num += 1;
                reply.save();
                return data;
            }).then( (data) =>{
                // 3. 优先通知一级回复的作者，有人给他留言了
                if( reply_author.toString() !== req.session.user._id.toString ){
                    saveMessage.saveReplyMessage(article_id, req.session.user._id, reply_author, reply_id);
                }

                return data;
            }).then( (data) =>{
                // 4. 再通知文章作者(屏蔽自我留言)，有人给他留言了
                // 如果文章作者是一级回复的作者，不需要进行通知了
                if( reply_author.toString() !== article.author._id.toString() ){
                    if( reply_author.toString() !== req.session.user._id.toString() ){
                        saveMessage.saveReplyMessage(article_id, req.session.user._id, article.author._id,reply_id, data._id);
                    }
                }
                return data;
            }).then( (data) =>{
                // 5. 通知被@的那个人，有人提到他了
                at.sendAtMessage(content, article_id, req.session.user._id, data._id);
                return data;
            }).then( (data) =>{

                Comment.getCommentById(data._id, (err, comments) =>{
                    if(err){
                        return res.end(err);
                    }
                    res.render('comment', {
                        comments:comments
                    })
                })
            }).catch( (err) =>{
                res.end(err);
            })

        })

    })

}

// 显示二级回复
exports.showComments = (req, res, next) =>{
    console.log( req.params );
    let reply_id = req.params.reply_id;
    // 所有的二级回复
    Comment.getCommentsByReplyId(reply_id, (err, comments) =>{
        if(err){
            return res.end(err);
        }

        res.render('comment', {
            comments:comments
        })
    })
}