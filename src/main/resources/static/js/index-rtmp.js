var canvas,canvas2,canvas3;
//decoder
var decoder1,decoder2,decoder3;
//声明下面的cxt
var cxt1;
var cxt2;
var cxt3;
//更改图片的下标
var changeIndex = 0;
//滚动的dv
var $dList = $('.div_scroll');

initContainer();
function initContainer() {
    var container = document.getElementById("playercontainer1");
    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetWidth * 4 / 6;

    var player = new EZuikit.EZUIPlayer("playercontainer1");

    // 日志
    player.on('log', log);

    function log(str){
    }



}
function handleError(e) {
    console.log('捕获到错误', e);
}

function handleSuccess() {
    console.log("播放成功回调函数，此处可执行播放成功后续动作");
}

function getToken() {
    var token = '';
    $.ajax({
        url: "https://open.ys7.com/api/lapp/token/get",
        type: 'POST',
        async: false,
        data: {
            appKey: '04dd4edbcc944faea177776aad714b72',
            appSecret: 'dbc1b753f17d66986b776c7bb9a41622'
        },
        success: function (data) {
            console.log(data);
            if (data.code == '200') {
                token = data.data.accessToken;
            } else if (data.code == "111001") {
                return false;
            } else {

            }
        },
        error: function (err) {

        }
    })
    //return 'ra.0ujl1qgjd7dgeb460r1vw8dxc3fjpyzk-1sdfy728u9-1cgbj8l-3zduoaeis';
    return token;
}

function playVideo(num) {
    var url = $('#url' + num).val().trim();
    if (url == ''){
        toastr.warning('播放地址不能为空!');
        return;
    }
    if (num ==1 ){
        document.getElementById("source_1").src = url;
        document.getElementById("playercontainer1").load();
        var player = new EZuikit.EZUIPlayer("playercontainer1");
        // 日志
        player.on('log', log);

        function log(str){

        }
    }
    if (num ==2 ){
        document.getElementById("source_2").src = url;
        document.getElementById("playercontainer2").load();
        var player = new EZuikit.EZUIPlayer("playercontainer2");
        // 日志
        player.on('log', log);

        function log(str){

        }
    }

    if (num ==3 ){
        document.getElementById("source_3").src = url;
        document.getElementById("playercontainer3").load();
        var player = new EZuikit.EZUIPlayer("playercontainer3");
        // 日志
        player.on('log', log);

        function log(str){

        }
    }

}

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
        drawArea(data);
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
//根据编号初始化canvas
function initCanvas(num) {
    if (num == 1){
        canvas = document.getElementById("canvas"+num);
        cxt1 = canvas.getContext("2d");
    } else if (num == 2 ){
        canvas2 = document.getElementById("canvas"+num);
        cxt2 = canvas2.getContext("2d");
    }else {
        canvas3 = document.getElementById("canvas"+num);
        cxt3 = canvas3.getContext("2d");
    }

}
//根据设备编号画canvas
function drawArea(data) {
    var index = 0;
    var tempCxt;
    if (data.deviceId != ''){
        for (var i =1;i<4;i++){
            var playUrl = $('#url'+i).val();
            if (playUrl.indexOf(data.deviceId)>-1){
                index = i;
                if (index == 1){
                    tempCxt = cxt1;
                } else if (index == 2 ){
                    tempCxt = cxt2;
                }else {
                    tempCxt = cxt3;
                }
                break;
            }
        }
    }
    var canvas = document.getElementById("canvas"+index);
    var canvasWidth = canvas.offsetWidth;
    var canvasHeight = canvas.offsetWidth * 4 / 6;
    canvas.height = 0;
    canvas.width = 0;
    canvas.height =canvasHeight;
    canvas.width = canvasWidth;
    tempCxt.clearRect(0, 0, canvasWidth, canvasHeight);
    tempCxt.strokeStyle = "#FF0000";
    //根据比例来
    var container = document.getElementById("playercontainer1");
    var width = container.offsetWidth;
    var height = container.offsetWidth * 4 / 6;
    var videoTime = getOSDTime(index);
    //这里判断视频的时间和监测的时间匹配度 5秒
    if (videoTime > data.detectTime){

    }
    for (var i = 0; i < data.detect.length; i++) {
        tempCxt.moveTo(data.detect[i].polygon.position[0] / 100 * width, data.detect[i].polygon.position[1] / 100 * height);
        for (var j = 0; j < data.detect[i].polygon.count; j++) {
            tempCxt.lineTo(data.detect[i].polygon.position[j*2] / 100 * width, data.detect[i].polygon.position[j*2+1] / 100 * height);
        }
        tempCxt.lineTo(data.detect[i].polygon.position[0] / 100 * width, data.detect[i].polygon.position[1] / 100 * height);
    }
    tempCxt.stroke();
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

setInterval(clearRect,5000);

function clearRect() {
    for(var index =0;index<3;index++){
        var canvas = document.getElementById("canvas"+index);
        if (canvas != null && canvas !=undefined){
            var canvasWidth = canvas.offsetWidth;
            var canvasHeight = canvas.offsetWidth * 4 / 6;
            canvas.height = 0;
            canvas.width = 0;
            canvas.height =canvasHeight;
            canvas.width = canvasWidth;
            var tempCxt = canvas2.getContext("2d");
            tempCxt.clearRect(0, 0, canvasWidth, canvasHeight);
        }

    }

}

//每隔5秒更新底部图片
setInterval(changeBottomImg,5000);

function getOSDTime(index){
    console.log(new Date().getSeconds());
    var tempDecoder;
    if (index == 1){
        tempDecoder = decoder1;
    }else if( index == 2){
        tempDecoder = decoder2;
    }else {
        tempDecoder = decoder3;
    }
    var getOSDTimePromise = tempDecoder.getOSDTime();
    getOSDTimePromise.then(function(data){
        console.log("getOSDTime success",data)
        console.log(timestampToTime(data));
    })
    console.log(new Date().getSeconds())
}
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