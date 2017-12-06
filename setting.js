/**
 * Created by hama on 2017/5/9.
 */
module.exports = {
    host:'127.0.0.1',
    port:27017,
    db:'Nodeshequ',
    // 项目的名称
    name:'NodeJS社区',
    // 密码加密签名
    PSDkey:'yh',
    // cookie加密
    cookie_secret:'yh-ask',
    // 加密的cookie名称
    auth_cookie_name:'yh-ask',
    // 设置邮件发送的参数
    mail_opts:{
        // 邮件服务器地址
        host:'smtp.163.com',
        // 邮箱账户及授权码
        auth:{
            user:'shequ2018as@163.com',
            pass:'as1122334455'
        }
    },
    // 文章分类设置
    categorys:[
        ['job', '招聘'],
        ['ask' , '问答'],
        ['share', '分享'],
    ]

}
