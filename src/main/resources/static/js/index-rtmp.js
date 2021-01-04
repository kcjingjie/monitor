var baseUrl = 'http://123.57.131.21:10031';
var sockerUrl = 'ws://123.57.131.21:10031/server';

//滚动的dv
var $dList = $('.div_scroll');

initContainer();
function initContainer() {
    var container = document.getElementById("playercontainer1");
    var container2 = document.getElementById("playercontainer2");
    var container3 = document.getElementById("playercontainer3");

    var containerHeight = container.offsetWidth * 4 / 6;
    container.style.height = containerHeight+'px';
    container2.style.height =  containerHeight+'px';
    container3.style.height =  containerHeight+'px';

}

var websocket;
// 首先判断是否 支持 WebSocket
if ('WebSocket' in window) {
    websocket = new WebSocket(sockerUrl);
} else if ('MozWebSocket' in window) {
    websocket = new MozWebSocket(sockerUrl);
} else {
    websocket = new SockJS(sockerUrl);
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
    if (evnt.data == "连接成功") {
        console.log('websocket连接服务器成功。');
        return;
    }
    var data = $.parseJSON(event.data);
    // console.log('数据已接收:' + data.detect);
    if (data.detect != null && data.detect.length > 0) {
        changeRealTimeViolation(data);
        // changeBottomImg(data);
        // drawArea(data);
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
        url: baseUrl + "/smartsafe/getBottomImage",
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
    if (data.detect != null && data.detect.length > 0)
    {
        for (var i = 0; i < data.detect.length; i++)
        {
            var tempDetect = data.detect[i];
            var array = [];
            array.push('<div class="realTimeViolation"><span>设备：');
            array.push(data.deviceId);
            array.push('，类型：');
            array.push(getDetectTypeStr(tempDetect.type));
            array.push('，概率：');
            array.push(tempDetect.probability);
            array.push('%，时间：');
            array.push(new Date(tempDetect.time).Format('yyyy-MM-dd hh:mm:ss'));
            array.push('。</span></div>');
            if(length >= 13)
            {
                var scrollHeight = $('.div_scroll div:first').height();
                //滚出一个li的高度
                $dList.stop().animate({marginTop:-scrollHeight},100,function () {
                    //动画结束后
                    var b = document.getElementsByClassName('realTimeViolation');
                    //默认是从下标0开始，想要移除第二个就是a[1].remove();
                    // console.log('scrollHeight = ' + scrollHeight);
                    b[0].remove();
                    $dList.append(array.join(''));
                    $dList.css('marginTop',0);
                });
            }
            else
            {
                $dList.append(array.join(''));
                length += 1;
            }
        }
    }
}

function getDetectTypeStr(type){
    if(type == 1)
        return '安全帽';
    if(type == 2)
        return '安全绳';
    if(type == 3)
        return '着装';
    if(type == 4)
        return '跨越围栏';
    return '未知';
}

//每隔5秒更新底部图片
setInterval(changeBottomImg,5000);

function getOSDTime(index){
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
        return data;
    })
}
