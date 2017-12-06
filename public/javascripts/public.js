/**
 * Created by hama on 2017/5/11.
 */
//公共的JS
// $(document).ready(function(){
//  当文档加载完成之后，再来加载js代码
// })
$(function(){

    // 二级回复中的鼠标点击事件 --- 事件委派(即将生成的标签绑定事件)
    // on(事件名，绑定的标签， callback)
    $(document).on('click', '.comment_btn', function(ev){
        let target = $(ev.currentTarget);
        let parent = target.closest('.aw-item');
        let reply_id = parent.attr('id');
        let commentItem = target.closest('.comment-item');
        // 要回复的作者
        let targetAuthor = commentItem.attr('target');
        // 二级回复的id
        let targetId = commentItem.attr('id');
        // 获取编辑器
        let editor = parent.find('textarea.editor').data('editor');
        // 获取跳转的form表单
        let form = parent.find(`#${reply_id}_form`);
        form.data('comment_author_id', targetAuthor);


        console.log('事件委派');
        // 获取对应form的id  `#${reply_id}_form`
        // 修改url路径的锚文本信息
        location.hash = `#${reply_id}_form`;
        // 更新编辑器的值
        editor.value(`回复${targetAuthor} : `);

    })
})

