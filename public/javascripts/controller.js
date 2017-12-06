/**
 * Created by hama on 2017/5/11.
 */
//控制器文件
// 注册功能
const zhuceApp = angular.module('zhuceApp', []);
zhuceApp.controller('zhuceCtrl', ($scope, $http) => {
    //
    $scope.data = {};
    // 错误
    $scope.error = '';
    // 正确的显示数据
    $scope.success = '';

    $scope.postForm = (ev) => {
        ev.preventDefault();
        $http({
            method:'POST',
            url:'/register',
            data:$.param($scope.data),   // 转换成字符串序列化对
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            }
        }).then( (result) =>{
            console.log(result);
            if( result.data == 'success' ){
                $scope.success = '注册成功，3s秒跳转至登录页面，请注意查收邮件';
                setTimeout(()=>{
                    location.href = '/login';
                }, 3000);
            } else {
                $scope.error = result.data;
                $('#errorbox').fadeIn();
                setTimeout(()=>{
                    $('#errorbox').fadeOut();
                }, 1000)
            }

        }).catch( (error) => {
            console.log(error);
        })
    }
})

// 登录功能
const loginApp = angular.module('loginApp', []);
loginApp.controller('loginCtrl', ($scope, $http) => {
    //
    $scope.data = {};
    // 错误
    $scope.error = '';
    // 正确的显示数据
    $scope.success = '';

    $scope.postForm = (ev) => {
        ev.preventDefault();
        $http({
            method:'POST',
            url:'/login',
            data:$.param($scope.data),   // 转换成字符串序列化对
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            }
        }).then( (result) =>{
            console.log(result);
            if( result.data == 'success' ){
                $scope.success = '登录成功，1s后跳转至首页';
                setTimeout(()=>{
                    location.href = '/';
                }, 1000);
            } else {
                $scope.error = result.data;
                $('#errorbox').fadeIn();
                setTimeout(()=>{
                    $('#errorbox').fadeOut();
                }, 1000)
            }

        }).catch( (error) => {
            console.log(error);
        })
    }
})

// 文章发布
const createApp = angular.module('createApp', []);
createApp.controller('createCtrl', ($scope, $http) => {
    $scope.data = {};
    // 设置补充内容的提示信息
    $scope.isShow = true;

    /// 生成markdown编辑器的实例
    const simplemde = new SimpleMDE({
        element: $("#question")[0] ,
        status:false,   // 隐藏状态栏
        styleSelectedText:false,
    });
    // 监听编辑器中内容变化
    simplemde.codemirror.on("change", function(){
        // console.log(simplemde.value());
        if( simplemde.value() == '' ){
            $scope.isShow = true;
            // 将视图数据扩展至模型('数据库'中存储的数据)中
            $scope.$apply('');
        } else{
            $scope.isShow = false;
            $scope.$apply('');
        }
    });

    // 设置文章的提交
    $scope.postForm = (ev) => {
        ev.preventDefault();
        $scope.data.content = simplemde.value();

        $http({
            method:'POST',
            url:'/question/create',
            data:$.param($scope.data),
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            }
        }).then((result) => {
            // console.log(result)
            let data = result.data;
            if( typeof data === 'object' ){
                alert('发布成功');
                location.href = data.url;
            }

        }).catch((err) => {
            console.log(err);
        })

    }


})

const replyApp = angular.module('replyApp', []);
// 一级回复  --- 留言处理
replyApp.controller('replyCtrl', ($scope, $http) =>{
    $scope.data = {};
    // 生成编辑器
    const simplemde1 = new SimpleMDE({
        element: $("#liuyan")[0] ,
        status:false,
        styleSelectedText:false,
    });

    $scope.isEmpty = true;
    // 确定编辑器是否有内容
    simplemde1.codemirror.on('change', function(){
        // 去掉前后的空格 trim()
        if( simplemde1.value().trim() == '' ){
            $scope.isEmpty = true;
            // 将视图数据扩展至模型('数据库'中存储的数据)中
            $scope.$apply('');
        } else{
            $scope.isEmpty = false;
            $scope.$apply('');
        }
    })

    $scope.postForm = (ev) =>{
        ev.preventDefault();

        $scope.data.content = simplemde1.value();

        if( $scope.isEmpty ){
            alert('内容不能为空');
        }else {
            // alert('可以提交');
            $http({
                method:'POST',
                url:$('#reply_form').attr('target'),
                data: $.param($scope.data) ,
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            }).then( (result) =>{
                console.log(result);
                let data = result.data;
                if( data === 'success' ){
                    // 重新加载当前页面
                    location.reload();
                }
            }).catch( (err) =>{
                console.log(err);
            })
        }
    }
})

