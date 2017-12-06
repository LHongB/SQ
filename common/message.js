/**
 * Created by Administrator on 2017/10/9.
 */
// 生成所有的通知消息模块

const Message = require('../model/Message');
const saveMessage = {
    saveAtMessage:(article_id, author_id, target_id) =>{
        let message = new Message();
        message.atType = 'at';
        // 谁在某篇文章中提到了你
        message.article_id = article_id;
        message.author_id = author_id;
        message.target_id = target_id;
        //  保存
        message.save((msg) =>{
            console.log('保存成功');
        })
    },
    // 谁在某篇文章的留言中提到了你
    saveReplyAtMessage:(article_id, author_id, target_id, reply_id) =>{
        let message = new Message();
        message.atType = 'replyAt';
        message.article_id = article_id;
        message.author_id = author_id;
        message.target_id = target_id;
        message.reply_id = reply_id;
        //  保存
        message.save((msg) =>{
            console.log('一级回复保存成功');
        })
    },
    // 谁在某篇文章中给你留言了
    saveReplyMessage:(article_id, author_id, target_id, reply_id, comment_id) =>{
        let message = new Message();
        message.atType = 'reply';
        message.article_id = article_id;
        message.author_id = author_id;
        message.target_id = target_id;
        message.reply_id = reply_id;
        message.comment_id = comment_id
        //  保存
        message.save((msg) =>{
            console.log('一级回复保存成功');
        })
    }
}

module.exports = saveMessage