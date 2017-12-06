/**
 * Created by hama on 2017/5/9.
 */
//首页的所有请求都写在这儿.
//引入静态
const mapping = require('../static');
const User = require('../model/User');
// 数据验证模块，
const validator = require('validator');
const Dbset = require('../model/db');
const setting = require('../setting');
const mail = require('../common/mail');

const auth = require('../common/auth');
// 导入文章集合
const Article = require('../model/Article');

// 首页数据显示
exports.index = (req,res,next)=>{
    // 获取当前跳转的分类
    let category = req.query.category;
    let query = {};
    // { category:category }
    // { category:{$ne:'job'} }
    if( category ){
        query.category = category;
    }else {
        query.category = {$ne:'job'};
    }

    // 获取所有的文章(除了招聘外)
    Article.getFullArticles(query, (err, articles) =>{
        if(err){
            return res.end(err);
        }

        res.render('index',{
            title:'首页--社区问答系统',
            layout:'indexTemplate',
            // 所有的文章
            articles:articles,
            // 已知(设置)的分类
            categorys:setting.categorys,
            cate:category
        })
    })


}
exports.login = (req,res,next)=>{
    res.render('login',{
        title:"登录页面--社区问答系统",
        layout:'indexTemplate',
        resource:mapping.login
    })
}
exports.register = (req,res,next)=>{
    res.render('register',{
        title:'注册页面--社区问答系统',
        layout:'indexTemplate',
        resource:mapping.register
    })
}

// 注册数据处理
exports.postZhuce = (req, res, next) => {
    console.log(req.body);

    // 服务端进行数据验证
    let name = req.body.name;
    let password = req.body.password;
    let email = req.body.email;
    // 错误数据 / 验证失败的数据
    let error = '';

    if( !validator.matches(name,/^[a-zA-Z][a-zA-Z0-9_]{4,11}$/, 'g') ){
        error = '用户名不合法，以字母开头，数字、字母、_';
    }
    if( !validator.matches(password, /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{5,11}/, 'g') ){
        error = '密码不合法，长度为5-11';
    }
    if( !validator.isEmail(email) ){
        error = '邮箱不合法'
    }
    if(error){
        return res.end(error);
    }

    // 判断用户是否存在  or([{},{}])多条件查找
    User.findOne().or([{name:name}, {email:email}]).then( (user) => {
        if(user){
            return res.end('用户名/邮箱已存在');
        }
        // 存储数据
        // 密码加密
        let newPsd = Dbset.encrypt(password, setting.PSDkey);
        req.body.password = newPsd;
        console.log(req.body);

        // let newUser = new User(req.body);
        // newUser.save().then( (data) =>{
        //     res.end('success');
        // }).catch((err)=>{
        //     res.end(err);
        // })

        // 向注册的邮箱发送注册成功的邮件
        let reqMsg = {name:name, email:email};
        mail.sendMails(reqMsg, function(err, info){
            if(err){
                console.log('邮件发送失败');
            }
        })

        Dbset.addOne(User, req, res, 'success');
    }).catch((err) => {
        res.end(err);
    })


}

// 登录数据处理
exports.postLogin = (req, res, next) => {
    console.log(req.body);
    let name = req.body.name;
    let password = req.body.password;
    let getName;
    let getEmail;
    let error ;

    // 判断登录账户是用户名还是邮箱 @   string.includes()  返回值boolean
    // console.log( name.includes('@') );
    name.includes('@') ? getEmail = name : getName = name;
    // 服务端进行数据验证
    if( getEmail ){
        if( !validator.isEmail(name) ){
            error = '邮箱不合法'
        }
    }
    if( getName ){
        if( !validator.matches(name,/^[a-zA-Z][a-zA-Z0-9_]{4,11}$/, 'g') ){
            error = '用户名不合法，以字母开头，数字、字母、_';
        }
    }
    if( !validator.matches(password, /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{5,11}/, 'g') ){
        error = '密码不合法，长度为5-11';
    }

    if(error){
        return res.end(error);
    }
    // 声明一个变量,存储函数的变量，通过输入的内容，判断通过哪个方法查找用户
    let getUser;
    if(getName){
        getUser = User.getUserByName;
    }
    if(getEmail){
        getUser = User.getUserByEmail;
    }
// 判断用户是否存在
    getUser(name, (err, user) => {
        if(err){
            return res.end(err);
        }

        if(!user){
            return res.end('用户/邮箱不存在，请注册...');
        }
        //判断密码是否相等， 先加密
        let newPsd = Dbset.encrypt(password, setting.PSDkey);
        if( newPsd !== user.password ){
            return res.end('密码不相等，请重新输入');
        }
        // 创建cookie
        auth.create_cookie(user,res);
        res.end('success');
    })
}

// 发布时，提到某人； 留言时，提到某人； 评论留言时，提到某人

// as1122在文章中提到了你 文章名称
// as1122 回复你的问题  文章名称
// as1122  评论了你在文章的留言 文章名称
// 消息通知中包含的数据结构： 登录的用户 、 文章名称、消息类型type，被通知的那个人，是否被读过

// 退出处理
exports.tuichu = (req, res, next) => {
    req.session.destroy();  // 销毁数据
    res.clearCookie(setting.auth_cookie_name);  // 清空cookie
    res.redirect('/');
}