// 二级回复 处理
replyApp.controller('commentCtrl', ($scope, $http) =>{

    $('textarea.editor').each(function(index, element){
        var editor = new SimpleMDE({
            element:element,
            status:false,   // 隐藏状态栏
            styleSelectedText:false,
        });
        // 将编辑器生成DOM树中的节点   --- 参考codemirror render
        editor.render(this);
        // 将编辑器挂载在某个标签中
        // data-*:自定义属性-----设置自定义的数据，存储在标签中
        $(this).data('editor', editor);

    })


    //  点击标签时，显示/隐藏二级回复内容
    $scope.showComment = (ev) =>{
        // 如果有二级回复，需要显示所有的二级回复
        console.log('被点击了...');
        let targetA = $(ev.currentTarget);
        //
        let parent = targetA.closest('.aw-item');
        let commentItem = parent.find('.aw-comment-box');
        let reply_id = parent.attr('id');

        if( commentItem.css('display') === 'none' ){

            $http({
                method:'GET',
                url:`/${reply_id}/showComments`,
                data:'',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            }).then( (result) =>{
                // console.log(result);
                let data  = result.data;
                // console.log(data);
                parent.find('.aw-comment-list').prepend(data);

                commentItem.fadeToggle('fast');

            }).catch( (err) =>{

                console.log(err.data);
            })


        }else {
            // not()
            parent.find('.aw-comment-list').children().not('form').remove();
            commentItem.fadeToggle('fast');
        }


    }

    // 二级/多级回复的提交处理
    $scope.postForm = (ev) =>{
        ev.preventDefault();
        // console.log(ev);
        // 当前点击评论按钮的二级回复表单
        let currentForm = $(ev.currentTarget);
        //  二级回复表单中的编辑器
        let editor = currentForm.find('.editor').data('editor');
        // 获取二级回复的内容
        let content = editor.value().trim();
        let reply_id = currentForm.find("input[name='reply_id']").val();
        let reply_author = currentForm.find("input[name='reply_author']").val();
        let parent = currentForm.closest('.aw-comment-list');

        // 替换数据
        let currentContent = content.replace(/^(回复)[a-zA-Z0-9_]{4,11}\s:\s/, '');



        // 判断提交请求是二级回复还是多级回复   得到comment_id(回复的那个comment的id)
        let comment_author_id = currentForm.data('comment_author_id');
        // console.log( comment_author_id );

        $scope.data = {
            content:currentContent,
            reply_id,
            reply_author,
            comment_author_id
        }

        if( content == '' ){
            alert('内容不能为空');
        }else {
            // alert('可以提交数据了');
            $http({
                method:'POST',
                url:currentForm.attr('target'),
                data:$.param($scope.data),
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            }).then( (result) =>{
                let data = result.data;
                parent.find('.newContent').prepend(data);
                editor.value('');
            }).catch( (err) =>{
                console.log(err);
            })
        }
    }
})

// 处理消息列表
const messageApp = angular.module('messageApp', []);
messageApp.controller('messageCtrl', ($scope, $http) =>{

    // 确定已读处理
    $scope.readOne = (ev) =>{
        let targetA = $(ev.currentTarget);
        let parent = targetA.closest('.aw-item');
        // 获取消息id
        let message_id = parent.attr('message_id');


        $http({
            method:'GET',
            data:'',
            url:`/${message_id}/updateone`,
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            }
        }).then( (result) =>{
            console.log(result);

            if( result.data === 'success' ){
                parent.fadeOut('fast');

                let count = $('#msgCount').html();
                $('#msgCount').html( count - 1 );
                if( (count - 1) == 0 ){
                    $('#msgCount').html('');
                }
            }


        }).catch( (err) =>{
            console.log(err);

        })
    }

    // 全部已读的处理
    $scope.readAll = (ev) =>{
        let targetA = $(ev.currentTarget);
        let parent = targetA.parent('#noread');
        let clearItem = parent.find('.mod-body');

        $http({
            method:'GET',
            data:'',
            url:'/my/updateAll',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            }
        }).then( (result) =>{
            console.log(result);
        }).catch( (err) =>{
            console.log(err);
        })
    }
})
