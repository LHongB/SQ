/**
 * Created by Administrator on 2017/10/10.
 */

// 留言  --- 一级回复的处理

const validator = require('validator');
const Article = require('../model/Article');
const Reply = require('../model/Reply');
const User = require('../model/User');
const at = require('../common/at');
const saveMessage = require('../common/message');

exports.postReply = (req, res, next) =>{
    let content = validator.trim(req.body.content);
    console.log(req.body);
    //  服务端的数据验证
    if( content === '' ){
        return res.end('内容不能为空');
    }
    // 判断文章是否存在
    let article_id = req.params.article_id;
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
        console.log(article);
        //
        let reply = new Reply();
        reply.content = content;
        // 回复的那篇文章id
        reply.article_id = article_id;
        // 回复人
        reply.author = req.session.user._id;

        reply.save().then( (reply) =>{
            // 保存回复数据
            return reply;
        }).then( (reply) =>{
            //  1.当前回复作者的积分+5，回复数量+1

            User.getUserById(req.session.user._id, (err, user) =>{
                if(err){
                    return res.end(err);
                }
                user.score += 5;
                user.reply_count += 1;
                user.save();
                req.session.user = user;
            })

            return reply;
        }).then( (reply) =>{
            // 2.更新文章的回复数量+1，最新回复的那个人，最新回复的时间，最新的那条回复
            article.reply_num += 1;
            article.last_reply_time = new Date();
            article.last_reply = reply._id;
            article.last_reply_author = req.session.user._id;
            article.save();
            return reply;
        }).then( (reply) =>{
            // 3. 通知文章作者(屏蔽掉自我留言)，有人给他留言了
            if( article.author._id.toString() !== req.session.user._id.toString() ){
                saveMessage.saveReplyMessage(article_id,req.session.user._id, article.author._id, reply._id);
            }
            return reply;
        }).then( (reply) =>{
            // 4. 如果有@user(屏蔽掉自我@)的出现，得通知被@的那个人
            at.sendAtMessage(content, article_id, req.session.user._id, reply._id);
            return reply;
        }).then( (reply) =>{
            res.end('success');
        }).catch( (err) =>{
            res.end(err);
        })



    })
}



