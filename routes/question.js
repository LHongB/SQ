/**
 * Created by hama on 2017/5/12.
 */
//引入静态
const mapping = require('../static');
const setting = require('../setting');
const validator = require('validator');
const Article = require('../model/Article');
const User = require('../model/User');
// 导入消息通知机制
const at = require('../common/at');
const Reply = require('../model/Reply');

// 文章的详情页面展示
exports.index = (req,res,next)=>{
    // 获取文章的id
    let article_id = req.params.id;
    Article.getArticleById(article_id, (err,msg, article, replys) =>{
        if(err){
            return res.end(err);
        }

        if(msg){
            return res.render('error', {
                message:'',
                error:msg
            })
        }

        // 浏览次数加1
        article.click_num++;
        article.save();

        res.render('question',{
            title:'问题--社区问答系统',
            layout:'indexTemplate',
            article:article,
            replys:replys
        })
    })


}
// 发布页面显示
exports.create = (req,res,next)=>{
    res.render('create-question',{
        title:'新建--社区问答系统',
        layout:'indexTemplate',
        categorys:setting.categorys
    })
}
exports.edit = (req,res,next)=>{
    res.render('edit-question',{
        title:'编辑--社区问答系统',
        layout:'indexTemplate'
    })
}
// 文章发布处理
exports.postCreate = (req, res, next) => {
    console.log(req.body);
    // 去掉字符前后的空格
    // 获取文章的标题、内容、分类
    let title = validator.trim(req.body.title);
    let content = validator.trim(req.body.content);
    let category = validator.trim(req.body.category);
    let error;

    // 服务端进行数据验证
    if( !validator.isLength(title, {min:10, max:50}) ){
        error = '文章的标题长度，不小于10个字符，不大于50个字符';
    }

    if( !validator.isLength(content, 0) ){
        error = '内容不能为空';
    }
    // map()通过return 改变数组元素，形成新的数组
    let allTabs = setting.categorys.map(function(item){
        // console.log(item);
        return item[0];
    })
    // console.log(allTabs);
    if( !allTabs.includes(category) ){
        error = '请选择一个正确的分类';
    }
    if(error){
        return res.end(error);
    }
    //  存储发布的作者id，
    req.body.author = req.session.user._id;

    // 生成实例化数据
    let newObj = new Article(req.body);
    // 存储文章
    newObj.save().then( (article) =>{
        // --- 修改作者的相关信息：文章发布数量+1，积分+5
        User.getUserById(req.session.user._id, (err, user) => {
            if(err){
                return res.end(err);
            }
            user.socre += 5;
            user.article_count += 1;
            user.save();
            // 更新存储在req.session.user中的数据
            req.session.user = user;
            // 跳转到相对应的文章页面
            res.json({message:'success', url:`/question/${article._id}`})
        })
        return article;   // return出来的是个新的promise对象
    }).then( (article) =>{
        // @某人的时候，消息通知处理
        // 1. 判断发布的内容中包含@user的存在，最终结果得到[@user]
        // 2. 如果存在，通知被@的那个人 ==== 生成一条message信息
        at.sendAtMessage(content, article._id, req.session.user._id);

        return article;
    })
        .catch(  (err) => {
        res.end(err);
    })
// @某人的消息通知类型：
// 1.发布成功后，可以@某个人，可以来查看文章，也可以评论(一级)
// 2.一级评论的时候，也可以@某个人，可以查看文章，可以查看一级评论，可以评论(一级/二级)

//    当前消息的内容
// 1. 谁(当前文章作者)在某篇文章(当前文章标题)中提到了你(被@的那个人)
// 包含的数据结构：文章作者，当前文章，被@的那个人，发布时间，是否已读
}