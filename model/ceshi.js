/**
 * Created by Administrator on 2017/9/30.
 */


var obj = {
    run:function(){
        console.log(1);
        // 调用函数
        user.getUserById('12345', function(value){
            console.log(value);
        });
    }
}

var user = {
    getUserById:function(id, callback){
        var name = 'yan'
        // 调用函数
        callback('yan');
    }
}

obj.run();