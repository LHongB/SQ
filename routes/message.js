/**
 * Created by hama on 2017/5/12.
 */
//引入静态
const mapping = require('../static');
const Message = require('../model/Message');


exports.index = (req,res,next)=>{
    // 获取登录用户的所有消息

    let target_id = req.session.user._id;
    // 未读消息和已读消息
    Message.getNoReadMsgs(target_id, (err, noReadMsgs) =>{
        if(err){
            return res.end(err);
        }
        Message.getReadMsgs(target_id, (err, readMsgs) =>{
            if(err){
                return res.end(err);
            }

            res.render('message-list', {
                title:'消息列表--社区问答系统',
                layout:'indexTemplate',
                resource:mapping.center,
                noReadMsgs:noReadMsgs,
                readMsgs:readMsgs
            })

        })
    });

}
// 更新一条
exports.updateone = (req, res, next) =>{
    let message_id = req.params.message_id;
    Message.getMessageById(message_id, (err, message) =>{
        if(err){
            return res.end(err);
        }
        message.has_read = true;
        message.save();
        res.end('success');
    })
}


// 更新所有的消息
exports.updateall = (req, res, next) =>{
    // 获取作者id
    let target_id = req.session.user._id;
    // 获取该作者所有的未读消息
    Message.getNoReadMsgs(target_id, (err, noReadMsgs) =>{
        if(err){
            return res.end(err);
        }
        noReadMsgs.forEach( (message, index) =>{
            message.has_read = true;
            message.save();
            if( index === noReadMsgs.length - 1 ){
                // 当所有的未读的has_read更新为true时，返回响应数据
                res.end('success');
            }
        })

    });
}