const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const _ = require('lodash');
//
const partials = require('express-partials');
// 导入session
const session = require('express-session');

// 导入设置文件
const setting = require('./setting');
// 导入用户设置文件
const auth = require('./common/auth');

//引入routes.js路由文件
const routes = require('./routes');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 对cookie进行签名  == 加密
app.use(cookieParser( setting.cookie_secret ));

app.use(express.static(path.join(__dirname, 'public')));
// 设置session
app.use(session({
    secret:setting.cookie_secret,
    resave:true,
    saveUninitialized:true
}))

// 加载用户session设置
app.use(auth.create_session);



// 设置session数据，可在浏览器端接收
app.use((req, res, next)=>{
    // 全局设置res.locals对象，浏览器端的模板页面均可接收数据
    // res.render(pa1,{}) {}中设置的数据保存在res.locals对象中
    res.locals.msgCount = req.session.msgCount;
    res.locals.userInfo = req.session.user;
    res.locals.isLogin = req.session.isLogin;
    next();
})

//  管道函数，next()执行下一个函数，直到返回响应数据 终止
// app.get('/getAsk',function(req, res, next){
//     next();
// }, function(req, res, next){
//     next()
// }, function(req, res, next){
//     // next();
// } , function(req, res){
//
//     res.end()
// })



//使用该路由规则
app.use('/', routes);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3002,()=>{
  console.log('node is OK');
})
module.exports = app;

