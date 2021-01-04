//滚动的dv
var $dList = $('.div_scroll');

var websocket;
// 首先判断是否 支持 WebSocket
if ('WebSocket' in window) {
    websocket = new WebSocket("ws://127.0.0.1:8000/server");
} else if ('MozWebSocket' in window) {
    websocket = new MozWebSocket("ws://127.0.0.1:8000/server");
} else {
    websocket = new SockJS("ws://127.0.0.1:8000/server");
}

websocket.onopen = function (evnt) {
    console.log('ws clint:open websocket');
    //发送消息 
    var obj = {"msgContent": "dran", "sex": "man"};
    var jstring = JSON.stringify(obj);
    console.log('ws clint:send msg:' + jstring)
    websocket.send(jstring);
};
//websocket 接受消息
websocket.onmessage = function (evnt) {
    if (evnt.data == "成功建立socket连接") {

    }
    console.log('数据已接收:' + evnt.data.detect);
    var data = $.parseJSON(event.data);
    if (data.detect != null && data.detect.length > 0) {
        changeBottomImg(data);
        changeRealTimeViolation(data);
    }
};

websocket.onerror = function (evnt) {
    console.log('ws client:error ' + evnt);
};

websocket.onclose = function (evnt) {
    console.log('ws clent:close ');
}
function playVideo(num) {
    var url = $('#url' + num).val().trim();
    if (url == ''){
        toastr.warning('播放地址不能为空!');
        return;
    }
        document.getElementById("source_"+num).src = url;
        document.getElementById("playercontainer"+num).load();
        var player = new EZuikit.EZUIPlayer("playercontainer"+num);
        // 日志
        player.on('log', log);

        function log(str){

        }
}
//更改下面的图片
function changeBottomImg(){

    $.ajax({
        url: "http://127.0.0.1:8000/smartsafe/getBottomImage",
        type: 'get',
        async: false,
        success: function (data) {
            if (data.data!=null && data.success==true){
                for (var i=0;i<data.data.length;i++){
                    $('#bottom_img'+(i+1)).attr('src',data.data[i].imageUrl);
                }
            }
        },
        error: function (err) {

        }
    })
}
//更改实时告警列表
function changeRealTimeViolation(data){
    scrollDiv(data);
}
//滚动动画
function scrollDiv(data) {
    //获取div高度
    var length = $(".div_scroll").children().length;
    if (length>=6){
        var scrollHeight = $('.div_scroll div:first').height();
        //滚出一个li的高度
        $dList.stop().animate({marginTop:-scrollHeight},600,function () {
            //动画结束后
            var a=document.getElementsByClassName("div_scroll");
            var b=document.getElementsByClassName("realTimeViolation");
            //默认是从下标0开始，想要移除第二个就是a[1].remove();
            b[0].remove();
            $dList.css("marginTop",0);
            var tempString = '';
            if (data.detect!=null && data.detect.length>0){
                for (var i=0;i<data.detect.length;i++){
                    tempString =  data.detect.type+tempString;
                }
            }
            $dList.append("<div class='realTimeViolation'><span>"+"设备 "+data.deviceId+"发生"+"</span><button class='btn btn-default btn_bottom' type='button'>进入</button></div>");
        })
    }else {
        var tempString = '';
        if (data.detect!=null && data.detect.length>0){
            for (var i=0;i<data.detect.length;i++){
                tempString = data.detect.type+tempString;
            }
        }
        $dList.append("<div class='realTimeViolation'><span>"+"设备 "+data.deviceId+"发生"+"</span><button class='btn btn-default btn_bottom' type='button'>进入</button></div>");

    }


}

//每隔5秒更新底部图片
setInterval(changeBottomImg,5000);

function timestampToTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
}