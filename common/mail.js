
// 处理邮件发送功能

const setting = require('../setting');
// 处理邮件发送功能的模块
const nodemailer = require('nodemailer');

const mail = {
    sendMails:(msg, callback) => {

        // 创建邮件发送者的邮箱及授权码
        const transporter = nodemailer.createTransport({
            service: '163',
            auth: {
                user: setting.mail_opts.auth.user ,
                pass: setting.mail_opts.auth.pass //授权码,通过QQ获取

            }
        });
        console.log(1234)
        // 发送的邮件配置参数
        const mailOptions = {
            from:setting.mail_opts.auth.user,  // 发送者邮箱
            to: msg.email,   // 接收者邮箱
            subject: `${setting.name}恭喜您，注册成功` ,     // 发送的主题
            // text:`${msg.name}，您好`,   // 发送的标题
            html:`${msg.name}注册成功，赶紧来登录吧...`   // 发送的内容
        }
        console.log( mailOptions );
        // 发送邮件
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                callback(err);
            }
        });

    }
}

module.exports = mail;