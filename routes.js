const express = require('express');
const router = express.Router();
//引入首页的路由文件
const home = require('./routes/home');
//引入问题的路由文件
const question = require('./routes/question');
const user = require('./routes/user');
const notify = require('./routes/notify');
const reply = require('./routes/reply');
const comment = require('./routes/comment');
const message = require('./routes/message');

//---------------------------------首页-------------------------------------
router.get('/',home.index);
//登录
router.get('/login',home.login);
//注册
router.get('/register',home.register);
// 注册数据处理
router.post('/register', home.postZhuce);
// 登录数据处理
router.post('/login', home.postLogin);
// 退出
router.get('/logout', home.tuichu);

//-------------------------------问题页面--------------------------------
//新建页面跳转
router.get('/question/create',question.create);
//编辑
router.get('/question/edit',question.edit);
//详情
router.get('/question/:id',question.index);
// 文章新建处理
router.post('/question/create', question.postCreate);


//-------------------------------用户页面----------------------------------
//个人设置
router.get('/setting',user.setting);
//用户列表
router.get('/users',user.all);
//个人中心
router.get('/user/:name',user.index);
//用户发布问题的列表
router.get('/user/:name/questions',user.questions);
//用户回复的列表
router.get('/user/:name/messages',user.messages);

//-----------------------------留言回复列表-------------------------------------
// 留言提交处理
router.post('/:article_id/reply', reply.postReply);

// 二级回复处理
router.post('/:article_id/comment', comment.postComment);
// 二级回复显示
router.get('/:reply_id/showComments', comment.showComments);

//------------------------------消息列表----------------------------------------
// 消息显示
router.get('/my/messages', message.index);
// 更新一条未读为已读
router.get('/:message_id/updateone', message.updateone);

router.get('/notify',notify.index);
module.exports = router;



